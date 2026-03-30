# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

## Architecture

React 19 + Vite 8 client showcase site. Plain JavaScript (JSX), no TypeScript.

**Entry flow:** `index.html` → `src/main.jsx` → `src/App.jsx` (routing root)

### Routing

| Path | Description |
|---|---|
| `/` | Public showcase (`pages/Home.jsx`) |
| `/admin` | Admin login (`pages/admin/Login.jsx`) |
| `/admin/dashboard` | Protected dashboard (`pages/admin/Dashboard.jsx`) |

`ProtectedRoute` redirects unauthenticated users to `/admin`. `vercel.json` rewrites all paths to `index.html` for client-side routing to work on Vercel.

### State / Context

- **`AuthContext`** — admin session in `sessionStorage`. Checks `VITE_ADMIN_PASSWORD` env var (default: `admin123`).
- **`ProjectContext`** — project CRUD persisted to `localStorage`. Exports `CATEGORIES = ['Games', 'Websites', 'Innovation']`. Both contexts wrap the app in `App.jsx`. localStorage is per-browser — there is no shared database.

### Page composition

`Home.jsx` composes sections in order: `HeroSection` → `InfiniteMarque` → `DiscoverSection` → `FeaturedWorksSection` → `ProjectsGridSection` → `OurServiceSection` → `AdvantageSection` → `OurClientsSection` → `JoinUsSection` → `ReadyTextSliderSection`. Add new home sections to `src/sections/` and import them there. `Footer` renders outside `<main>`.

`src/components/` holds pieces reused across sections (Navbar, ProjectCard, ParticleEffect, ProtectedRoute).

### Styling

Single global stylesheet: `src/index.css`. All CSS variables are defined in the `:root` block at the top, including `--thumb-size` for the discover section slider. No CSS modules or Tailwind. File is structured with `/* ══ SECTION ══ */` comments per section; each section's `@media (max-width: 768px)` block follows immediately after its base styles.

### Image assets

```
src/assets/images/
├── hero/        # Particle morph targets (enfection.png, momentro.png)
├── marque/      # Tech logo icons for the infinite marquee
├── discover/    # Icons for the discover section thumb slider
├── featured/    # Category hero images (gamedev.png, webdev.png, innovationdev.png)
├── ourservice/  # Per-service background images (blue/green/orange/purple/red/yellow .jpg)
└── ourclients/  # Client logo images (logo1–logo12)
```

### 3D particle effect (`ParticleEffect.jsx`)

Uses Three.js + GSAP. Cycles: scatter → sphere → scatter → Enfection logo → scatter → Momentro logo → scatter. Images are loaded via `getLogoPoints()` which samples non-transparent pixels from a 200×200 canvas. All shape helpers are **module-level functions** (outside the component) — keep them there to avoid ESLint deep-nesting warnings. If an image fails to load, `getLogoPoints` resolves `null` and that shape is skipped via `results.filter(Boolean)`.

### Discover section thumb slider

`DiscoverSection.jsx` renders a vertical infinite scroll inside `.discover_thumb` using a CSS `@keyframes thumb-slide` animation. It animates `translateY(calc(var(--thumb-size) * -3))` — an exact pixel value — because percentage-based `translateY` is unreliable on inline/block elements with dynamic heights. The image list is 9 items (3 images × 3 copies); moving `-3 × --thumb-size` shifts exactly one full set for a seamless loop.

### Infinite marquee (`InfiniteMarque.jsx`)

Uses 4 copies of 8 logos and animates `translateX(-25%)` (= one full set). Four copies guarantee the track always overflows the viewport so no gap appears during the loop.

### Featured Works section (`FeaturedWorksSection.jsx`)

Two views toggled by `view` state (`'carousel'` | `'projects'`):

- **Carousel** — slides through 3 category cards (`SLIDES`), "Explore more" switches to projects view.
- **ProjectsList** — bidirectional vertical scroll: title list (left) and image list (right) sync via `isSyncing` ref + `lockSync()` timeout to prevent feedback loops. `calcScrollOpacities` reads scroll position to apply opacity/scale; `snapToIdx` applies by index distance and scrolls the other panel. All panel helpers are module-level. Stale refs are cleared on `filtered.length` change; `syncTimer` is cleaned up on unmount.

