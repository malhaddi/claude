/* =========================================================
   Soundwave — player logic (Vanilla ES6)
   Sections:
     1. Track data + generated flat album art
     2. State + element references
     3. Rendering (playlist, now-playing)
     4. Playback controls
     5. Progress bar (seek + drag)
     6. Volume (slider + mute)
     7. Navigation / responsive UI
     8. Keyboard shortcuts
     9. Init
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   1. Track data
   Album art is generated as flat, gradient-free SVG data URIs
   so the player is fully self-contained (no external images).
   Audio uses royalty-free sample tracks (SoundHelix).
   --------------------------------------------------------- */

/** Build a flat two-tone SVG cover (no gradients) as a data URI. */
function makeCover(bg, fg, label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <rect width="600" height="600" fill="${bg}"/>
      <circle cx="300" cy="270" r="120" fill="none" stroke="${fg}" stroke-width="10" opacity="0.85"/>
      <circle cx="300" cy="270" r="26" fill="${fg}"/>
      <text x="300" y="470" font-family="Segoe UI, Arial, sans-serif" font-size="44"
            font-weight="700" fill="${fg}" text-anchor="middle">${label}</text>
    </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
}

const TRACKS = [
  {
    title: 'Midnight Drive',
    artist: 'The Resonants',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: makeCover('#1DB954', '#0a0a0a', 'MIDNIGHT'),
  },
  {
    title: 'Neon Streets',
    artist: 'Aurora Pulse',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: makeCover('#2A2A2A', '#1DB954', 'NEON'),
  },
  {
    title: 'Glass Horizon',
    artist: 'Cloud Theory',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: makeCover('#181818', '#B3B3B3', 'HORIZON'),
  },
  {
    title: 'Slow Motion',
    artist: 'Velvet Echo',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover: makeCover('#1ED760', '#0a0a0a', 'SLOW MO'),
  },
  {
    title: 'Afterglow',
    artist: 'The Resonants',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    cover: makeCover('#282828', '#FFFFFF', 'AFTERGLOW'),
  },
  {
    title: 'Lost Signal',
    artist: 'Mono Drift',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    cover: makeCover('#121212', '#1DB954', 'LOST'),
  },
];

/* Repeat modes cycle: off -> all -> one */
const REPEAT = { OFF: 0, ALL: 1, ONE: 2 };

/* ---------------------------------------------------------
   2. State + element references
   --------------------------------------------------------- */
const state = {
  index: 0,          // current track index
  isPlaying: false,
  shuffle: false,
  repeat: REPEAT.OFF,
  muted: false,
  lastVolume: 0.8,   // remembered for unmute
};

const $ = (sel) => document.querySelector(sel);

const audio = $('#audio');

const el = {
  // now playing
  albumArt: $('#albumArt'),
  trackTitle: $('#trackTitle'),
  trackArtist: $('#trackArtist'),
  nowPlaying: $('.now-playing'),
  // playlist
  playlist: $('#playlist'),
  // player bar
  barThumb: $('#barThumb'),
  barTitle: $('#barTitle'),
  barArtist: $('#barArtist'),
  barLike: $('#barLike'),
  // controls
  playBtn: $('#playBtn'),
  iconPlay: $('.icon-play'),
  iconPause: $('.icon-pause'),
  prevBtn: $('#prevBtn'),
  nextBtn: $('#nextBtn'),
  shuffleBtn: $('#shuffleBtn'),
  repeatBtn: $('#repeatBtn'),
  repeatBadge: $('#repeatBadge'),
  // progress
  progressBar: $('#progressBar'),
  progressFill: $('#progressFill'),
  progressKnob: $('#progressKnob'),
  currentTime: $('#currentTime'),
  durationTime: $('#durationTime'),
  // volume
  muteBtn: $('#muteBtn'),
  iconVol: $('.icon-vol'),
  iconMute: $('.icon-mute'),
  volumeBar: $('#volumeBar'),
  volumeFill: $('#volumeFill'),
  volumeKnob: $('#volumeKnob'),
  // nav / layout
  sidebar: $('#sidebar'),
  backdrop: $('#backdrop'),
  menuToggle: $('#menuToggle'),
};

/* Holds <li> nodes so we can toggle the active highlight cheaply */
const songNodes = [];

/* ---------------------------------------------------------
   Helpers
   --------------------------------------------------------- */
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/** Map a pointer event x-position to a 0..1 ratio along an element. */
function ratioFromEvent(event, element) {
  const rect = element.getBoundingClientRect();
  const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
  return Math.min(1, Math.max(0, x / rect.width));
}

/* ---------------------------------------------------------
   3. Rendering
   --------------------------------------------------------- */
