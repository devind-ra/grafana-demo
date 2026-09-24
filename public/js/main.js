const ENDPOINTS = {
  OK: () => "/api/ok",
  Slow: () => "/api/slow",
  Error: () => "/api/error",
  Item: () => `/api/items/${Math.floor(Math.random() * 1000) + 1}`,
};

const MAX_LOG_ENTRIES = 200;
const SLOW_THRESHOLD_MS = 500;

const stats = { total: 0, ok: 0, error: 0 };
let backgroundTimer = null;
let requestsPerSecond = 5;

const $ = (id) => document.getElementById(id);

function log(message, type = "system") {
  const box = $("log-box");
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  box.prepend(entry);

  while (box.children.length > MAX_LOG_ENTRIES) {
    box.lastElementChild.remove();
  }
}

function recordResult(status) {
  stats.total++;
  if (status >= 200 && status < 300) stats.ok++;
  if (status >= 500) stats.error++;

  $("stat-total").textContent = stats.total;
  $("stat-200").textContent = stats.ok;
  $("stat-500").textContent = stats.error;
}

async function sendRequest(type) {
  const url = ENDPOINTS[type]();
  const start = performance.now();

  try {
    const res = await fetch(url);
    const ms = Math.round(performance.now() - start);
    recordResult(res.status);

    let logType = "ok";
    if (!res.ok) logType = "error";
    else if (ms >= SLOW_THRESHOLD_MS) logType = "slow";

    log(`GET ${url} → ${res.status} (${ms}ms)`, logType);
  } catch (err) {
    recordResult(0);
    log(`GET ${url} → network error: ${err.message}`, "error");
  }
}

async function sendTraffic(type) {
  const input = $("requestPerClick");
  const count = Math.min(200, Math.max(1, parseInt(input.value, 10) || 1));
  input.value = count;

  log(`Sending ${count} × ${type} requests...`);

  const requests = Array.from({ length: count }, () => sendRequest(type));
  await Promise.all(requests);

  log(`Finished ${count} × ${type} requests.`);
}

function startBackgroundTraffic() {
  stopBackgroundTraffic();

  const types = Object.keys(ENDPOINTS);
  backgroundTimer = setInterval(() => {
    const type = types[Math.floor(Math.random() * types.length)];
    sendRequest(type);
  }, 1000 / requestsPerSecond);
}

function stopBackgroundTraffic() {
  clearInterval(backgroundTimer);
  backgroundTimer = null;
}

function toggleBackgroundTraffic(enabled) {
  if (enabled) {
    startBackgroundTraffic();
    log(`Background traffic started at ${requestsPerSecond} req/s.`);
  } else {
    stopBackgroundTraffic();
    log("Background traffic stopped.");
  }
}

function updateRPS(value) {
  requestsPerSecond = Number(value);
  $("rps-value").textContent = requestsPerSecond;

  if (backgroundTimer) startBackgroundTraffic();
}
