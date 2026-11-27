// Arena-only static preview. The API stays loopback-bound and is reached through
// the same-origin Vite proxy; this is not a production deployment configuration.
const webRoot = new URL("./apps/mobile/dist/web/", import.meta.url).pathname;

export default {
  root: webRoot,
  server: {
    host: "0.0.0.0",
    port: 4184,
    strictPort: true,
    allowedHosts: [".e2b.app", "localhost", "127.0.0.1"],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: false,
        configure(proxy) {
          proxy.on("proxyReq", (request) => request.removeHeader("origin"));
        },
      },
    },
  },
};
