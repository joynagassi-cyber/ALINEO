# Alineo

Alineo is the mobile/web personal-assistant app in this repository. Its interface uses a graphite dark theme with floating, outlined workspace panels, a compact sidebar, and authentic Gmail and Google Calendar marks from `thesvg`. The generated flowing Alineo mark (`apps/mobile/assets/alineo-flow-mark.png`) is shared by the welcome screen, navigation, app icon, and web favicon. The animated MicOrb remains a separate mark for the assistant.

> **Local sample only.** The current sample uses fictional records and a local simulated agent. No model/provider, Google account, live connector, or multi-user identity is configured. Do not treat the app as a live integration or deploy it for real user data.

## Start the local preview

Requirements: Node.js `>=22` and pnpm `11.19.0`. From this directory:

```sh
npx --yes pnpm@11.19.0 install --frozen-lockfile
npx --yes pnpm@11.19.0 dev
```

In another terminal, from the same directory:

```sh
npx --yes pnpm@11.19.0 dev:web
```

Open `http://localhost:8081`. The sample API listens on loopback at `127.0.0.1:8787`; the web app uses its same-origin proxy. Sample data is fictional and stored locally. No Google account, model/provider key, or CopilotKit Intelligence key is required for this mode. Separately, the CopilotKit runtime may send SDK telemetry by default, tagged Alineo; disable it with `COPILOTKIT_TELEMETRY_DISABLED=true` or `DO_NOT_TRACK=1`. See [telemetry notes](docs/TELEMETRY.md).

To run the mobile development client instead, use `npx --yes pnpm@11.19.0 dev:mobile`. Native iOS/Android workflows require their platform toolchains and an Expo development build for the PDF modules.

## Checks

Run from this directory:

```sh
npx --yes pnpm@11.19.0 typecheck
npx --yes pnpm@11.19.0 lint
npx --yes pnpm@11.19.0 build:server
npx --yes pnpm@11.19.0 build:web
```

The focused API/identity tests can be run with:

```sh
npx --yes pnpm@11.19.0 exec tsx --import ./tests/setup.ts --test \
  tests/agent-api.test.ts tests/api.test.ts tests/config.test.ts tests/telemetry.test.ts
```

These checks validate code and a local sample only; they do not certify security or prove a live connector, production identity, or multi-user isolation.

## Product boundaries

- Chat, Activity, Ideas, Goals, and Apps are the primary surfaces. Connector rows and tools in the code do not mean an external account is connected.
- Gmail and Google Calendar marks identify destinations only. The local sample does not read or write any real mailbox or calendar.
- Mail sends and calendar changes use explicit review flows in the code; no external write is enabled by the local sample.
- The current local server is loopback-only. Its live mode is not a production multi-user system and requires a separately chosen provider, server identity, permissions, and security review.
- `apps/alineo/` retains the earlier handcrafted interface as historical code; it is not the active UI or design direction.

## Provenance and licenses

The implementation is derived from the MIT-licensed upstream OpenFuse project, pinned to commit `67580f16059d9c10111db00768e8a235d06cafdc`. That name is retained only to identify the upstream technical provenance; the product and interface are branded Alineo. The source license and reviewed dependency history are in [`LICENSE`](LICENSE) and [`../../docs/OPENFUSE_SECURITY_REVIEW.md`](../../docs/OPENFUSE_SECURITY_REVIEW.md).

The Gmail and Google Calendar icon modules come from `thesvg@4.0.16`; attribution and the library's MIT notice are in [`apps/mobile/third-party-licenses/thesvg-MIT-LICENSE.txt`](apps/mobile/third-party-licenses/thesvg-MIT-LICENSE.txt), and the icon artwork is identified as CC0-1.0. The MicOrb attribution and MIT notice are in `apps/mobile/third-party-licenses/OpenDuet-MIT-LICENSE.txt`.

See the [product implementation status](../../docs/ALINEO_IMPLEMENTATION.md), [mobile app notes](apps/mobile/README.md), and [security review](../../docs/OPENFUSE_SECURITY_REVIEW.md) for context and limitations.
