import "./build.mjs";
import { readFileSync } from "node:fs";

const { CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token, TRAIN_D1_ID: database } = process.env;
const worker = process.env.TRAIN_WORKER_NAME || "tren-tilpasset";
if (!/^[a-f0-9]{32}$/i.test(account || "") || !token || !/^[a-z0-9][a-z0-9-]{0,62}$/.test(worker)) {
  throw new Error("Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN. Use a valid TRAIN_WORKER_NAME if overriding the default.");
}
if (database && !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(database)) {
  throw new Error("TRAIN_D1_ID must be a D1 database UUID.");
}

async function cloudflare(path, method = "GET", body) {
  const headers = { Authorization: `Bearer ${token}` };
  if (typeof body === "string") headers["Content-Type"] = "application/json";
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}${path}`, {method, headers, body});
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(`Cloudflare ${method} ${path} failed (${response.status}): ${result.errors?.map(error => error.message).join(", ") || "unknown error"}`);
  }
  return result.result;
}

const {subdomain} = await cloudflare("/workers/subdomain");
if (!subdomain) throw new Error("Set up a workers.dev subdomain in the Cloudflare dashboard first.");
if (database) {
  const sql = readFileSync(new URL("./drizzle/0000_usage.sql", import.meta.url), "utf8");
  await cloudflare(`/d1/database/${database}/query`, "POST", JSON.stringify({
    sql: sql.replace("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ")
  }));
}
const form = new FormData();
form.set("metadata", new Blob([JSON.stringify({
  main_module: "index.js",
  compatibility_date: "2026-11-14",
  bindings: database ? [{name:"DB", type:"d1", id:database}] : []
})], {type:"application/json"}));
form.set("index.js", new Blob([readFileSync(new URL("./dist/server/index.js", import.meta.url))], {
  type:"application/javascript+module"
}), "index.js");
const path = `/workers/scripts/${worker}`;
await cloudflare(path, "PUT", form);
await cloudflare(path + "/subdomain", "POST", JSON.stringify({enabled:true}));
console.log(`https://${worker}.${subdomain}.workers.dev/`);
