# CopilotKit conversations and optional Rich Threads

Alineo's active native/web UI uses `@copilotkit/react-native/headless`; the current local `sample` API returns fictional, canned responses. Sample mode needs no CopilotKit Intelligence key, model/provider or Google account. Remote Rich Threads endpoints and the Intelligence thread menu are not enabled or validated by this sample.

## Optional live Rich Threads

A server-only `CPK_INTELLIGENCE_API_KEY` is required only if a future, explicitly configured live deployment enables CopilotKit Intelligence persistence and replay. No Intelligence project or provider is selected for the current sample. Before enabling live data, decide the service, retention, identity, permissions and cost, then test the configuration with a dedicated project.

Never put the key in an `EXPO_PUBLIC_`, `NEXT_PUBLIC_`, or `VITE_` variable. The server constructs `CopilotKitIntelligence`, and `identifyUser` resolves the owner from a verified session. The inherited live setup uses a single shared access key and does not provide multi-user account isolation; do not treat it as production authentication. See [CopilotKit's runtime setup](https://docs.copilotkit.ai/intelligence/connect-your-runtime) for configuration details.

When deliberately enabled, the conversation menu can use CopilotKit's `useThreads` hook to list, rename, archive, restore and paginate conversations. The server provisions an owner-bound main thread before its first message. Side chats use separate client thread IDs. Rich tool messages retain task IDs; current task status, browser previews, PDF links and structured artifacts come from authenticated task endpoints rather than permanent URLs embedded in thread messages.

Automatic thread naming is disabled. Intelligence is a separately configured service and is not bundled with this MIT-licensed application. The current Alineo sample does not upload its local history to Intelligence.

## Optional computer and browser components

The app includes interfaces for persistent browser sessions, files and an optional Linux workspace. These are not configured in the local sample: `browserConfigured` is false unless a private worker and token are explicitly set, and the Linux computer is disabled by default. Do not infer a live browser, terminal, or external connection from the UI or code alone.

For architecture and boundaries, see the [browser-worker guide](../apps/worker/README.md), [computer security notes](COMPUTER.md), and [interaction design](EXPERIENCE.md). Interactive reservations still require user takeover; autonomous booking, checkout and per-user VM isolation are not implemented.

## Validation scope

The Rich Threads route tests use a mocked Intelligence service boundary. They cover session enforcement, owner scoping, pagination, rename, archive, rich-message preservation and provider failures. They do not replace a live account test for Intelligence WebSocket persistence/replay. No such live test is configured for this Alineo sample.
