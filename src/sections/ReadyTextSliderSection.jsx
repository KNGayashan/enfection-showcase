import { useRef, useLayoutEffect } from 'react'

const PHRASE = 'Ready to build something amazing together ? ✦ '

const allChars = Array.from(PHRASE).map((ch, i) => ({ ch, id: `c${i}` }))
const numChars = allChars.length

function makePath(vw) {
  const mobile  = vw < 768
  const sx      = vw * 4        // far off-screen right — ensures all chars hidden at start
  const ex      = -400
  const flatY   = mobile ? 80  : 170
  const lowY    = mobile ? 40  : 100
  const highY   = mobile ? 120 : 240
  const wStart  = vw * 1.19
  const wMid    = vw * 1.01
  const wEnd    = vw * 0.84
  const wSettle = vw * 0.73

  return [
    `M${sx},${flatY}`,
    `L${wStart},${flatY}`,
    `C${vw * 1.12},${flatY} ${vw * 1.09},${lowY}  ${wMid},${lowY}`,
    `C${vw * 0.93},${lowY}  ${vw * 0.89},${highY} ${wEnd},${highY}`,
    `C${vw * 0.79},${highY} ${wSettle},${highY}   ${wSettle},${highY}`,
    `L${ex},${highY}`,
  ].join(' ')
}

export default function ReadyTextSliderSection() {
  const sectionRef = useRef(null)
  const charsRef   = useRef([])
  const svgPathRef = useRef(null)
  const pathLenRef = useRef(1)

  useLayoutEffect(() => {
    const section = sectionRef.current

    // progress=0 when section top reaches 50% of viewport height
    // progress=1 when section centre reaches viewport top
    function getProgress() {
      const rect     = section.getBoundingClientRect()
      const ih       = window.innerHeight
      const scrolled = ih * 0.5 - rect.top
      const total    = ih * 0.5 + rect.height / 2
      return Math.max(0, Math.min(1, scrolled / total))
    }

    function applyDistances(progress) {
      const eased       = 1 - Math.pow(1 - progress, 2.5)
      const vw          = window.innerWidth
      const pathLen     = pathLenRef.current
      const sx          = vw * 4
      // charSpacing scales with vw so phrase always fits off-screen on any device
      const charSpacing = vw * 0.06
      const spacingPct  = charSpacing / pathLen * 100
      // At eased=1: last char lands at ~70% of viewport width from left (visibly on screen)
      const maxBase     = (sx - vw * 0.7) / pathLen * 100
      const baseDist    = eased * maxBase

      charsRef.current.forEach((el, i) => {
        if (!el) return
        // char[0]='R' leads left (highest dist), char[last] trails right (= baseDist)
        const dist = baseDist + (numChars - 1 - i) * spacingPct
        el.style.setProperty('offset-distance', `${Math.max(0, Math.min(100, dist))}%`)
      })
    }

    function setupPath() {
      const d = makePath(window.innerWidth)
      if (svgPathRef.current) {
        svgPathRef.current.setAttribute('d', d)
        pathLenRef.current = svgPathRef.current.getTotalLength()
      }
      charsRef.current.forEach(el => {
        if (el) el.style.setProperty('offset-path', `path("${d}")`)
      })
      applyDistances(getProgress())
    }

    setupPath()
    window.addEventListener('resize', setupPath)
    window.addEventListener('scroll', () => applyDistances(getProgress()), { passive: true })
    return () => {
      window.removeEventListener('resize', setupPath)
      window.removeEventListener('scroll', () => applyDistances(getProgress()))
    }
  }, [])

  return (
    <section className="ready_section" ref={sectionRef}>
      <svg className="ready_svg_def" aria-hidden="true">
        <path ref={svgPathRef} />
      </svg>
      <div className="ready_stage">
        {allChars.map(({ ch, id }, i) => {
          const isSpace  = ch === ' '
          const isAccent = ch === '✦'
          const cls = [
            'ready_char',
            isSpace  ? 'ready_char--space'  : '',
            isAccent ? 'ready_char--accent' : '',
          ].filter(Boolean).join(' ')
          return (
            <span
              key={id}
              className={cls}
              ref={el => { charsRef.current[i] = el }}
            >
              {isSpace ? '\u00A0' : ch}
            </span>
          )
        })}
      </div>
    </section>
  )
}
