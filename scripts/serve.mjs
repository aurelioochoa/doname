import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("dist");
const port = Number(process.env.PORT || 4173);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const target = path.resolve(
      root,
      "." + decodeURIComponent(url.pathname),
    );
    if (target !== root && !target.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    const file = (await stat(target)).isDirectory()
      ? path.join(target, "index.html")
      : target;
    const data = await readFile(file);
    res
      .writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      })
      .end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("No encontrado");
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`dóname lista en http://localhost:${port}`),
);
for (const sig of ["SIGINT", "SIGTERM"])
  process.on(sig, () => server.close(() => process.exit(0)));