### Projects grid section (`ProjectsGridSection.jsx`)

Category filter tabs + paginated grid (12 per page). Page transitions use `key={\`${page}-${dir}\`}` on the grid to trigger CSS remount animation — no separate `animKey` state needed. `dir` (`1` | `-1`) is set in the same call as `page` and read as `data-dir` for CSS slide direction.

### Our Services section (`OurServiceSection.jsx`)

Renders a two-column service list. Each `.svc_item` receives its background image via a `--svc-bg` CSS custom property. The hover reveal uses a `::before` pseudo-element animated with `clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)` for a left-to-right wipe.

### Advantage section (`AdvantageSection.jsx`)

Scroll-driven stacked card animation. Section height is `560vh` (mobile: `460vh`) with a `position: sticky` inner container. Module-level `applyCardStyles(refs, scrolled, perCard)` iterates all 10 cards on every scroll event. Cards alternate `.adv_card--dark` (#111) and `.adv_card--glass` (backdrop-filter). Alternating tilt: `(i % 2 === 0 ? -1 : 1) * (2 + i * 1.1)` degrees. Cards fly left/right alternately as they exit.

### Our Clients section (`OurClientsSection.jsx`)

Two-row infinite slider. `ROW1 = [logo1–logo6]`, `ROW2 = [logo7–logo12]`, `SET = 4` copies each. Row 1 animates `clients_left` (`translateX(0 → -25%)`), row 2 animates `clients_right` (`translateX(-25% → 0)`). Fade overlays on both ends; grayscale 0.55 default, full color on hover.

### Ready Text Slider section (`ReadyTextSliderSection.jsx`)

Scroll-driven horizontal text reveal. `COPIES = 4` copies of the phrase. `txStart = vw` (off-screen right), `txEnd = vw - phraseWidth` (✦ separator lands at right edge of viewport). `phraseWidth` is measured from DOM as `track.scrollWidth / COPIES`. Animation triggers when section top reaches 80% from viewport top.

### Join Us / Contact section (`JoinUsSection.jsx`)

Contact form only — the scrolling text was moved to `ReadyTextSliderSection`. Form submits via `mailto:` URI built from `FormData`. Uses uncontrolled inputs (`name` attributes) with `htmlFor`/`id` pairs on all labels and inputs.

### Admin dashboard (`Dashboard.jsx`)

Shared `ProjectForm` component handles both add and edit. Inline edit form renders inside `.inline-edit-wrap` directly below the project row. Edit form receives `key={project.id}` to force a fresh mount when switching between projects. Opening the add form closes any open inline edit (`setEditingId(null)`).

### Image uploads (admin dashboard)

Uploads `POST` to `/showcase-uploads/` (Vite proxies to `https://projects.enfection.com/showcase-uploads/` in dev). Response JSON parsed for `url`, `imageUrl`, `path`, or `link`. Set `VITE_UPLOAD_URL` for production.

### ProjectCard (`components/ProjectCard.jsx`)

Description is truncated to 15 words with `…` ellipsis via `.split(' ').slice(0, 15)`.

## Key Configuration

**React Compiler** enabled via `babel-plugin-react-compiler` in `vite.config.js` — no need for manual `useMemo`/`useCallback`.

**ESLint** uses flat config (`eslint.config.js`). Uppercase and underscore-prefixed vars are excluded from unused-vars. Array index keys in JSX are flagged (`javascript:S6479`) — use stable string IDs instead. Functions defined inside components are flagged for deep nesting (`javascript:S7721`) — keep helpers at module level.

**Vite base** is `/` for Vercel deployment. Change to `/subpath/` if self-hosting under a subdirectory.

**Vite dev proxy** — `/showcase-uploads/` → `https://projects.enfection.com`.

**Section IDs for anchor links:** `#work` (FeaturedWorks), `#projects` (ProjectsGrid), `#services` (OurService), `#about` (Advantage), `#contact` (JoinUs).
