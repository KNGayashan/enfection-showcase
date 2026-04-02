import { useState, useRef, useEffect } from 'react'
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

function openProjectLink(project) {
  if (project.link) window.open(project.link, '_blank', 'noopener,noreferrer')
}

function applyScale(bodyEl, rowEls) {
  if (!bodyEl) return
  if (window.innerWidth <= 768) {
    rowEls.forEach(el => {
      if (!el) return
      el.style.transform = ''
      el.style.opacity   = ''
    })
    return
  }
  const cRect  = bodyEl.getBoundingClientRect()
  const center = cRect.top + cRect.height / 2
  rowEls.forEach(el => {
    if (!el) return
    const rRect     = el.getBoundingClientRect()
    const rowCenter = rRect.top + rRect.height / 2
    const ratio     = Math.max(0, 1 - Math.abs(rowCenter - center) / (cRect.height * 0.4))
    el.style.transform = `scaleX(${0.84 + 0.16 * ratio}) scaleY(${0.72 + 0.28 * ratio})`
    el.style.opacity   = String(0.3 + 0.7 * ratio)
  })
}

// ── Projects list view ────────────────────────────────────────────────────────

function ProjectsList({ category, onBack }) {
  const { projects } = useProjects()
  const filtered = projects.filter(p => p.category === category)
  const bodyRef = useRef(null)
  const rowRefs = useRef([])

  useEffect(() => {
    applyScale(bodyRef.current, rowRefs.current)
  }, [filtered.length])

  function onScroll() {
    applyScale(bodyRef.current, rowRefs.current)
  }

  return (
    <div className="pv_section">
      <div className="pv_header">
        <button className="pv_back" onClick={onBack}>← Back</button>
        <span className="pv_category_label">{category}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="pv_empty">No {category} projects added yet.</div>
      ) : (
        <div className="pv_body" ref={bodyRef} onScroll={onScroll}>
          <div className="pv_row_spacer" />
          {filtered.map((project, i) => (
            <button
              key={project.id}
              ref={el => { rowRefs.current[i] = el }}
              className="pv_row"
              onClick={() => openProjectLink(project)}
            >
              <div className="pv_row_info">
                <span className="pv_row_title">{project.title}</span>
                {project.tags?.length > 0 && (
                  <span className="pv_row_tags">{project.tags.join(' · ')}</span>
                )}
              </div>
              <div className="pv_row_image">
                {project.imageUrl
                  ? <img src={project.imageUrl} alt={project.title} />
                  : <div className="pv_row_placeholder" />
                }
              </div>
            </button>
          ))}
          <div className="pv_row_spacer" />
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
