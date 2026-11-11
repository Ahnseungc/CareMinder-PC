// 포트폴리오 스크린샷용 목 백엔드. VITE_SEVER_URL=http://localhost:4020
import http from "node:http";
import { routes } from "./routes.mjs";

const PORT = 4020;

const match = (pattern, path) =>
  new RegExp("^" + pattern.replace(/:[^/]+/g, "([^/]+)") + "/?$").exec(path);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  if (req.method === "OPTIONS") return res.end();

  // SSE 구독은 연결만 유지
  if (req.headers.accept?.includes("text/event-stream")) {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
    return res.write(": connected\n\n");
  }

  res.setHeader("Content-Type", "application/json");
  for (const [key, handler] of Object.entries(routes)) {
    const [method, pattern] = key.includes(" ") ? key.split(" ") : ["GET", key];
    if (method !== req.method) continue;
    const m = match(pattern, path);
    if (!m) continue;
    const data =
      typeof handler === "function" ? handler({ params: m.slice(1), query: url.searchParams }) : handler;
    console.log(`✓ ${req.method} ${path}`);
    return res.end(JSON.stringify(data));
  }

  console.log(`✗ ${req.method} ${path}${url.search}`);
  res.end("[]");
});

server.listen(PORT, () => console.log(`mock api on http://localhost:${PORT}`));
