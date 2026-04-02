import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


const NAV_LINKS = [
  { label: 'Work',     href: '#work' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'About Us', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY

    function onScroll() {
      const currentY = window.scrollY
      setScrolled(currentY > 20)
      setHidden(currentY > lastY && currentY > 80)
      lastY = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${hidden ? 'navbar--hidden' : ''}`}>
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          {/* <img src={NavbarLogo} alt="navbar-logo" className="navbar-logo-img" /> */}
          EnfectionLabs
        </Link>

        {/* Desktop links */}
        <nav className="navbar-links">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="navbar-link">{label}</a>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="navbar-right">
          <a href="#contact" className="navbar-cta">Get in touch</a>
          <button
            className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-links">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="mobile-link" onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a href="#contact" className="navbar-cta mobile-cta" onClick={() => setMenuOpen(false)}>
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  )
}
