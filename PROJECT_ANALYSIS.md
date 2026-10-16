# CyberQuest project analysis

Reviewed on 13 October 2026. Scope: all tracked application source, generated assets, build and preview scripts, deployment configuration, and documentation. No application code was changed during this review.

## Overall assessment

CyberQuest is a small, dependency-free static employee cyber-awareness game. Its deployment setup is straightforward, and its content covers phishing, passwords, physical security, vishing, and data classification. It is suitable for a browser-local pilot after the gameplay defects below are addressed. It cannot independently establish employee identity, certify training completion, or verify real reward eligibility.

The build succeeds and the generated JavaScript matches the source. The most significant defect is loss of Desk Inspector points across interrupted attempts. Timed voice callbacks also outlive the activity that created them. Training completion currently means reaching the results screen, irrespective of performance.

## Architecture and project map

| File or directory | Responsibility |
|---|---|
| `src/cyberquest.html` | Canonical source: page styles, game content, application state, five games, quizzes, rewards, admin tools, and optional server adapter |
| `scripts/build.js` | Extracts JavaScript, produces the static page, adds a content-hash query parameter and footer, and discovers recorded audio |
| `scripts/serve.js` | Dependency-free local HTTP preview server |
| `scripts/voice-script.js` | Extracts caller dialogue and generates recording instructions |
| `public/index.html`, `public/app.js` | Generated deployable page and application |
| `public/config.js` | Enables static mode and disables demo admin tools |
| `public/audio/voice/` | Audio manifest and optional recordings; the current manifest is empty |
| `vercel.json` | Static build, output directory, security headers, and caching |
| `README.md`, `docs/voice-script.md` | Deployment, operational limitations, and audio recording documentation |

There are no runtime package dependencies, backend implementation, database, automated test suite, or CI workflow in the reviewed files. The source HTML is approximately 146 KB; the generated application script is approximately 132 KB, before compression. Most complexity is concentrated in one file.

## Application flow

Players enter a name, select an unlocked level, complete its game, answer a quiz, and reach a results screen. Levels normally unlock sequentially. Scores use the best result per level, and rewards require all five levels plus a score threshold.

The state object `S` drives rendering. Views replace markup through `innerHTML`, and delegated `data-a` actions handle navigation and common buttons. `hdr()` also saves state. Names, best scores, completed levels, reward claims, case progress, and audio preferences live in localStorage. Custom voice recordings live in IndexedDB. UI sounds and music use Web Audio.

Optional server-mode code calls `/api` for authentication, configuration, attempts, leaderboards, rewards, users, and recordings. No matching server exists in this repository, so that mode cannot be validated here.

## Findings in priority order

### 1. High: interrupted Desk Inspector attempts permanently lose earned points

Evidence: `src/cyberquest.html:196` and `src/cyberquest.html:406–413`.

Closing a case immediately persists its completion and points in `S.cases`. Level best scores are committed only at final results. Starting another attempt resets `S.lp` to zero, while completed cases become practice-only and award no points. The saved case points are never restored into the new attempt.

A focused execution check awarded 100 points to each case. After closing one case, exiting, and restarting, all four saved cases contained 400 points, but the new attempt held only 300. Exiting after all four cases but before the quiz loses all case points for the next attempt.

Recommendation: restore the saved case contribution when resuming the level, or persist and resume the whole attempt. Define replay scoring explicitly so practice cannot duplicate earned points.

### 2. Medium: voice callbacks survive stop and navigation

Evidence: `src/cyberquest.html:493–497` and `src/cyberquest.html:565–578`.

`VOICE.play()` schedules a 45-second completion timeout, but `VOICE.stop()` only pauses the audio. It neither clears that timeout nor invalidates its callbacks. A focused execution check confirmed that completion still fires after stop.

The voice game also schedules delayed `speak()` and `end()` calls when a reply is selected. Exiting during that delay can make those calls access elements that no longer exist. Rapidly restarting the same game can let an older callback interact with the new game's identically named elements.

Recommendation: give each mounted game a cleanup function; cancel timers, detach audio callbacks, stop intervals, and invalidate pending asynchronous work on navigation. Check activity identity instead of only whether a global element ID exists.

### 3. Medium: completion does not require successful performance

Evidence: `src/cyberquest.html:207–209`.

