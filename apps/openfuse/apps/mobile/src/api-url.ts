function resolveBrowserApiBase(value?: string): string {
  const configured = value?.trim();
  if (!configured) return "";
  try {
    const host = new URL(configured).hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".localhost") ||
      host.startsWith("127.") ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host === "[::1]"
    )
      return "";
    return configured;
  } catch {
    return "";
  }
}

/** Web uses the same origin; native clients keep emulator/simulator defaults. */
export function resolveApiBase(platform: string, value?: string): string {
  if (platform === "web") return resolveBrowserApiBase(value);
  const configured = value?.trim();
  if (configured) return configured;
  return platform === "android" ? "http://10.0.2.2:8787" : "http://localhost:8787";
}
