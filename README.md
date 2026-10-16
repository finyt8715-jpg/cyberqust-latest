# CyberQuest web (frontend only, for Vercel)

The CyberQuest cyber awareness game as a static website: five levels (phishing inbox, firewall shooter, desk inspector, voice trap,
data sorter), quizzes, scores, daily board and rewards. No server and no database. Progress is saved in each player's browser.

```
src/cyberquest.html   core game source (edit this)
src/desk3d.mjs        four interactive 3D inspection scenes
src/lobby.js         gaming dashboard, mission illustrations and onboarding
src/lobby.css        platform UI and typography (separate from game styles)
scripts/build.js      builds public/ (page, script, voice manifest). Vercel runs it on every deploy
public/               what gets served: index.html, app.js, config.js, favicon, 404, audio/voice/
vercel.json           security headers, caching and build settings
docs/voice-script.md  every caller line and the file name to record it under
```

## Deploy on Vercel

1. Put this folder in a Git repository (GitHub, GitLab or Bitbucket).
2. In Vercel choose **Add New → Project**, import the repository and click **Deploy**. Nothing else to set: `vercel.json` already tells Vercel
   to run `node scripts/build.js` and serve `public/`. No environment variables are needed.
   (CLI alternative: `npm i -g vercel`, then `vercel --prod` in this folder.)
3. **Custom domain:** Project → Settings → Domains → add `cyberquest.innovatiview.com`, then create the DNS record Vercel shows
   (usually a CNAME to `cname.vercel-dns.com`). HTTPS is automatic.
4. **Who can open it:** a new Vercel deployment is public to anyone with the link. If it should be company only, turn on
   *Settings → Deployment Protection* (Vercel Authentication limits it to your Vercel team; password protection needs a paid plan), or put
   your company SSO in front (for example Cloudflare Access). The site already asks search engines not to index it.

Install dependencies with `npm install`, then preview locally with `npm run dev` and open http://localhost:3000.

Desk Inspector's **Cubicle 12, Reception desk, Meeting room B and Home office** cases are distinct real-time 3D environments built with Three.js. Drag to orbit, scroll or use the view buttons to zoom, and click objects to inspect them. A keyboard-accessible object selector offers the same clues. Explore before starting the three-minute inspection, then report security risks to collect evidence. Reception has a counter and visitor lounge, Meeting Room B has a conference table and presentation display, and Home Office has a workspace, bookshelf and router station. Every case has its own selectable evidence and three-minute timer. Browsers without WebGL can use an illustrated fallback for each case. Three.js is served locally from `public/vendor/`; its license is included there. Edit the room in `src/desk3d.mjs` and rebuild with `npm run build`.

Level 1 uses a Gmail-style inbox with five phishing messages and five legitimate messages. Inspect senders and link destinations, build a correct-answer streak, and review missed clues before the quiz. The inbox uses familiar Gmail colors, layout, and sans-serif text; the surrounding CyberQuest interface keeps its retro arcade style. Run `npm test` for the phishing mission's scoring and interaction checks.

## Change the game

Edit `src/cyberquest.html` (levels, quiz questions, emails, rewards and scores are all in it), then `npm run build` and commit.
Vercel rebuilds on every push. Check the result in a preview deployment first (every branch gets its own URL).

The dashboard is a gaming lobby with player stats, campaign progress, illustrated mission cards, skill badges, and a reward preview. Platform headings use Rajdhani and UI text uses Outfit; game fonts stay unchanged. Edit `src/lobby.js` and `src/lobby.css` for dashboard and onboarding changes. All displayed progress comes from the saved player state; the frontend-only leaderboard remains a sample board.

The dedicated `/login` page has a retro cyber-awareness arcade theme. New players are sent there automatically; starting a quest saves the player name and opens the dashboard at `/`. The current static version uses a browser-local player name; company email/password authentication requires the optional backend. Click the avatar at the top left or **Player profile** on the dashboard to edit your player name and photo. Photos support JPG, PNG, and WebP up to 8 MB; they are center-cropped to 256×256, stored in this browser, and can be removed without resetting progress. In server mode, names remain managed by the company account and local photos are stored separately for each signed-in account.

## Add your own voices (Level 4)

1. Open `docs/voice-script.md`. It lists the 11 caller lines and the file name for each (`c1-a.mp3`, `c1-b.mp3` ...).
2. Record each line with any tool (phone, Audacity, a studio) and save it under that name as mp3, m4a, webm, ogg or wav.
3. Copy the files into `public/audio/voice/`, commit and push. The build detects them and updates `manifest.json`.

Lines without a file keep the built-in synthetic voice, so you can record only some of them. If you change the call scripts, run
`node scripts/voice-script.js` to refresh the list.

To record inside the game: set `window.CQ_DEMO = true` in `public/config.js` **on your own computer only**, run `npm run dev`, open
`http://localhost:3000/?admin=1`, go to Admin → Voice recordings, record and press Download for each line. **Set `CQ_DEMO` back to `false`
before you commit.** With `true`, the Admin tools can unlock every level and award points.

## What this version does and does not do

It works well for running the awareness programme, a pilot or a demo. Because there is no server:

* Progress, scores and reward codes live in the browser on one device. Clearing the browser data resets the player.
* The daily board shows sample players next to the current player. There is no shared leaderboard.
* Reward codes are not verified by any system, and a technically skilled player could edit their saved score or read the quiz answers in the
  page code. Have HR confirm real rewards, or use the server version (`cyberquest-server.zip`), which grades quizzes, validates scores, shares
  one leaderboard and verifies reward claims.
* Admin tools are switched off in production (`CQ_DEMO=false`), so players cannot unlock levels or award themselves points through the app.

Moving to the server later: deploy the server package, then in `vercel.json` add rewrites that send `/api/*` and `/audio/voice/*` to it,
and set `window.CQ_SERVER = true` in `public/config.js`. Ask if you want this prepared as a ready-made variant.

## Security notes

* `vercel.json` sets a strict Content-Security-Policy (`script-src 'self'`, no inline scripts, only Google Fonts as an external source),
  no framing, `nosniff`, no referrer, HSTS and a permissions policy.
* There are no third-party hosted scripts, cookies or analytics. The player's name, progress, audio preferences, and optional profile photo are stored in `localStorage`; custom voice recordings use IndexedDB.
* To avoid Google Fonts entirely, host the three font files yourself and remove the Google Fonts `<link>` and the two Google hosts from the CSP.

### Daily play allowance
The PLAY Now cover has one launch button, which starts the first mission, Firewall Defender, immediately. It shows the same 15-minute daily countdown as the dashboard. Time counts while a game screen is open (including instructions and quizzes), pauses on other pages, and resets at local midnight. At expiry the app exits the game and disables launch buttons. Usage is stored separately from progress in this browser; resetting progress does not reset the allowance. This static-site limit is device/browser-local, not authoritative account enforcement. A backend is needed to enforce it across devices or resist changes to local storage or the device clock.