function renderPlaylist() {
  const frag = document.createDocumentFragment();

  TRACKS.forEach((track, i) => {
    const li = document.createElement('li');
    li.className = 'song';
    li.setAttribute('role', 'button');
    li.tabIndex = 0;
    li.innerHTML = `
      <span class="song__index">
        <span class="song__num">${i + 1}</span>
        <span class="song__bars" aria-hidden="true"><span></span><span></span><span></span></span>
      </span>
      <img class="song__thumb" src="${track.cover}" alt="" loading="lazy" />
      <span class="song__info">
        <span class="song__title">${track.title}</span>
        <span class="song__artist">${track.artist}</span>
      </span>
      <span class="song__dur" data-dur>--:--</span>`;

    // Activate on click or Enter/Space
    const activate = () => loadTrack(i, true);
    li.addEventListener('click', activate);
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });

    // Pull each track's real duration in the background for display
    fetchDuration(track.src, li.querySelector('[data-dur]'));

    frag.appendChild(li);
    songNodes.push(li);
  });

  el.playlist.appendChild(frag);
}

/** Load metadata of a track off-screen to display its duration. */
function fetchDuration(src, target) {
  const probe = new Audio();
  probe.preload = 'metadata';
  probe.src = src;
  probe.addEventListener('loadedmetadata', () => {
    target.textContent = formatTime(probe.duration);
  });
  probe.addEventListener('error', () => { target.textContent = '0:00'; });
}

/** Reflect the active track in the playlist + now-playing area. */
function renderActive() {
  const track = TRACKS[state.index];

  // Now playing
  el.albumArt.src = track.cover;
  el.albumArt.alt = `${track.title} by ${track.artist}`;
  el.trackTitle.textContent = track.title;
  el.trackArtist.textContent = track.artist;

  // Player bar
  el.barThumb.src = track.cover;
  el.barTitle.textContent = track.title;
  el.barArtist.textContent = track.artist;

  // Playlist highlight
  songNodes.forEach((node, i) => {
    node.classList.toggle('is-active', i === state.index);
  });
  document.title = `${track.title} · ${track.artist} — Soundwave`;
}

/* ---------------------------------------------------------
   4. Playback controls
   --------------------------------------------------------- */
function loadTrack(index, autoplay = false) {
  state.index = (index + TRACKS.length) % TRACKS.length;
  audio.src = TRACKS[state.index].src;
  renderActive();
  if (autoplay) play();
  else updatePlayingClasses();
}

function play() {
  const promise = audio.play();
  // play() rejects if the browser blocks autoplay or the source fails
  if (promise && promise.catch) {
    promise.catch(() => { state.isPlaying = false; updatePlayingClasses(); });
  }
  state.isPlaying = true;
  updatePlayingClasses();
}

function pause() {
  audio.pause();
  state.isPlaying = false;
  updatePlayingClasses();
}

function togglePlay() {
  if (state.isPlaying) pause();
  else play();
}

/** Sync all play/pause-dependent UI (icon, spin, equalizer). */
function updatePlayingClasses() {
  el.iconPlay.hidden = state.isPlaying;
  el.iconPause.hidden = !state.isPlaying;
  el.playBtn.setAttribute('aria-label', state.isPlaying ? 'Pause' : 'Play');

  el.nowPlaying.classList.toggle('is-playing', state.isPlaying);

  const active = songNodes[state.index];
  if (active) active.classList.toggle('is-paused', !state.isPlaying);
}

function nextTrack(auto = false) {
  if (state.shuffle) {
    // Pick a different random track when shuffling
    let next = state.index;
    if (TRACKS.length > 1) {
      while (next === state.index) next = Math.floor(Math.random() * TRACKS.length);
    }
    loadTrack(next, true);
    return;
  }

  const isLast = state.index === TRACKS.length - 1;
  // On natural end with repeat off, stop after the final track
  if (auto && isLast && state.repeat === REPEAT.OFF) {
    loadTrack(0, false);
    return;
  }
  loadTrack(state.index + 1, true);
}

function prevTrack() {
  // Restart current track if we're more than 3s in (Spotify behaviour)
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  loadTrack(state.index - 1, true);
}

function toggleShuffle() {
  state.shuffle = !state.shuffle;
  el.shuffleBtn.setAttribute('aria-pressed', String(state.shuffle));
}

function cycleRepeat() {
  state.repeat = (state.repeat + 1) % 3;
  const on = state.repeat !== REPEAT.OFF;
  el.repeatBtn.setAttribute('aria-pressed', String(on));
  el.repeatBadge.hidden = state.repeat !== REPEAT.ONE;
}

/* ---------------------------------------------------------
   5. Progress bar (seek + drag)
   --------------------------------------------------------- */
function updateProgress() {
  const { currentTime, duration } = audio;
  const pct = duration ? (currentTime / duration) * 100 : 0;
  el.progressFill.style.width = pct + '%';
  el.progressKnob.style.left = pct + '%';
  el.currentTime.textContent = formatTime(currentTime);
  el.progressBar.setAttribute('aria-valuenow', Math.round(pct));
}

function seekToEvent(event) {
  if (!audio.duration) return;
  const ratio = ratioFromEvent(event, el.progressBar);
  audio.currentTime = ratio * audio.duration;
  updateProgress();
}

