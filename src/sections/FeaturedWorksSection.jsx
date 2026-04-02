import { useState, useRef, useEffect, useCallback } from 'react'
import { useProjects } from '../context/ProjectContext'
import gamedevImg from '../assets/images/featured/gamedev.png'
import webdevImg from '../assets/images/featured/webdev.png'
import innovationImg from '../assets/images/featured/innovationdev.png'

const SLIDES = [
  {
    id: 'games',
    category: 'Games',
    title: 'Game Development',
    subtitle: 'We craft immersive gaming experiences — from concept to launch, blending creative design with high-performance engineering.',
    image: gamedevImg,
  },
  {
    id: 'websites',
    category: 'Websites',
    title: 'Web Development',
    subtitle: 'We build fast, beautiful, and scalable web products tailored to your brand and optimised for every screen.',
    image: webdevImg,
  },
  {
    id: 'innovation',
    category: 'Innovation',
    title: 'Innovation & R&D',
    subtitle: 'We push boundaries with emerging tech — AI, XR, and next-gen platforms — turning bold ideas into real products.',
    image: innovationImg,
  },
]

// Module-level helpers kept outside component to avoid ESLint deep-nesting warnings

const TITLE_OPTS = { minOp: 0.12, opRate: 1.6, minSc: 0.72, scRate: 0.28 }
const IMAGE_OPTS = { minOp: 0.15, opRate: 1.6, minSc: 0.78, scRate: 0.15 }
// snapToIdx uses a softer opacity falloff than calcScrollOpacities because
// index-distance is discrete (integers) vs continuous scroll ratios
const SNAP_OPACITY_DAMPING = 0.38

function calcScrollOpacities(container, refs, opts) {
  const centerY = container.scrollTop + container.clientHeight / 2
  let bestIdx = 0, bestDist = Infinity
  refs.forEach((el, i) => {
    if (!el) return
    const dist = Math.abs((el.offsetTop + el.offsetHeight / 2) - centerY)
    const ratio = dist / (container.clientHeight * 0.5)
    el.style.opacity = Math.max(opts.minOp, 1 - ratio * opts.opRate)
    el.style.transform = `scale(${Math.max(opts.minSc, 1 - ratio * opts.scRate)})`
    if (dist < bestDist) { bestDist = dist; bestIdx = i }
  })
  return bestIdx
}

function snapToIdx(container, refs, idx, opts) {
  refs.forEach((el, i) => {
    if (!el) return
    const dist = Math.abs(i - idx)
    el.style.opacity = Math.max(opts.minOp, 1 - dist * opts.opRate * SNAP_OPACITY_DAMPING)
    el.style.transform = `scale(${Math.max(opts.minSc, 1 - dist * opts.scRate)})`
  })
  const activeEl = refs[idx]
  if (container && activeEl) {
    container.scrollTo({
      top: activeEl.offsetTop - container.clientHeight / 2 + activeEl.offsetHeight / 2,
      behavior: 'smooth',
    })
  }
}

function openProjectLink(project) {
  if (project.link) window.open(project.link, '_blank', 'noopener,noreferrer')
}


// ── Projects vertical scroll view ────────────────────────────────────────────

