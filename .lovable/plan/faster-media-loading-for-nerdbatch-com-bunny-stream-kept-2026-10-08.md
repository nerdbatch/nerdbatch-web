# Faster media loading for nerdbatch.com (Bunny Stream kept)

Goal: the page shows instantly and only loads video when it's actually needed. Design and behavior stay the same.

## 1. Header videos
- Only the visible slide gets a live player; the other 3 show their own thumbnail.
- On slide change: pause and remove the previous player, then mount the new one (muted autoplay).
- Thumbnail stays on top until the player confirms playback (not just "frame loaded").
- Sound button keeps working: full volume after a tap, plays through, then mutes and rotates.
- If autoplay is blocked: show the yellow play button. If the player errors: keep the thumbnail.
- Pause when scrolled out of view or the tab is hidden; sound is never turned back on automatically.

## 2. Our Work carousel
- Cards show thumbnails with an accessible yellow play button (labelled per video).
- No player or video data loads until a card is clicked; the click creates the player with autoplay + sound.
- Only one video at a time: activating another removes the previous player. Arrows/dots stop playback.
- Commands only sent after the player reports "ready". Each player has a title.
- Same pause-on-scroll-away / tab-hidden rule.

## 3. Process animations (currently 4 GIFs, 45.8 MB)
- Convert each GIF to a silent MP4 (H.264) plus WebM, sized to the card (~640px wide), target 2 MB or less each, checking text stays readable.
- Generate a still poster image for each.
- Video file only attached once the section approaches the screen; plays muted/looped while visible, pauses off-screen.
- Reduced-motion or data-saver visitors see the poster only.
- The old GIFs are removed so they can't be downloaded.

## 4. Video quality
- Test Bunny's `levelCap=true` option (keeps quality matched to player size) in the live player, incl. Safari/iOS. Keep it only if it works; adaptive streaming stays on, no forced resolution.

## 5. Connection hints
- Replace the wrong `vz-756869.b-cdn.net` hint with the real delivery host (`vz-a6fcb190-454.b-cdn.net`, re-verified from the live manifest). Keep only hints needed for the first header video.
- First header thumbnail loads with high priority; all other images lazy with reserved sizes.

## 6. Verification and report
- Before/after measurements with Playwright on cold cache, desktop and mobile, throttled network: bytes transferred at 5s and 15s (including player requests), LCP, time to first video frame, number of players mounted.
- Check: on first visit only 1 player exists, no carousel video or GIF requests.
- Test carousel navigation, play, sound, pause, fallback. Safari/iOS and Android can only be approximated here (WebKit engine + mobile emulation); real-device check noted as remaining.
- Short results summary with changed files, before publishing.

## Technical details
- Files: `Hero.tsx`, `OurWork.tsx`, `Process.tsx`, new `src/lib/bunnyPlayer.ts` (wraps official player.js `ready/play/pause/error` events, volume 0–100), new `useInView` hook, `index.html`.
- Thumbnails from `https://vz-a6fcb190-454.b-cdn.net/{id}/thumbnail.jpg` if publicly reachable; otherwise grab frames and bundle them locally as the hero already does.
- GIF conversion with ffmpeg in the sandbox, outputs in `src/assets/` (`.mp4`, `.webm`, `-poster.jpg`).
- Carousel iframe uses `autoplay=true&muted=false` only at mount after click; the 128% crop hiding controls is kept.

## Clarifications folded in
1. **Blocked playback (both sections):** keep `allow="autoplay; fullscreen; picture-in-picture"`; on play failure or no confirmed play within a few seconds, show a working manual play/unmute button. If that still fails, show Bunny's own controls uncropped and clickable (crop and pointer-events removed for that card). Never a permanent spinner.
2. **Header rotation:** auto-rotate stops while the header is off-screen or the tab is hidden; all timers and player listeners cleared on unmount; late events from removed players ignored (per-player token). On return, play/mute state stays usable and sound never comes back on by itself.
3. **One Bunny video page-wide:** a shared "active video" coordinator — starting a carousel video pauses the header (even if both are partly visible) and vice versa. Process animations are exempt.
4. **Reproducible measurements:** baseline captured before any change. Same browser (Chromium), viewport (1280x800 desktop, 390x844 mobile), throttled profile (fixed bandwidth/latency), cold cache; 3 runs each, median reported. Includes cross-origin player requests; reports transferred bytes separately from uncompressed size. First-frame timing is labelled "time to play signal" (Player.js `play` event) unless a painted frame can be confirmed.
5. **Explicit open items:** tests run from this sandbox, not the US — location stated. Real iPhone/Safari and Android checks remain outstanding. ffmpeg is available here, so conversion will be done; if any animation misses the 2 MB / readability target it is reported, not claimed complete.

Acceptance: first visit with no scroll or click mounts at most one Bunny player, requests no carousel video content and none of the old GIFs. Results and open issues reported before publishing.
