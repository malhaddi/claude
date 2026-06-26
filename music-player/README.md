# 🎵 Soundwave — Spotify-Inspired Music Player

A clean, flat, dark-themed music player built with **vanilla HTML5, CSS3, and
JavaScript (ES6)** — no frameworks, no build step. Open `index.html` and play.

## Design

Faithful to the Spotify desktop aesthetic while remaining an original
implementation:

- **No** gradients, neon, glassmorphism, colorful backgrounds, or heavy shadows
- Flat design, professional look, smooth & subtle animations
- Strict palette: `#121212` background, `#000000` sidebar, `#181818` cards,
  `#282828` hover, `#1DB954`/`#1ED760` Spotify green accent

## Features

| Area | What's included |
| --- | --- |
| **Playback** | Play · Pause · Next · Previous · Shuffle · Repeat (off/all/one) · Autoplay |
| **Progress bar** | Real-time update, click-to-seek, drag support, current time / duration |
| **Volume** | Slider with drag, mute / unmute, last-volume memory |
| **Playlist** | Thumbnail, title, artist, duration, dynamic switching, active-song green highlight + equalizer |
| **Now playing** | Large album art with scale-on-hover and subtle rotation while playing |
| **Responsive** | Mobile bottom nav + compact controls, tablet, full desktop layout with docked sidebar |
| **A11y** | Keyboard controls, focus styles, `prefers-reduced-motion` support |

## Keyboard shortcuts

- `Space` / `K` — play / pause
- `←` / `→` — previous / next track (or seek 5s when the progress bar is focused)
- `M` — mute · `S` — shuffle · `R` — repeat

## Files

```
music-player/
├── index.html   # markup + inline SVG icons
├── styles.css   # design tokens, layout, responsive breakpoints
├── app.js       # tracks, playback, seek/drag, volume, navigation
└── README.md
```

## Notes

- Album covers are generated as flat, gradient-free **inline SVG** data URIs, so
  the player ships with **zero external image assets**.
- Sample audio uses royalty-free [SoundHelix](https://www.soundhelix.com)
  tracks; swap the `src` values in `app.js` (`TRACKS`) to use your own.
