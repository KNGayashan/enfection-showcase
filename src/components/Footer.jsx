import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTiktok } from 'react-icons/fa'

const FOOTER_LINKS = [
  { label: 'Work',     href: '#work' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact',  href: '#contact' },
]

const SOCIALS = [
  { icon: <FaFacebookF />,  href: '#', label: 'Facebook' },
  { icon: <FaLinkedinIn />, href: '#', label: 'LinkedIn' },
  { icon: <FaInstagram />,  href: '#', label: 'Instagram' },
  { icon: <FaTiktok />,     href: '#', label: 'TikTok' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer_main">

        <div className="footer_brand">
          <span className="footer_logo">EnfectionLabs</span>
          <p className="footer_tagline">Freedom to create.<br />Power to scale.</p>
        </div>

        <nav className="footer_nav">
          {FOOTER_LINKS.map(({ label, href }) => (
            <a key={label} href={href} className="footer_link">{label}</a>
          ))}
        </nav>

        <div className="footer_socials">
          {SOCIALS.map(({ icon, href, label }) => (
            <a key={label} href={href} aria-label={label} className="footer_social">{icon}</a>
          ))}
        </div>

      </div>

      <div className="footer_bottom">
        <span>© 2025 EnfectionLabs. All rights reserved.</span>
        <span className="footer_credit">Website made by KNGayasah</span>
      </div>
    </footer>
  )
}
