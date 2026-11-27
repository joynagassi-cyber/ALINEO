# Alineo mobile

A shared React Native workspace for iOS, Android, and the web preview. The client uses native primitives and the CopilotKit headless hooks; the web preview renders those same screens through React Native Web.

## Historical recordings

[Archived upstream recording notes](../../docs/DEMO.md)

Alineo keeps the animated MicOrb from OpenDuet as the assistant mark, with adjustable color families and motion that reflects agent activity. Connector rows use authentic Gmail and Google Calendar marks from `thesvg`; generic interface controls stay on the consistent Lucide outline set. The shared React Native screen supports iOS, Android and web; web uses the canvas drawing engine and native apps render a matching SVG. The retained Hacker News/CopilotKit and aquarium recordings show the earlier OpenFuse-branded build, not the current Alineo UI or a live Alineo integration.

## Run

Start the API from the repository root, then:

```sh
pnpm --dir apps/mobile web
pnpm --dir apps/mobile ios
pnpm --dir apps/mobile android
```

Web builds use relative `/api` requests. The Expo Metro development server and Arena's Vite preview proxy that same-origin path to the local API, so browser code does not call `localhost`. Native iOS uses `http://localhost:8787`; Android emulators use `http://10.0.2.2:8787`. Set `EXPO_PUBLIC_API_URL` to a reachable non-loopback server URL for a physical device or an intentional web deployment. Live mode asks for the server access key; local mode opens the fictional workspace automatically. Tokens stay in memory.

PDFs use `react-native-pdf` and `react-native-blob-util` in an Expo **development build**. Expo Go does not include these native modules. The config plugins in `app.json` configure the native projects. Web uses the browser’s real PDF reader, with page/zoom controls and download/print access. PDF form fields save a new server artifact.

## Checks

```sh
pnpm --dir apps/mobile typecheck
node --experimental-strip-types --test apps/mobile/test/date-time.test.ts
pnpm --dir apps/mobile build:web
pnpm --dir apps/mobile build:ios
pnpm --dir apps/mobile build:android
```

The `build:ios` and `build:android` commands validate and export platform JavaScript/Hermes bundles. They do not create signed installable apps. `ios` and `android` run Expo’s native development-build workflows and need the platform toolchains.

## Behavior

- Chat, Activity, Ideas, Goals and Apps are the primary navigation. Tasks, timelines and notifications refresh from the durable server state. Apps contains Mail, Calendar, Browser, Files and Connections.
- Drafts are saved in Alineo and can be reopened from Mail. Mail attachments import into Files before reading.
- Calendar edits preserve named time zones. Date entry rejects nonexistent times at daylight-saving transitions.
- Sending mail and creating, changing, or deleting events require a stored proposal and an explicit review decision. Editing a proposal declines the previous version, then opens a new draft.
- Chat restores/saves AG-UI conversation messages, renders frontend tool cards, and supports interruption, retry, and document references.
- While the agent replies, the send arrow becomes a stop square in the same input pill. Stop preserves the draft; the arrow returns when the run ends. A new message can continue immediately after stopping when no follow-ups are waiting. Held follow-ups resume through **Send queued messages**.
- Browser previews and consoles use only signed worker URLs returned by the API. PDF downloads import through the worker API.
- If server-side Google OAuth is deliberately configured, connection starts in the system browser; refresh the workspace after completing OAuth. It is not configured in the default sample.

Phone and wide layouts share Chat, Activity, Ideas, Goals and Apps. The task and notification sheets restore server state when reopened. Document and browser viewers have platform-specific files; presentation and state remain shared.
