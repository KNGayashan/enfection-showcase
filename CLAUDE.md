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

**Dependencies of note:** Three.js + GSAP (3D particle hero), `react-icons`, `react-router-dom` v7.

### Routing

| Path | Description |
|---|---|
| `/` | Public showcase (`pages/Home.jsx`) |
| `/admin` | Admin login (`pages/admin/Login.jsx`) |
| `/admin/dashboard` | Protected dashboard (`pages/admin/Dashboard.jsx`) |

`ProtectedRoute` redirects unauthenticated users to `/admin`. `vercel.json` rewrites all paths to `index.html` for client-side routing on Vercel.

### State / Context

- **`AuthContext`** — admin session in `sessionStorage`. Checks `VITE_ADMIN_PASSWORD` env var (default: `admin123`).
- **`ProjectContext`** — project CRUD persisted to `localStorage`. Exports `CATEGORIES = ['Games', 'Websites', 'Innovation']`. Both contexts wrap the app in `App.jsx`. localStorage is per-browser — there is no shared backend database.

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
- **ProjectsList** — bidirectional vertical scroll: title list (left) and image list (right) sync via `isSyncing` ref + `lockSync()` timeout to prevent feedback loops. `calcScrollOpacities` reads scroll position to apply opacity/scale; `snapToIdx` applies by index distance and scrolls the other panel. All panel helpers are module-level. Stale refs are cleared on `filtered.length` change; `syncTimer` is cleaned up on unmount. On mobile, the image panel is hidden (`display: none`) — only the title list is shown.

### Projects grid section (`ProjectsGridSection.jsx`)

Category filter tabs + paginated grid (12 per page). Page transitions use `key={\`${page}-${dir}\`}` on the grid to trigger CSS remount animation — no separate `animKey` state needed. `dir` (`1` | `-1`) is set in the same call as `page` and read as `data-dir` for CSS slide direction.

### Our Services section (`OurServiceSection.jsx`)

Renders a two-column service list. Each `.svc_item` receives its background image via a `--svc-bg` CSS custom property. The hover reveal uses a `::before` pseudo-element animated with `clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)` for a left-to-right wipe.

### Advantage section (`AdvantageSection.jsx`)

Scroll-driven stacked card animation. Section height is `560vh` (mobile: `460vh`) with a `position: sticky` inner container. Module-level `applyCardStyles(refs, scrolled, perCard)` iterates all 10 cards on every scroll event. Cards alternate `.adv_card--dark` (#111) and `.adv_card--glass` (backdrop-filter). Alternating tilt: `(i % 2 === 0 ? -1 : 1) * (2 + i * 1.1)` degrees. Cards fly left/right alternately as they exit.

### Our Clients section (`OurClientsSection.jsx`)

Two-row infinite slider. `ROW1 = [logo1–logo6]`, `ROW2 = [logo7–logo12]`, `SET = 4` copies each. Row 1 animates `clients_left` (`translateX(0 → -25%)`), row 2 animates `clients_right` (`translateX(-25% → 0)`). Fade overlays on both ends; grayscale 0.55 default, full color on hover.

### Ready Text Slider section (`ReadyTextSliderSection.jsx`)

Scroll-driven horizontal text reveal. `COPIES = 4` copies of the phrase. The scroll listener maps section visibility to `translateX`: `txStart = vw` (track off-screen right), `txEnd = vw - phraseWidth` (first ✦ separator lands at the right viewport edge). `phraseWidth` is measured from the DOM as `track.scrollWidth / COPIES`. Animation triggers when section top reaches 80% from the viewport top.

### Join Us / Contact section (`JoinUsSection.jsx`)

Contact form only. Form submits via `mailto:` URI built from `FormData`. Uses uncontrolled inputs (`name` attributes) with `htmlFor`/`id` pairs on all labels and inputs.

### Admin dashboard (`Dashboard.jsx`)

Shared `ProjectForm` component handles both add and edit. Inline edit form renders inside `.inline-edit-wrap` directly below the project row. Edit form receives `key={project.id}` to force a fresh mount when switching between projects. Opening the add form closes any open inline edit (`setEditingId(null)`).

### Image uploads (admin dashboard)

Upload `POST` requests go to `/showcase-uploads/`. Response JSON is parsed for `url`, `imageUrl`, `path`, or `link` fields. Set `VITE_UPLOAD_URL` to override the endpoint in production.

### ProjectCard (`components/ProjectCard.jsx`)

Description is truncated to 15 words with `…` ellipsis via `.split(' ').slice(0, 15)`.

## Key Configuration

**React Compiler** enabled via `babel-plugin-react-compiler` in `vite.config.js` — no need for manual `useMemo`/`useCallback`.

**ESLint** uses flat config (`eslint.config.js`). The only custom rule in the project config is `no-unused-vars` with `varsIgnorePattern: '^[A-Z_]'` (uppercase and underscore-prefixed vars are ignored). The `react-refresh/only-export-components` rule comes from `eslint-plugin-react-refresh` — context files that export both a Provider and a hook must add `/* eslint-disable react-refresh/only-export-components */` at the top.

**SonarLint (IDE-only, not project ESLint):** The SonarLint VS Code extension adds additional diagnostics that show as warnings but are not enforced by `npm run lint`. Relevant rules encountered in this codebase: `S6479` (no array-index keys in JSX — use stable string IDs), `S7721` (no functions defined inside components — keep helpers at module level), `S7748` (no trailing zeros in numeric literals, e.g. `0.50` → `0.5`), `S3403` (avoid `===` comparisons that are always false due to type mismatch).

**Vite base** is `/` for Vercel deployment. Change to `/subpath/` if self-hosting under a subdirectory (also update `vercel.json` or Nginx config accordingly).

**Section IDs for anchor links:** `#work` (FeaturedWorks), `#projects` (ProjectsGrid), `#services` (OurService), `#about` (Advantage), `#contact` (JoinUs).
