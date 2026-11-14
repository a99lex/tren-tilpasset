CREATE TABLE usage_counts (
  day TEXT NOT NULL,
  metric TEXT NOT NULL,
  total INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, metric)
);
