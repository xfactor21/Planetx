/**
 * planet.X Player — embeddable web music player
 * ==============================================
 *
 * A self-contained, framework-agnostic music player you can drop into any
 * existing web page. Renders inside a Shadow DOM so its styles never clash
 * with the host page.
 *
 * Usage
 * -----
 *   1. Drop a mount element anywhere in your page:
 *        <div data-planet-player></div>
 *
 *   2. Load the script (before </body>):
 *        <script src="planet-x-player.js"></script>
 *
 *   3. Done — it auto-initializes every [data-planet-player] element.
 *
 *   Programmatic API
 *   ----------------
 *   const inst = PlanetXPlayer.mount(document.getElementById('myPlayer'))
 *   inst.addTracks([{ title, artist, album, url, cover }])
 *   inst.playTrack(track)
 *   inst.destroy()
 *
 *   PlanetXPlayer.mountAll()  // mount every [data-planet-player] on the page
 *
 * Features: upload (mp3/m4a/wav/ogg), playback controls, seek, shuffle,
 * repeat, queue with drag-to-reorder, keyboard shortcuts, localStorage
 * persistence, and a Spotify Web Playback SDK placeholder.
 *
 * No dependencies. ~tree-shaken vanilla JS. MIT.
 */
(function (global) {
  'use strict'

  const STORAGE_KEY = 'planetx-player-library'

  /* ------------------------------------------------------------------ *
   * Styles (scoped to the shadow root)
   * ------------------------------------------------------------------ */
  const STYLES = `
  :host { all: initial; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :host, * { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }

  .pxp-root {
    --pxp-bg: #07020a;
    --pxp-pink: #ff2e9f;
    --pxp-cyan: #00f5ff;
    --pxp-fg: #fafafa;
    --pxp-muted: #b8a8b5;
    --pxp-card: rgba(255, 255, 255, 0.04);
    --pxp-border: rgba(255, 46, 159, 0.35);
    position: relative;
    overflow: hidden;
    border-radius: 1.25rem;
    background: var(--pxp-bg);
    color: var(--pxp-fg);
    padding: 1.25rem;
    border: 1px solid rgba(255, 46, 159, 0.25);
    box-shadow: 0 0 60px -20px rgba(255, 46, 159, 0.5), 0 0 40px -20px rgba(0, 245, 255, 0.4);
    font-size: 14px;
    line-height: 1.4;
  }

  .pxp-glow { position: absolute; inset: 0; pointer-events: none; overflow: hidden; border-radius: inherit; }
  .pxp-glow::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(120deg, rgba(255,46,159,.35), transparent 45%, rgba(0,245,255,.3));
  }
  .pxp-glow::after {
    content: ''; position: absolute; width: 22rem; height: 22rem; border-radius: 9999px;
    top: -6rem; left: -6rem; background: rgba(255,46,159,.45); filter: blur(90px);
  }
  .pxp-glow .c2 {
    position: absolute; width: 22rem; height: 22rem; border-radius: 9999px;
    bottom: -7rem; right: -6rem; background: rgba(0,245,255,.4); filter: blur(90px);
  }

  .pxp-inner { position: relative; z-index: 1; }

  .pxp-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
  .pxp-brand { display: flex; align-items: center; gap: 0.6rem; }
  .pxp-logo {
    width: 2rem; height: 2rem; border-radius: 0.6rem; display: grid; place-items: center;
    background: linear-gradient(135deg, var(--pxp-pink), var(--pxp-cyan));
    color: #000; font-weight: 800; font-family: 'Space Grotesk', 'Inter', sans-serif;
    box-shadow: 0 0 18px -4px var(--pxp-pink);
  }
  .pxp-name {
    background: linear-gradient(90deg, var(--pxp-pink), var(--pxp-cyan));
    -webkit-background-clip: text; background-clip: text; color: transparent;
    font-weight: 700; font-family: 'Space Grotesk', 'Inter', sans-serif; letter-spacing: .01em;
  }

  .pxp-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    border: 1px solid var(--pxp-border);
    background: linear-gradient(90deg, var(--pxp-pink), rgba(255,46,159,.75));
    color: #000; font-weight: 600; font-size: 0.8rem;
    padding: 0.5rem 0.9rem; border-radius: 0.6rem; cursor: pointer;
    box-shadow: 0 0 20px -8px var(--pxp-pink);
    transition: transform .12s ease, filter .12s ease;
  }
  .pxp-btn:hover { filter: brightness(1.08); }
  .pxp-btn:active { transform: scale(.97); }

  .pxp-body { display: flex; gap: 1.5rem; }
  .pxp-player-col { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  .pxp-queue-col { flex: 1 1 0; min-width: 0; }
  @media (max-width: 720px) { .pxp-body { flex-direction: column; } }

  .pxp-art {
    position: relative; width: 11rem; height: 11rem; border-radius: 1.25rem; flex-shrink: 0;
    display: grid; place-items: center; overflow: hidden;
    background: linear-gradient(135deg, var(--pxp-pink), var(--pxp-cyan));
    box-shadow: 0 0 45px -10px var(--pxp-pink), 0 0 30px -12px var(--pxp-cyan);
  }
  .pxp-art::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 20%, rgba(255,255,255,.4), transparent 60%); }
  .pxp-art svg.music { position: relative; width: 44%; height: 44%; }
  .pxp-art img { width: 100%; height: 100%; object-fit: cover; position: relative; }

  .pxp-title { font-size: 1.25rem; font-weight: 700; text-align: center; background: linear-gradient(90deg, var(--pxp-pink), var(--pxp-cyan)); -webkit-background-clip: text; background-clip: text; color: transparent; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pxp-sub { font-size: .8rem; color: var(--pxp-muted); text-align: center; }

  .pxp-seek { width: 100%; max-width: 20rem; }
  .pxp-track { position: relative; height: 5px; border-radius: 9999px; background: rgba(255,255,255,.12); cursor: pointer; }
  .pxp-fill { position: absolute; inset: 0 auto 0 0; border-radius: inherit; background: linear-gradient(90deg, var(--pxp-pink), var(--pxp-cyan)); box-shadow: 0 0 14px -2px var(--pxp-pink); }
  .pxp-times { display: flex; justify-content: space-between; font-size: .68rem; color: var(--pxp-muted); margin-top: .25rem; font-variant-numeric: tabular-nums; }

  .pxp-transport { display: flex; align-items: center; gap: 1.25rem; }
  .pxp-ctl { background: none; border: none; color: var(--pxp-muted); cursor: pointer; padding: .35rem; border-radius: 9999px; transition: color .12s; }
  .pxp-ctl:hover { color: var(--pxp-fg); }
  .pxp-ctl.on { color: var(--pxp-cyan); }
  .pxp-play {
    width: 3.25rem; height: 3.25rem; border-radius: 9999px; border: 2px solid rgba(255,46,159,.5);
    background: linear-gradient(135deg, var(--pxp-pink), var(--pxp-cyan)); color: #000; cursor: pointer;
    display: grid; place-items: center;
    box-shadow: 0 0 40px -6px var(--pxp-pink), 0 0 22px -8px var(--pxp-cyan);
    transition: transform .12s ease;
  }
  .pxp-play:hover { transform: scale(1.05); }
  .pxp-play svg { width: 1.4rem; height: 1.4rem; }

  .pxp-aux { display: flex; align-items: center; gap: 1rem; }
  .pxp-vol { display: flex; align-items: center; gap: .4rem; }
  .pxp-vol input { accent-color: var(--pxp-cyan); width: 5.5rem; }
  .pxp-spotify { display: inline-flex; align-items: center; gap: .35rem; font-size: .72rem; color: var(--pxp-cyan); border: 1px solid rgba(0,245,255,.4); border-radius: 9999px; padding: .3rem .7rem; text-decoration: none; }
  .pxp-spotify:hover { background: rgba(0,245,255,.1); }

  .pxp-queue-head { display: flex; align-items: center; gap: .5rem; font-size: .72rem; text-transform: uppercase; letter-spacing: .12em; color: var(--pxp-muted); font-weight: 600; margin-bottom: .6rem; }
  .pxp-dot { width: .5rem; height: .5rem; border-radius: 9999px; background: linear-gradient(135deg, var(--pxp-pink), var(--pxp-cyan)); }
  .pxp-qcount { color: var(--pxp-cyan); }
  .pxp-queue { list-style: none; max-height: 22rem; overflow-y: auto; display: flex; flex-direction: column; gap: .25rem; }
  .pxp-qitem {
    display: flex; align-items: center; gap: .6rem; padding: .45rem .5rem; border-radius: .7rem;
    border: 1px solid transparent; cursor: grab;
  }
  .pxp-qitem:hover { background: rgba(255,255,255,.04); }
  .pxp-qitem.active { border-color: rgba(255,46,159,.5); background: linear-gradient(90deg, rgba(255,46,159,.22), rgba(0,245,255,.16)); box-shadow: 0 0 18px -8px var(--pxp-pink); }
  .pxp-qitem.dragging { opacity: .4; }
  .pxp-qitem.drop { border-color: var(--pxp-cyan); background: rgba(0,245,255,.12); }
  .pxp-grip { color: var(--pxp-muted); opacity: 0; cursor: grab; transition: opacity .12s; }
  .pxp-qitem:hover .pxp-grip { opacity: .7; }
  .pxp-qidx { width: 1.1rem; text-align: center; font-size: .72rem; color: var(--pxp-muted); font-variant-numeric: tabular-nums; }
  .pxp-qplay { display: flex; align-items: center; gap: .6rem; flex: 1; min-width: 0; background: none; border: none; color: var(--pxp-fg); text-align: left; cursor: pointer; padding: 0; }
  .pxp-qart { width: 2.1rem; height: 2.1rem; border-radius: .45rem; flex-shrink: 0; display: grid; place-items: center; background: linear-gradient(135deg, var(--pxp-pink), var(--pxp-cyan)); overflow: hidden; }
  .pxp-qart img { width: 100%; height: 100%; object-fit: cover; }
  .pxp-qart svg { width: 55%; height: 55%; }
  .pxp-qtitle { font-size: .82rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pxp-qtitle.active { color: var(--pxp-cyan); }
  .pxp-qartist { font-size: .72rem; color: var(--pxp-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pxp-qdur { font-size: .72rem; color: var(--pxp-muted); font-variant-numeric: tabular-nums; }
  .pxp-qdel { background: none; border: none; color: var(--pxp-muted); cursor: pointer; padding: .25rem; border-radius: .4rem; opacity: 0; transition: opacity .12s; }
  .pxp-qitem:hover .pxp-qdel { opacity: 1; }
  .pxp-qdel:hover { color: #ff5b6e; }

  .pxp-empty { display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; padding: 2rem 1rem; }
  .pxp-empty-icon { width: 5.5rem; height: 5.5rem; border-radius: 9999px; background: linear-gradient(135deg, var(--pxp-pink), var(--pxp-cyan)); display: grid; place-items: center; color: #000; box-shadow: 0 0 40px -8px var(--pxp-pink), 0 0 26px -10px var(--pxp-cyan); }
  .pxp-empty-icon svg { width: 2.4rem; height: 2.4rem; }
  .pxp-empty h3 { font-size: 1.15rem; background: linear-gradient(90deg, var(--pxp-pink), var(--pxp-cyan)); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .pxp-empty p { color: var(--pxp-muted); font-size: .84rem; max-width: 20rem; }

  .pxp-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.7); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 99999; }
  .pxp-modal { width: 100%; max-width: 26rem; background: #140a12; border: 1px solid var(--pxp-border); border-radius: 1rem; padding: 1.25rem; box-shadow: 0 0 60px -20px var(--pxp-pink); }
  .pxp-modal h4 { font-size: 1rem; margin-bottom: 1rem; }
  .pxp-drop { border: 2px dashed rgba(255,255,255,.2); border-radius: .8rem; padding: 1.5rem; text-align: center; color: var(--pxp-muted); cursor: pointer; }
  .pxp-drop:hover { border-color: var(--pxp-pink); color: var(--pxp-fg); }
  .pxp-drafts { max-height: 14rem; overflow-y: auto; display: flex; flex-direction: column; gap: .6rem; margin-top: .8rem; }
  .pxp-draft { border: 1px solid rgba(255,255,255,.1); border-radius: .7rem; padding: .6rem; display: flex; flex-direction: column; gap: .4rem; }
  .pxp-draft-row { display: flex; align-items: center; gap: .5rem; font-size: .72rem; color: var(--pxp-muted); }
  .pxp-draft-fields { display: grid; grid-template-columns: 1fr 1fr; gap: .4rem; }
  .pxp-draft-fields label { font-size: .62rem; color: var(--pxp-muted); display: flex; flex-direction: column; gap: .15rem; }
  .pxp-input { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.15); color: var(--pxp-fg); border-radius: .45rem; padding: .35rem .5rem; font-size: .78rem; }
  .pxp-input:focus { outline: none; border-color: var(--pxp-pink); }
  .pxp-modal-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; gap: .6rem; }
  .pxp-btn-ghost { background: none; border: 1px solid rgba(255,255,255,.15); color: var(--pxp-muted); }
  .pxp-btn-ghost:hover { color: var(--pxp-fg); filter: none; }
  .pxp-hint { font-size: .72rem; color: var(--pxp-muted); margin-top: .5rem; }

  .pxp-eq { display: inline-flex; align-items: flex-end; gap: 2px; height: .9rem; }
  .pxp-eq span { width: 3px; background: linear-gradient(180deg, var(--pxp-pink), var(--pxp-cyan)); animation: pxp-eq .9s ease-in-out infinite; transform-origin: bottom; }
  .pxp-eq span:nth-child(1) { height: 55%; }
  .pxp-eq span:nth-child(2) { height: 100%; animation-delay: .2s; }
  .pxp-eq span:nth-child(3) { height: 70%; animation-delay: .4s; }
  @keyframes pxp-eq { 0%,100% { transform: scaleY(.4); } 50% { transform: scaleY(1); } }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,46,159,.4); border-radius: 9999px; }
  ::-webkit-scrollbar-track { background: transparent; }
  `

  /* ------------------------------------------------------------------ *
   * Inline SVG helpers
   * ------------------------------------------------------------------ */
  const ICONS = {
    music: '<svg class="music" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5v14l8-7zM16 5h2v14h-2z"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 5v14l-8-7zM6 5h2v14H6z"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
    repeat1: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/><path d="M11 10h1v4"/></svg>',
    vol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>',
    volx: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/></svg>',
    grip: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg>',
    spotify: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.4.1-.7-.2-.7-.5 0-.3.2-.6.5-.6 4-.9 7.4-.4 10.1 1.2.4.1.5.5.3.7zm1.5-3.3c-.3.4-.8.5-1.2.2-2.8-1.7-7.1-2.2-10.4-1.2-.5.1-1-.2-1-.7 0-.4.3-.7.7-.8 3.8-1.1 8.5-.6 11.7 1.4.4.3.5.9.2 1.1zm.1-3.4C15.6 8.5 8.5 8.3 5.4 9.3c-.5.2-1-.2-1.1-.7-.1-.5.2-1 .7-1.1 3.6-1.1 11.4-.8 15.5 1.6.5.3.6.9.3 1.4-.3.4-.9.5-1.2.1z"/></svg>',
  }

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */
  function fmt(s) {
    if (!Number.isFinite(s) || s < 0) return '0:00'
    const m = Math.floor(s / 60)
    const r = Math.floor(s % 60)
    return m + ':' + String(r).padStart(2, '0')
  }
  function nameFromFile(n) {
    const base = n.replace(/\.[^.]+$/, '')
    return base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim() || 'Untitled'
  }
  function isAudio(f) {
    const okTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg', 'audio/x-wav']
    if (okTypes.includes(f.type)) return true
    const ext = (f.name.split('.').pop() || '').toLowerCase()
    return ['mp3', 'm4a', 'wav', 'ogg'].includes(ext)
  }
  function loadLibrary() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const arr = JSON.parse(raw)
      return Array.isArray(arr) ? arr.filter((t) => t && t.url) : []
    } catch { return [] }
  }
  function saveLibrary(tracks) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks)) } catch { /* ignore */ }
  }
  function uid() { return 'px-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7) }

  /* ------------------------------------------------------------------ *
   * Player instance
   * ------------------------------------------------------------------ */
  class PlanetXPlayer {
    constructor(host) {
      this.host = host
      this.audio = new Audio()
      this.audio.preload = 'metadata'
      this.tracks = loadLibrary()
      this.index = 0
      this.isPlaying = false
      this.shuffle = false
      this.repeat = 'off'
      this.volume = 0.8
      this.dragIndex = null
      this.overIndex = null
      this.drafts = []
      this.rejected = []

      // shadow root
      this.root = host.attachShadow({ mode: 'open' })

      this.renderShell()

      // audio events
      this.audio.addEventListener('timeupdate', () => { this.elTime.textContent = fmt(this.audio.currentTime); this.updateFill() })
      this.audio.addEventListener('loadedmetadata', () => { this.elDur.textContent = fmt(this.audio.duration); this.updateFill() })
      this.audio.addEventListener('ended', () => this.handleEnded())
      this.audio.addEventListener('error', () => { this.isPlaying = false; this.renderPlayBtn() })
      this.audio.volume = this.volume

      this.bindEvents()
      this.renderQueue()
      this.renderNowPlaying()
      this.renderPlayBtn()

      // keyboard shortcuts scoped to this instance
      this._onKey = (e) => this.handleKey(e)
      document.addEventListener('keydown', this._onKey)
    }

    /* ----- shell ----- */
    renderShell() {
      this.root.innerHTML = `
        <style>${STYLES}</style>
        <div class="pxp-root">
          <div class="pxp-glow"><div class="c2"></div></div>
          <div class="pxp-inner">
            <div class="pxp-head">
              <div class="pxp-brand">
                <div class="pxp-logo">X</div>
                <span class="pxp-name">planet.X Player</span>
              </div>
              <button class="pxp-btn" data-act="upload">${ICONS.plus} Upload</button>
            </div>
            <div class="pxp-body">
              <div class="pxp-player-col" data-slot="player"></div>
              <div class="pxp-queue-col">
                <div class="pxp-queue-head"><span class="pxp-dot"></span> Queue <span class="pxp-qcount" data-slot="qcount">0</span></div>
                <ul class="pxp-queue" data-slot="queue"></ul>
              </div>
            </div>
          </div>
        </div>
      `
      this.elRoot = this.root.querySelector('.pxp-root')
      this.elPlayer = this.root.querySelector('[data-slot="player"]')
      this.elQueue = this.root.querySelector('[data-slot="queue"]')
      this.elQcount = this.root.querySelector('[data-slot="qcount"]')
      this.elTime = document.createElement('span')
      this.elDur = document.createElement('span')
    }

    /* ----- now playing ----- */
    renderNowPlaying() {
      const t = this.tracks[this.index]
      if (!t) {
        this.elPlayer.innerHTML = `
          <div class="pxp-empty">
            <div class="pxp-empty-icon">${ICONS.music}</div>
            <h3>Your library is empty</h3>
            <p>Upload your own tracks — mp3, m4a, wav, or ogg — and they'll be ready to play.</p>
            <button class="pxp-btn" data-act="upload">${ICONS.upload} Upload your first track</button>
          </div>`
        return
      }
      const art = t.cover
        ? `<img src="${t.cover}" alt="${esc(t.title)} cover">`
        : ICONS.music
      this.elPlayer.innerHTML = `
        <div class="pxp-art">${art}</div>
        <div class="pxp-title">${esc(t.title)}</div>
        <div class="pxp-sub">${esc(t.artist)} · ${esc(t.album)}</div>
        <div class="pxp-seek">
          <div class="pxp-track" data-act="seek">
            <div class="pxp-fill" style="width:0%"></div>
          </div>
          <div class="pxp-times"><span data-slot="time">0:00</span><span data-slot="dur">0:00</span></div>
        </div>
        <div class="pxp-transport">
          <button class="pxp-ctl ${this.shuffle ? 'on' : ''}" data-act="shuffle" title="Shuffle">${ICONS.shuffle}</button>
          <button class="pxp-ctl" data-act="prev" title="Previous">${ICONS.prev}</button>
          <button class="pxp-play" data-act="toggle" title="Play/Pause"></button>
          <button class="pxp-ctl" data-act="next" title="Next">${ICONS.next}</button>
          <button class="pxp-ctl ${this.repeat !== 'off' ? 'on' : ''}" data-act="repeat" title="Repeat">${this.repeat === 'one' ? ICONS.repeat1 : ICONS.repeat}</button>
        </div>
        <div class="pxp-aux">
          <div class="pxp-vol">
            <button class="pxp-ctl" data-act="vol-toggle" title="Mute">${this.volume > 0 ? ICONS.vol : ICONS.volx}</button>
            <input type="range" min="0" max="100" value="${Math.round(this.volume * 100)}" data-act="vol" aria-label="Volume">
          </div>
          <a class="pxp-spotify" href="https://developer.spotify.com/documentation/web-playback-sdk" target="_blank" rel="noreferrer">${ICONS.spotify} Connect Spotify</a>
        </div>
      `
      this.elTime = this.elPlayer.querySelector('[data-slot="time"]')
      this.elDur = this.elPlayer.querySelector('[data-slot="dur"]')
      this.elTime.textContent = fmt(this.audio.currentTime || 0)
      this.elDur.textContent = fmt(this.audio.duration || 0)
      this.updateFill()
    }

    renderPlayBtn() {
      const btn = this.elPlayer && this.elPlayer.querySelector('[data-act="toggle"]')
      if (!btn) return
      btn.innerHTML = this.isPlaying ? ICONS.pause : ICONS.play
    }

    updateFill() {
      const track = this.elPlayer && this.elPlayer.querySelector('.pxp-track')
      if (!track) return
      const fill = track.querySelector('.pxp-fill')
      const d = this.audio.duration
      if (d > 0) fill.style.width = Math.min(100, (this.audio.currentTime / d) * 100) + '%'
    }

    /* ----- queue ----- */
    renderQueue() {
      this.elQcount.textContent = this.tracks.length
      if (this.tracks.length === 0) {
        this.elQueue.innerHTML = `<li class="pxp-qitem" style="cursor:default;color:var(--pxp-muted);font-size:.82rem">Your queue is empty. Upload some tracks to get started.</li>`
        return
      }
      const cur = this.tracks[this.index]
      this.elQueue.innerHTML = ''
      this.tracks.forEach((t, i) => {
        const active = cur && t.id === cur.id
        const li = document.createElement('li')
        li.className = 'pxp-qitem' + (active ? ' active' : '') + (this.dragIndex === i ? ' dragging' : '') + (this.overIndex === i && this.dragIndex !== i ? ' drop' : '')
        li.draggable = true
        li.dataset.idx = String(i)
        li.innerHTML = `
          <span class="pxp-grip">${ICONS.grip}</span>
          <span class="pxp-qidx">${active && this.isPlaying ? '<span class="pxp-eq"><span></span><span></span><span></span></span>' : i + 1}</span>
          <button class="pxp-qplay">
            <span class="pxp-qart">${t.cover ? `<img src="${t.cover}" alt="">` : ICONS.music}</span>
            <span style="min-width:0">
              <span class="pxp-qtitle ${active ? 'active' : ''}">${esc(t.title)}</span>
              <span class="pxp-qartist">${esc(t.artist)} · ${esc(t.album)}</span>
            </span>
          </button>
          <span class="pxp-qdur">${t.duration ? fmt(t.duration) : ''}</span>
          <button class="pxp-qdel" data-act="remove" data-id="${t.id}" title="Remove">${ICONS.trash}</button>
        `
        this.elQueue.appendChild(li)
      })
    }

    /* ----- events ----- */
    bindEvents() {
      this.elRoot.addEventListener('click', (e) => {
        const actEl = e.target.closest('[data-act]')
        if (!actEl) return
        const act = actEl.dataset.act
        if (act === 'upload') this.openUpload()
        else if (act === 'toggle') this.togglePlay()
        else if (act === 'next') this.next()
        else if (act === 'prev') this.prev()
        else if (act === 'shuffle') { this.shuffle = !this.shuffle; this.renderNowPlaying() }
        else if (act === 'repeat') { this.repeat = this.repeat === 'off' ? 'all' : this.repeat === 'all' ? 'one' : 'off'; this.renderNowPlaying() }
        else if (act === 'remove') this.removeTrack(actEl.dataset.id)
        else if (act === 'vol-toggle') { this.setVolume(this.volume > 0 ? 0 : 0.8); }
      })

      // play a specific queue item
      this.elRoot.addEventListener('click', (e) => {
        const play = e.target.closest('.pxp-qplay')
        if (play) {
          const li = play.closest('.pxp-qitem')
          this.playIndex(Number(li.dataset.idx))
        }
      })

      // seek
      this.elRoot.addEventListener('pointerdown', (e) => {
        const track = e.target.closest('.pxp-track')
        if (track) this.seekFromEvent(e, track)
      })

      // volume
      this.elRoot.addEventListener('input', (e) => {
        const v = e.target.closest('[data-act="vol"]')
        if (v) this.setVolume(Number(v.value) / 100)
      })

      // drag-to-reorder
      this.elRoot.addEventListener('dragstart', (e) => {
        const li = e.target.closest('.pxp-qitem')
        if (!li) return
        this.dragIndex = Number(li.dataset.idx)
        li.classList.add('dragging')
        e.dataTransfer.effectAllowed = 'move'
      })
      this.elRoot.addEventListener('dragover', (e) => {
        const li = e.target.closest('.pxp-qitem')
        if (!li || this.dragIndex === null) return
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        const idx = Number(li.dataset.idx)
        if (this.overIndex !== idx) {
          this.overIndex = idx
          this.renderQueue()
        }
      })
      this.elRoot.addEventListener('drop', (e) => {
        const li = e.target.closest('.pxp-qitem')
        if (!li || this.dragIndex === null) return
        e.preventDefault()
        const to = Number(li.dataset.idx)
        this.reorder(this.dragIndex, to)
        this.dragIndex = null
        this.overIndex = null
        this.renderQueue()
      })
      this.elRoot.addEventListener('dragend', () => {
        this.dragIndex = null
        this.overIndex = null
        this.renderQueue()
      })
    }

    handleKey(e) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space') { e.preventDefault(); this.togglePlay() }
      else if (e.key === 'ArrowRight') this.seek(this.audio.currentTime + 5)
      else if (e.key === 'ArrowLeft') this.seek(this.audio.currentTime - 5)
      else if (e.key.toLowerCase() === 'n') this.next()
      else if (e.key.toLowerCase() === 'p') this.prev()
    }

    /* ----- playback ----- */
    loadAndPlay(i) {
      const t = this.tracks[i]
      if (!t) return
      this.audio.src = t.url
      this.audio.load()
      if (this.isPlaying) this.audio.play().catch(() => {})
      this.renderNowPlaying()
      this.renderQueue()
    }

    playIndex(i) {
      if (i < 0 || i >= this.tracks.length) return
      this.index = i
      this.isPlaying = true
      this.loadAndPlay(i)
    }

    togglePlay() {
      if (!this.tracks[this.index]) return
      if (this.isPlaying) { this.audio.pause(); this.isPlaying = false }
      else { this.audio.play().catch(() => {}); this.isPlaying = true }
      this.renderPlayBtn()
      this.renderQueue()
    }

    next() {
      const n = this.tracks.length
      if (n === 0) return
      if (this.shuffle) {
        let ni = this.index
        while (ni === this.index && n > 1) ni = Math.floor(Math.random() * n)
        this.playIndex(ni)
      } else {
        this.playIndex((this.index + 1) % n)
      }
    }

    prev() {
      const n = this.tracks.length
      if (n === 0) return
      if (this.audio.currentTime > 3) { this.seek(0); return }
      this.playIndex((this.index - 1 + n) % n)
    }

    handleEnded() {
      if (this.repeat === 'one') { this.seek(0); this.audio.play().catch(() => {}) }
      else if (this.repeat === 'all') this.next()
      else if (this.index < this.tracks.length - 1) this.next()
      else { this.isPlaying = false; this.renderPlayBtn() }
    }

    seek(t) {
      if (Number.isFinite(t)) this.audio.currentTime = Math.max(0, t)
    }
    seekFromEvent(e, track) {
      const r = track.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      this.seek(ratio * (this.audio.duration || 0))
      this.updateFill()
    }
    setVolume(v) {
      this.volume = Math.max(0, Math.min(1, v))
      this.audio.volume = this.volume
      const btn = this.elPlayer && this.elPlayer.querySelector('[data-act="vol-toggle"]')
      if (btn) btn.innerHTML = this.volume > 0 ? ICONS.vol : ICONS.volx
    }

    removeTrack(id) {
      const idx = this.tracks.findIndex((t) => t.id === id)
      if (idx < 0) return
      this.tracks.splice(idx, 1)
      if (idx < this.index) this.index--
      else if (idx === this.index) {
        if (this.tracks.length === 0) {
          this.audio.pause(); this.audio.removeAttribute('src')
          this.isPlaying = false
          this.index = 0
        } else {
          this.index = Math.min(idx, this.tracks.length - 1)
          this.loadAndPlay(this.index)
        }
      }
      saveLibrary(this.tracks)
      this.renderQueue()
      this.renderNowPlaying()
    }

    reorder(from, to) {
      if (from === to) return
      const [m] = this.tracks.splice(from, 1)
      this.tracks.splice(to, 0, m)
      if (this.index === from) this.index = to
      else if (from < this.index && to >= this.index) this.index--
      else if (from > this.index && to <= this.index) this.index++
      saveLibrary(this.tracks)
      this.renderQueue()
      this.renderNowPlaying()
    }

    /* ----- public API ----- */
    addTracks(tracks) {
      const existing = new Set(this.tracks.map((t) => t.id))
      const fresh = tracks.filter((t) => t.url && !existing.has(t.id))
      if (fresh.length === 0) return
      const wasEmpty = this.tracks.length === 0
      this.tracks.push(...fresh)
      saveLibrary(this.tracks)
      this.renderQueue()
      if (wasEmpty) {
        this.index = 0
        this.renderNowPlaying()
        this.renderPlayBtn()
      }
    }

    playTrack(track) {
      const i = this.tracks.findIndex((t) => t.id === track.id)
      if (i >= 0) this.playIndex(i)
      else { this.addTracks([track]); this.playIndex(this.tracks.length - 1) }
    }

    destroy() {
      this.audio.pause()
      this.audio.src = ''
      document.removeEventListener('keydown', this._onKey)
      this.root.innerHTML = ''
    }

    /* ----- upload modal ----- */
    openUpload() {
      const backdrop = document.createElement('div')
      backdrop.className = 'pxp-modal-backdrop'
      backdrop.innerHTML = `
        <div class="pxp-modal">
          <h4>Upload tracks</h4>
          <div class="pxp-drop" data-act="browse">${ICONS.upload} Drop audio files here or click to browse<br><span style="font-size:.7rem">mp3 · m4a · wav · ogg</span></div>
          <div class="pxp-drafts" data-slot="drafts"></div>
          <p class="pxp-hint" data-slot="rejected"></p>
          <div class="pxp-modal-actions">
            <button class="pxp-btn pxp-btn-ghost" data-act="add-more">${ICONS.plus} Add more</button>
            <div style="display:flex;gap:.5rem">
              <button class="pxp-btn pxp-btn-ghost" data-act="cancel">Cancel</button>
              <button class="pxp-btn" data-act="confirm">Add tracks</button>
            </div>
          </div>
        </div>
      `
      this.root.appendChild(backdrop)
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = '.mp3,.m4a,.wav,.ogg,audio/*'
      fileInput.multiple = true
      fileInput.style.display = 'none'
      backdrop.appendChild(fileInput)

      const draftsEl = backdrop.querySelector('[data-slot="drafts"]')
      const rejectedEl = backdrop.querySelector('[data-slot="rejected"]')

      const renderDrafts = () => {
        draftsEl.innerHTML = ''
        this.drafts.forEach((d, i) => {
          const row = document.createElement('div')
          row.className = 'pxp-draft'
          row.innerHTML = `
            <div class="pxp-draft-row">
              <span style="color:var(--pxp-cyan)">${ICONS.music}</span>
              <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(d.file.name)}</span>
              <button class="pxp-ctl" data-act="rm-draft" data-i="${i}" title="Remove">${ICONS.x}</button>
            </div>
            <div class="pxp-draft-fields">
              <label>Title <input class="pxp-input" data-i="${i}" data-k="title" value="${esc(d.title)}"></label>
              <label>Artist <input class="pxp-input" data-i="${i}" data-k="artist" value="${esc(d.artist)}" placeholder="You"></label>
              <label>Album <input class="pxp-input" data-i="${i}" data-k="album" value="${esc(d.album)}" placeholder="My Library"></label>
              <label>Cover <input class="pxp-input" type="file" accept="image/*" data-i="${i}" data-k="cover"></label>
            </div>
          `
          draftsEl.appendChild(row)
        })
        rejectedEl.textContent = this.rejected.length ? `Skipped ${this.rejected.length} unsupported file(s): ${this.rejected.slice(0, 2).join(', ')}` : ''
      }

      const handleFiles = (files) => {
        for (const f of files) {
          if (!isAudio(f)) { this.rejected.push(f.name); continue }
          this.drafts.push({ file: f, url: URL.createObjectURL(f), title: nameFromFile(f.name), artist: '', album: '', cover: null })
        }
        renderDrafts()
      }

      const browse = () => fileInput.click()

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.remove()
        const t = e.target.closest('[data-act]')
        if (!t) return
        const act = t.dataset.act
        if (act === 'browse' || act === 'add-more') browse()
        else if (act === 'cancel') backdrop.remove()
        else if (act === 'rm-draft') { this.drafts.splice(Number(t.dataset.i), 1); renderDrafts() }
        else if (act === 'confirm') {
          const tracks = this.drafts.map((d, i) => ({
            id: uid(),
            title: d.title.trim() || nameFromFile(d.file.name),
            artist: d.artist.trim() || 'Unknown Artist',
            album: d.album.trim() || 'My Library',
            url: d.url,
            cover: d.cover || undefined,
            isUpload: true,
          }))
          this.addTracks(tracks)
          this.drafts = []
          this.rejected = []
          backdrop.remove()
        }
      })

      fileInput.addEventListener('change', (e) => { handleFiles(e.target.files); fileInput.value = '' })

      // live-edit draft fields
      draftsEl.addEventListener('input', (e) => {
        const inp = e.target.closest('.pxp-input')
        if (!inp || inp.dataset.k === 'cover') return
        this.drafts[Number(inp.dataset.i)][inp.dataset.k] = inp.value
      })
      draftsEl.addEventListener('change', (e) => {
        const inp = e.target.closest('.pxp-input')
        if (!inp || inp.dataset.k !== 'cover') return
        const f = inp.files && inp.files[0]
        if (f) this.drafts[Number(inp.dataset.i)].cover = URL.createObjectURL(f)
      })

      renderDrafts()
    }
  }

  /* ------------------------------------------------------------------ *
   * Escape helper for injected text
   * ------------------------------------------------------------------ */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  }

  /* ------------------------------------------------------------------ *
   * Global API
   * ------------------------------------------------------------------ */
  const instances = new WeakMap()

  const API = {
    mount(el) {
      if (!el) throw new Error('planet.X Player: mount() needs an element')
      if (instances.has(el)) return instances.get(el)
      const inst = new PlanetXPlayer(el)
      instances.set(el, inst)
      return inst
    },
    mountAll(scope) {
      const doc = scope || document
      const els = doc.querySelectorAll('[data-planet-player]')
      const out = []
      els.forEach((el) => { try { out.push(API.mount(el)) } catch (e) { console.warn(e) } })
      return out
    },
  }

  global.PlanetXPlayer = API

  // Auto-init on DOMContentLoaded (and immediately if already loaded)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => API.mountAll())
  } else {
    API.mountAll()
  }
})(typeof window !== 'undefined' ? window : globalThis)
