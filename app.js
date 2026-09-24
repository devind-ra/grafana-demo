const express = require("express");
const client = require("prom-client");
const app = express();
const PORT = process.env.PORT || 3000;

const register = new client.Registry();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

client.collectDefaultMetrics({ register });
register.setDefaultLabels({ app: "grafana-demo" });

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

const httpRequestsInFlight = new client.Gauge({
  name: "http_requests_in_flight",
  help: "Number of HTTP requests currently being processed",
  registers: [register],
});

app.use(express.static("public"));
app.use((req, res, next) => {
  if (req.path === "/metrics") return next();

  httpRequestsInFlight.inc();
  const endTimer = httpRequestDuration.startTimer();

  res.on("close", () => {
    const route = req.route ? req.baseUrl + req.route.path : "unmatched";
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);
    endTimer(labels);
    httpRequestsInFlight.dec();
  });

  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/ok", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/slow", async (req, res) => {
  const delay = 100 + Math.random() * 1900;
  await sleep(delay);
  res.status(200).json({ delayMs: Math.round(delay) });
});

app.get("/api/error", (req, res) => {
  if (Math.random() < 0.3) {
    return res.status(500).json({ error: "Random failure" });
  }
  res.status(200).json({ ok: true });
});

app.get("/api/items/:id", (req, res) => {
  res.json({ id: req.params.id });
});

app.listen(PORT, () => {
  console.log(`grafana-demo listening on http://localhost:${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});
