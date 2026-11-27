# Alineo interaction design

Alineo keeps conversation, ongoing work, and user control together in a shared native and web interface.

## Conversation and work

- One main conversation is the default. With CopilotKit Rich Threads enabled, its identifier is saved in the workspace; side chats have separate conversation context.
- The composer stays available during replies. Its send arrow changes to a stop square in the same position inside the input pill, then returns when the run ends. Stopping preserves the current draft.
- Follow-ups appear in a visible queue and run in order. Stopping a reply pauses that queue; it does not cancel delegated tasks. A new submission can continue immediately when no follow-ups are held. An existing paused queue resumes through **Send queued messages**.
- Open chats and their drafts remain mounted while navigating. Queued messages are held in the open app, not a server inbox; keep the app open until they are sent. Delegated tasks are durable server work.
- Reading older messages should not force a scroll to the latest reply. A latest-message control returns to the live conversation.

## Transparency and control

- Tap the avatar to see activity, reviews and receipts. Its status names the current work or the input it needs.
- Background updates show meaningful completions or requests for input. They link to the saved task and can be dismissed.
- Structured review screens retain the exact recipient, action and accept/reject controls. Reading a public page requires no extra review.
- The agent's name and tone, background-update preference, and inspectable memories are editable in Apps. Its MicOrb can be previewed and customized with four color families, hue, saturation, lightness, scale, and shadow/glow treatment; these identity preferences persist through the agent settings API. Goals, tracking and artifacts remain usable outside chat.

## Visual language

A warm-white canvas, deep sage accents, pale mint surfaces, clear hierarchy, generous touch targets and restrained artifact frames give Alineo a calm, recognizable identity. Connector rows use theSVG’s original Gmail and Google Calendar marks; Lucide stays reserved for interface actions so brand logos and controls remain visually distinct. The assistant mark remains the animated OpenDuet MicOrb: canvas on web, matching SVG on native, and user-adjustable appearance. Task states animate the orb without implying microphone capture. See [artwork and source attribution](../apps/mobile/assets/README.md).

## Boundaries

The computer provides persistent Chromium, documents, and an optional Linux container with a terminal and filesystem. The terminal has no network access, while the browser handles public web access. It is not a full operating-system VM or a graphical desktop. Live Rich Threads, model reasoning and Google accounts require credentials. See [computer setup](COMPUTER.md).