function ProjectsList({ category, onBack }) {
  const { projects } = useProjects()
  const filtered = projects.filter(p => p.category === category)
  const listRef = useRef(null)
  const itemRefs = useRef([])
  const imgListRef = useRef(null)
  const imgItemRefs = useRef([])
  const isSyncing = useRef(false)
  const syncTimer = useRef(null)

  function lockSync() {
    isSyncing.current = true
    clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(() => { isSyncing.current = false }, 450)
  }

  const handleTitleScroll = useCallback(() => {
    if (isSyncing.current) return
    const idx = calcScrollOpacities(listRef.current, itemRefs.current, TITLE_OPTS)
    lockSync()
    snapToIdx(imgListRef.current, imgItemRefs.current, idx, IMAGE_OPTS)
  }, [])

  const handleImageScroll = useCallback(() => {
    if (isSyncing.current) return
    const idx = calcScrollOpacities(imgListRef.current, imgItemRefs.current, IMAGE_OPTS)
    lockSync()
    snapToIdx(listRef.current, itemRefs.current, idx, TITLE_OPTS)
  }, [])

  // Apply initial styles on mount; clear stale refs when project list changes
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, filtered.length)
    imgItemRefs.current = imgItemRefs.current.slice(0, filtered.length)
    if (listRef.current) calcScrollOpacities(listRef.current, itemRefs.current, TITLE_OPTS)
    snapToIdx(imgListRef.current, imgItemRefs.current, 0, IMAGE_OPTS)
  }, [filtered.length])

  // Clean up pending sync timer on unmount
  useEffect(() => () => clearTimeout(syncTimer.current), [])

  return (
    <div className="pv_section">
      <div className="pv_header">
        <button className="pv_back" onClick={onBack}>← Back</button>
        <span className="pv_category_label">{category}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="pv_empty">No {category} projects added yet.</div>
      ) : (
        <div className="pv_body">
          <div className="pv_list_wrap">
            <div className="pv_fade pv_fade--top" />
            <div className="pv_list" ref={listRef} onScroll={handleTitleScroll}>
              {filtered.map((project, i) => (
                <button
                  key={project.id}
                  ref={el => { itemRefs.current[i] = el }}
                  className="pv_item"
                  onClick={() => openProjectLink(project)}
                  style={{ opacity: 0.12 }}
                >
                  <span className="pv_item_title">{project.title}</span>
                  {project.tags?.length > 0 && (
                    <span className="pv_item_tags">{project.tags.join(' · ')}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="pv_fade pv_fade--bottom" />
          </div>

          <div className="pv_image_panel">
            <div className="pv_fade pv_fade--top" />
            <div className="pv_img_list" ref={imgListRef} onScroll={handleImageScroll}>
              {filtered.map((project, i) => (
                <button
                  key={project.id}
                  ref={el => { imgItemRefs.current[i] = el }}
                  className="pv_img_item"
                  style={{ opacity: 0.15 }}
                  onClick={() => openProjectLink(project)}
                >
                  {project.imageUrl
                    ? <img src={project.imageUrl} alt={project.title} className="pv_image" />
                    : <div className="pv_image_placeholder" />
                  }
                </button>
              ))}
            </div>
            <div className="pv_fade pv_fade--bottom" />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Featured carousel ─────────────────────────────────────────────────────────

export default function FeaturedWorksSection() {
  const [view, setView] = useState('carousel')
  const [activeCategory, setActiveCategory] = useState(null)
  const [current, setCurrent] = useState(0)

  function handleExplore(category) {
    setActiveCategory(category)
    setView('projects')
  }

  function handleBack() {
    setView('carousel')
    setActiveCategory(null)
  }

  function prev() { setCurrent(i => (i - 1 + SLIDES.length) % SLIDES.length) }
  function next() { setCurrent(i => (i + 1) % SLIDES.length) }

  const touchStartX = useRef(null)

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 40) return
    if (dx < 0) next(); else prev()
  }

  return (
    <section id="work" className="featured_section">
      {view === 'projects' ? (
        <ProjectsList category={activeCategory} onBack={handleBack} />
      ) : (
        <>
          <div className="featured_header">
            <h2 className="featured_title">Featured Works</h2>
            <div className="featured_nav">
              <button className="featured_nav_btn" onClick={prev} aria-label="Previous">←</button>
              <div className="featured_dots">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    className={`featured_dot ${i === current ? 'featured_dot--active' : ''}`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to ${s.title}`}
                  />
                ))}
              </div>
              <button className="featured_nav_btn" onClick={next} aria-label="Next">→</button>
            </div>
          </div>

          <div className="featured_track_wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="featured_track" style={{ transform: `translateX(-${current * 100}%)` }}>
              {SLIDES.map((slide, i) => (
                <div key={slide.id} className={`featured_card ${i % 2 === 1 ? 'featured_card--reverse' : ''}`}>
                  <div className="featured_card_image">
                    <img src={slide.image} alt={slide.title} />
                  </div>
                  <div className="featured_card_content">
                    <h3 className="featured_card_title">{slide.title}</h3>
                    <p className="featured_card_sub">{slide.subtitle}</p>
                    <button className="featured_card_btn" onClick={() => handleExplore(slide.category)}>
                      Explore more →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
