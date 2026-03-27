import { useRef, useEffect } from 'react'

const PHRASE = 'Ready to build something amazing together ? '
const SEP    = ' ✦ '
const COPIES = 4

export default function ReadyTextSliderSection() {
  const sectionRef = useRef(null)
  const trackRef   = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current

    function onScroll() {
      const rect        = section.getBoundingClientRect()
      const vw          = window.innerWidth
      const phraseWidth = track.scrollWidth / COPIES

      // Animation starts when section top reaches 80% from the top of the viewport
      const scrolled = window.innerHeight * 0.8 - rect.top
      const progress = Math.max(0, Math.min(1, scrolled / rect.height))

      const txStart = vw
      const txEnd   = vw - phraseWidth

      track.style.transform = `translateX(${txStart + (txEnd - txStart) * progress}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="ready_section" ref={sectionRef}>
      <div className="ready_track_wrap">
        <div className="ready_track" ref={trackRef}>
          {Array.from({ length: COPIES }, (_, i) => (
            <span key={i} className="ready_phrase">
              {PHRASE}<span className="ready_sep">{SEP}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