In static mode, `result0()` always adds the level to `S.done`. A check with zero points and zero correct quiz answers still marked Level 2 cleared. Failed firewall or vault rounds can proceed to quizzes, and poor desk inspections can be saved as closed cases.

This may be intentional for participation-based training, but it conflicts with treating the completion flag as proof of mastery. Decide whether completion means participation or passing. If passing is required, define game and quiz thresholds and show a retry path.

### 4. Medium: browser-only scores and reward claims are not trustworthy records

Evidence: `src/cyberquest.html:125–130`, `src/cyberquest.html:123`, and the claim action near the end of the source.

Answers, score rules, admin actions, and reward generation are delivered to every browser. A player can alter local state or invoke client-side actions. `CQ_DEMO=false` hides the admin interface but is not an authorization boundary. Reward codes are random client-generated strings with no shared validation, uniqueness registry, or redemption tracking.

This limitation is already disclosed in the README. Keep HR verification for a pilot; use authenticated, server-validated scoring and claims for real incentives or audit records. No exposed credentials or secrets were found in the reviewed files.

### 5. Medium: Desk Inspector lacks a keyboard-accessible inspection path

Evidence: `src/cyberquest.html:447` and `src/cyberquest.html:475–484`.

Clickable SVG inspection groups have no keyboard focus or activation handling. A keyboard-only player cannot complete this core activity. The firewall canvas also lacks an accessible text alternative, though its movement and firing have keyboard controls.

Recommendation: provide focusable inspection targets or an equivalent text inspection view, with labels and keyboard activation. Add an equivalent activity for users unable to operate the arcade canvas. Phishing pseudo-buttons should support Space as well as Enter.

### 6. Low: local preview does not exercise deployment security headers

Evidence: `scripts/serve.js` and `vercel.json`.

The preview server sets content types but does not apply the deployed CSP or other security headers. Local success therefore does not establish CSP compatibility. There is also no recorded-audio asset in the current build, so playback and recording lifecycle behavior need browser validation.

Recommendation: reuse deployment headers in preview or validate representative flows on a Vercel preview deployment.

### 7. Low: rendering and persistence need clearer boundaries

Names are escaped, but some saved or server-provided values, including claimed codes and reward descriptions, are inserted into HTML without escaping. Treat external and persisted text consistently as text. The configured CSP reduces script-execution exposure, but does not prevent arbitrary markup from changing the interface.

`save()` silently ignores storage failures while the interface describes progress as saved. Corrupted saved data receives only partial validation. Rendering also triggers storage writes through `hdr()`, including score updates during gameplay. Prefer explicit persistence with a visible failure state and schema validation.

## Strengths

- No third-party JavaScript or dependency installation is required.
- Generated scripts use a content-derived URL parameter, which supports the configured long cache lifetime.
- Deployment configuration includes CSP, framing restrictions, nosniff, referrer policy, and permissions policy.
- User names are escaped in normal views; API calls have abort timeouts and error handling.
- The README clearly identifies local-only storage, the sample leaderboard, and reward-validation limitations.
- The interface includes native buttons, a skip link, focus styles, live status regions, responsive layouts, and CSS reduced-motion support.
- Missing audio recordings fall back to transcript presentation with electronic blips. This fallback does not speak the dialogue aloud.

## Verification and limits

Passed: `npm run build`; syntax checks for the generated app and all three Node scripts; generated app/source equality; focused execution checks for interrupted case scoring, stopped audio callbacks, and zero-score completion. The build left tracked application files unchanged.

The execution checks used Node VM with minimal DOM and audio stubs. They verify the reported state and callback behavior, not visual layout or full browser integration. No live Vercel deployment, real microphone, real audio playback, mobile browser, or backend endpoint was tested.

## Recommended sequence

1. Repair Desk Inspector resume scoring and game cleanup on navigation.
2. Define and implement the intended passing/completion policy.
3. Add focused regression checks for these behaviors and representative browser smoke checks across all five levels.
4. Add keyboard-equivalent inspection and canvas activities; verify mobile touch, reduced motion, and audio behavior.
5. Separate state, persistence, rendering, game modules, and backend adaptation as the project grows.
6. Add an authenticated backend before relying on shared leaderboards, employee identity, reward redemption, or training audit records.
