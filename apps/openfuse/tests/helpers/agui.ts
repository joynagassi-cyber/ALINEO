/** OpenFuse tool adapters deliberately serialize AG-UI tool results as JSON text. */
export function parseJsonToolResult<T extends object = Record<string, unknown>>(
  content: unknown,
): T {
  if (typeof content !== "string") {
    throw new TypeError("Expected a serialized JSON tool result");
  }
  return JSON.parse(content) as T;
}
