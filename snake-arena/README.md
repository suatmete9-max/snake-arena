# Snake Arena

A responsive, static Snake game built with HTML Canvas, CSS, and plain JavaScript. It runs entirely in the browser with no build step, server, API key, or external game service.

## Files

- `index.html` - game page and semantic UI structure
- `style.css` - responsive visual design and layout
- `snake.js` - grid-based Snake game engine
- `app.js` - rendering, input, score, lives, timer, and game state
- `ads.js` - safe development-only ad placeholder simulations
- `game-hub.js` - game selection and screen switching
- `game-2048.js` - keyboard and swipe 2048 game
- `tic-tac-toe.js` - player-versus-computer Tic-Tac-Toe
- `memory-match.js` - emoji card matching game
- `privacy.html`, `terms.html`, `contact.html` - supporting pages

## Exact local testing steps

1. Open the parent `snake-arena` folder in VS Code.
2. Open `index.html` directly in a browser, or use a static preview extension.
3. Confirm the premium home screen shows the hero, four game cards, Daily Challenge seed, and local leaderboard panel.
4. Use Home, Games, Leaderboard, and How to Play navigation, then test the sound and theme buttons.
5. Select **Snake**, click **Start**, and test Arrow keys, WASD, and the four-button D-pad.
6. Collect food, pause/restart, trigger Game Over, and verify the existing score/high-score flow.
7. Select **2048**, click **New game**, then test Arrow keys, WASD, and a mobile swipe.
8. In 2048, merge tiles, verify Score and Best persist after reload, and fill the board to test Game Over.
9. Select **Tic-Tac-Toe**, click squares as X, and confirm the computer responds as O with win/draw results.
10. Select **Memory Match**, flip cards, match all emoji pairs, and verify Moves and the Timer.
11. Use **Back to Games** from each game and confirm only the selected screen is visible.
12. Resize to desktop, tablet, and mobile widths and verify there is no horizontal scrolling and focus rings remain visible.
13. Force a Snake Game Over, confirm **Optional: Watch one ad for +1 extra life** appears only then, choose Cancel, and verify **Play Again** works without an ad.
14. Repeat Game Over, choose the reward option, confirm Continue/Cancel, wait two seconds in development mode, and verify exactly one life is granted. Confirm a second attempt is unavailable in that round.
15. Confirm the single section labeled **Advertisement - banner slot ready** is below the game area, gives no reward, and is never over the canvas or controls.
16. Confirm the local leaderboard stores only Snake score, survival time, and daily challenge score; then test Privacy, Terms, and Contact links.

## Provider slot placement

- Snake uses `snake-monetag-ad-slot`; place the official Monetag responsive static container code only where the `PASTE_OFFICIAL_MONETAG_CODE_HERE` comment appears inside that slot. It is below the canvas, D-pad, and Snake controls.
- Tic-Tac-Toe uses `tictactoe-monetag-ad-slot`; place the official Monetag responsive static container code only at its matching `PASTE_OFFICIAL_MONETAG_CODE_HERE` comment, below the board, status, and controls.
- 2048 uses `game2048-adsterra-ad-slot`; place the official Adsterra responsive static container code only at its `PASTE_OFFICIAL_ADSTERRA_CODE_HERE` comment, below the board, status, and controls.
- Memory Match uses `memory-adsterra-ad-slot`; place the official Adsterra responsive static container code only at its `PASTE_OFFICIAL_ADSTERRA_CODE_HERE` comment, below the cards, status, and controls.
- Each slot is inside its own `.game-screen`. The existing hub toggles `.screen-hidden`, so a slot is visible only when its own game screen is selected. Do not move slots into the canvas, boards, controls, reward panel, cards, score areas, timer areas, or leaderboard.
- Keep the visible `Advertisement` label. Do not add refresh, preload, auto-trigger, rotation, popunder, SmartLink, direct-link, or any other ad format.

## Monetization integration notes

- Provider A is represented by `AdSlots.requestRewardedLife()` in `ads.js`. The only production integration point is the official verified completion callback marked `PROVIDER_A_REWARDED_CODE_GOES_HERE`; it must invoke the supplied completion callback once. The development build simulates completion after two seconds.
- The rewarded-life option appears only after Snake Game Over, requires Continue confirmation, permits one attempt per completed round, and grants exactly one life. Cancel and Play Again never require an ad.
- Provider B remains a single static `banner-ad-slot` container. Its integration marker is `PROVIDER_B_BANNER_CODE_GOES_HERE`. It provides no gameplay reward.
- No provider scripts, API keys, refresh, preload, forced view, auto-click, traffic, impression, VPN, proxy, or location spoofing logic is included.

## Advertising note

All ad surfaces in this demo are placeholders. There is no real ad code, auto-refresh, auto-clicking, forced ad view, traffic simulation, VPN/proxy behavior, country spoofing, or impression system.