/** Generic press-drag handler shared by both sliders. */
function attachDrag(barEl, onMove, draggingClass) {
  const start = (e) => {
    e.preventDefault();
    document.body.classList.add(draggingClass);
    onMove(e);
    const move = (ev) => onMove(ev);
    const end = () => {
      document.body.classList.remove(draggingClass);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  };
  barEl.addEventListener('mousedown', start);
  barEl.addEventListener('touchstart', start, { passive: false });
}

/* ---------------------------------------------------------
   6. Volume (slider + mute)
   --------------------------------------------------------- */
function applyVolume(value) {
  const v = Math.min(1, Math.max(0, value));
  audio.volume = v;
  audio.muted = v === 0;
  state.muted = audio.muted;

  el.volumeFill.style.width = v * 100 + '%';
  el.volumeKnob.style.left = v * 100 + '%';
  el.volumeBar.setAttribute('aria-valuenow', Math.round(v * 100));

  // Swap mute/volume glyphs
  el.iconVol.hidden = audio.muted;
  el.iconMute.hidden = !audio.muted;
  el.muteBtn.setAttribute('aria-label', audio.muted ? 'Unmute' : 'Mute');

  if (v > 0) state.lastVolume = v;
}

function setVolumeFromEvent(event) {
  applyVolume(ratioFromEvent(event, el.volumeBar));
}

function toggleMute() {
  if (audio.muted || audio.volume === 0) applyVolume(state.lastVolume || 0.8);
  else applyVolume(0);
}

/* ---------------------------------------------------------
   7. Navigation / responsive UI
   --------------------------------------------------------- */
function openSidebar() {
  el.sidebar.classList.add('is-open');
  el.backdrop.hidden = false;
}
function closeSidebar() {
  el.sidebar.classList.remove('is-open');
  el.backdrop.hidden = true;
}

/** Simple active-state syncing for the nav items (single-view demo). */
function wireNav() {
  document.querySelectorAll('[data-view]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.dataset.view;
      document.querySelectorAll('[data-view]').forEach((n) =>
        n.classList.toggle('is-active', n.dataset.view === view));
      closeSidebar();
    });
  });
}

/* ---------------------------------------------------------
   8. Event wiring
   --------------------------------------------------------- */
function wireEvents() {
  // Transport
  el.playBtn.addEventListener('click', togglePlay);
  el.nextBtn.addEventListener('click', () => nextTrack(false));
  el.prevBtn.addEventListener('click', prevTrack);
  el.shuffleBtn.addEventListener('click', toggleShuffle);
  el.repeatBtn.addEventListener('click', cycleRepeat);

  // Like toggle
  el.barLike.addEventListener('click', () => {
    const pressed = el.barLike.getAttribute('aria-pressed') === 'true';
    el.barLike.setAttribute('aria-pressed', String(!pressed));
  });

  // Audio element events
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', () => {
    el.durationTime.textContent = formatTime(audio.duration);
    updateProgress();
  });
  audio.addEventListener('play', () => { state.isPlaying = true; updatePlayingClasses(); });
  audio.addEventListener('pause', () => { state.isPlaying = false; updatePlayingClasses(); });
  audio.addEventListener('ended', () => {
    // Autoplay logic: repeat-one replays, otherwise advance
    if (state.repeat === REPEAT.ONE) { audio.currentTime = 0; play(); }
    else nextTrack(true);
  });

  // Progress bar: click + drag
  attachDrag(el.progressBar, seekToEvent, 'is-seeking');
  el.progressBar.addEventListener('keydown', (e) => {
    if (!audio.duration) return;
    if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
  });

  // Volume bar: click + drag
  attachDrag(el.volumeBar, setVolumeFromEvent, 'is-changing-vol');
  el.volumeBar.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') applyVolume(audio.volume + 0.05);
    if (e.key === 'ArrowLeft') applyVolume(audio.volume - 0.05);
  });
  el.muteBtn.addEventListener('click', toggleMute);

  // Responsive nav
  el.menuToggle.addEventListener('click', openSidebar);
  el.backdrop.addEventListener('click', closeSidebar);
  wireNav();

  // Global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ignore typing in inputs
    if (e.target.matches('input, textarea')) return;
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault(); togglePlay(); break;
      case 'ArrowRight':
        if (e.target === document.body) nextTrack(false); break;
      case 'ArrowLeft':
        if (e.target === document.body) prevTrack(); break;
      case 'm': toggleMute(); break;
      case 's': toggleShuffle(); break;
      case 'r': cycleRepeat(); break;
    }
  });
}

/* ---------------------------------------------------------
   9. Init
   --------------------------------------------------------- */
function init() {
  renderPlaylist();
  loadTrack(0, false);   // load first track, paused
  applyVolume(state.lastVolume);
  wireEvents();
}

document.addEventListener('DOMContentLoaded', init);
