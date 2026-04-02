import { useRef, useEffect } from 'react'

const CARDS = [
  { id: 'fast',    icon: '⚡', title: 'Fast Delivery',            sub: 'We turn ideas into working products quickly without compromising quality.' },
  { id: 'ai',      icon: '🤖', title: 'AI-Driven Solutions',      sub: 'We integrate intelligence into systems to automate and optimize performance.' },
  { id: 'think',   icon: '🧠', title: 'Innovative Thinking',      sub: 'We go beyond standard solutions to build unique and future-ready products.' },
  { id: 'e2e',     icon: '🔧', title: 'End-to-End Development',   sub: 'From concept to deployment, we handle the entire development lifecycle.' },
  { id: 'scale',   icon: '🚀', title: 'Scalable Systems',         sub: 'Our solutions are built to grow with your business and user demand.' },
  { id: 'client',  icon: '🎯', title: 'Client-Focused Approach',  sub: 'We design solutions based on your goals, not just technical requirements.' },
  { id: 'secure',  icon: '🔒', title: 'Secure & Reliable',        sub: 'We ensure strong security, stability, and consistent performance.' },
  { id: 'exp',     icon: '🎮', title: 'Experience-Driven Builds', sub: 'We create engaging digital experiences, not just functional products.' },
  { id: 'modern',  icon: '🌐', title: 'Modern Technologies',      sub: 'We use cutting-edge tools and frameworks to stay ahead of the curve.' },
  { id: 'support', icon: '🛠️', title: 'Ongoing Support',          sub: 'We stay with you after launch to maintain and improve your product.' },
]

// Module-level helpers — kept outside component per ESLint convention

function stackRotate(i) {
  return (i % 2 === 0 ? -1 : 1) * (2 + i * 1.1)
}

function applyCardStyles(refs, scrolled, perCard) {
  refs.forEach((card, i) => {
    if (!card) return
    const progress = Math.max(0, Math.min(1, (scrolled - i * perCard) / perCard))
    const flyDir   = i % 2 === 0 ? -1 : 1
    card.style.transform = `translateY(${i * 7 + flyDir * progress * window.innerHeight * 1.3}px) rotate(${stackRotate(i) + flyDir * progress * 22}deg)`
    card.style.opacity   = String(Math.max(0, 1 - progress * 1.6))
    card.style.zIndex    = String(CARDS.length - i)
  })
}

export default function AdvantageSection() {
  const sectionRef = useRef(null)
  const cardRefs   = useRef([])

  useEffect(() => {
    const section = sectionRef.current

    function onScroll() {
      const rect       = section.getBoundingClientRect()
      const scrolled   = Math.max(0, -rect.top)
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) return
      applyCardStyles(cardRefs.current, scrolled, scrollable / CARDS.length)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="about" className="adv_section" ref={sectionRef}>
      <div className="adv_sticky">
        <span className="adv_eyebrow">Why EnfectionLabs</span>
        <h2 className="adv_heading">Our Advantages</h2>

        <div className="adv_stack">
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={el => { cardRefs.current[i] = el }}
              className={`adv_card ${i % 2 === 0 ? 'adv_card--dark' : 'adv_card--glass'}`}
            >
              {/* <span className="adv_card_num">{String(i + 1).padStart(2, '0')}</span> */}
              <span className="adv_card_icon">{card.icon}</span>
              <h3 className="adv_card_title">{card.title}</h3>
              <p className="adv_card_sub">{card.sub}</p>
            </div>
          ))}
        </div>

        <p className="adv_hint">scroll to explore</p>
      </div>
    </section>
  )
}
