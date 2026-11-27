const { getDefaultConfig } = require("expo/metro-config");
const config = getDefaultConfig(__dirname);
const path = require("node:path");
config.watchFolders = [path.resolve(__dirname, "../..")];
const http = require("node:http");
config.server.enhanceMiddleware = (metroMiddleware) => (req, res, next) => {
  const pathname = req.url?.split("?", 1)[0] ?? "";
  if (pathname !== "/api" && !pathname.startsWith("/api/")) return metroMiddleware(req, res, next);

  const proxy = http.request(
    {
      hostname: "127.0.0.1",
      port: 8787,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: "127.0.0.1:8787" },
    },
    (upstream) => {
      res.writeHead(upstream.statusCode ?? 502, upstream.headers);
      upstream.pipe(res);
    },
  );
  proxy.on("error", () => {
    if (res.headersSent) return res.destroy();
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "Alineo API unavailable; start the local server on port 8787." }),
    );
  });
  req.pipe(proxy);
};
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "jose" || moduleName.startsWith("jose/")) {
    return context.resolveRequest(
      { ...context, unstable_conditionNames: ["browser", "require", "import"] },
      moduleName,
      platform,
    );
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};
module.exports = config;
