# Deploy to Cloudflare Workers

Run the deployment script from the repository root using Node.js 22 or later.

1. Set up your workers.dev subdomain under Workers & Pages in the Cloudflare dashboard.
2. Set `CLOUDFLARE_ACCOUNT_ID` to your account ID and `CLOUDFLARE_API_TOKEN` to an account-scoped token with Workers Scripts Edit permission. Set the token through your shell or a CI secret. Keep it out of Git.
3. To enable usage counts, create a D1 database in the same account and set `TRAIN_D1_ID` to its database UUID. The token then also needs D1 Edit permission. The script initializes the table if needed.
4. Run `node deploy-cloudflare.mjs`. The default Worker name is `tren-tilpasset`. Set `TRAIN_WORKER_NAME` to choose a different name. The script prints the public English URL.

The English planner is at `/`. The sitemap uses the deployed hostname. The usage counts start in the new D1 database. Without a D1 binding the app still works and usage counts are disabled.
