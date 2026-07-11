---
name: verify
description: Build, serve and visually verify the AdvertoAI site in this sandbox.
---

# Verifying AdvertoAI changes

## Build & serve

```bash
npm run build                 # production build (Turbopack)
nohup npm run start > /tmp/server.log 2>&1 &   # serves on :3000
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
```

Gotchas:

- Always kill the old server before serving a new build, or the stale
  process keeps the port and serves old asset manifests (CSS 500s):
  `kill $(ps aux | grep next-server | grep -v grep | awk '{print $2}')`.
  A failed `npm run start` logs EADDRINUSE only in its log file.

## Screenshots / mobile viewport

- Plain `chrome --headless --screenshot --window-size=390,...` is
  UNRELIABLE for mobile: headless Chrome clamps the window to a
  ~500px minimum width, so 390px captures show fake "overflow".
- Use playwright-core (install it OUTSIDE the repo, e.g. in the
  scratchpad dir) with the pre-installed browser:

```js
const { chromium } = require("playwright-core");
const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox"],
});
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
```

- Check real overflow with
  `document.documentElement.scrollWidth <= window.innerWidth`.
- Avoid `waitUntil: "networkidle"`: Next.js `<Link>` prefetching keeps
  the network busy and can time out; use `"load"`.

## Flows worth driving

- `/` renders French marketing copy (hero tagline, 39 € offer, FAQ).
- Mobile menu button opens/closes `#mobile-menu`; nav links close it
  and smooth-scroll to sections (`#tarifs` etc.).
- FAQ `<details>` accordions toggle.
- First Tab focuses the "Aller au contenu" skip link.
- `/dashboard` renders the "En construction" placeholder (HTTP 200).
- Unknown routes return HTTP 404 with the French "Page introuvable" page.
