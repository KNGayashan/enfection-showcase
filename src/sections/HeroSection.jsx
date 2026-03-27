import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTiktok } from 'react-icons/fa'
import ParticleEffect from '../components/ParticleEffect'

const SOCIALS = [
  { icon: <FaFacebookF />,  href: '#', label: 'Facebook' },
  { icon: <FaLinkedinIn />, href: '#', label: 'LinkedIn' },
  { icon: <FaInstagram />,  href: '#', label: 'Instagram' },
  { icon: <FaTiktok />,     href: '#', label: 'TikTok' },
]

export default function HeroSection() {
  return (
    <section className="hero_section">
      <div className="hero_left">
        <h1 className="hero_heading">
          Freedom to<br />create.<br />Power to scale.
        </h1>
        <p className="hero_sub">
          We build digital products that grow with your vision.
        </p>
        <a href="#contact" className="hero_cta">Get in touch</a>
      </div>

      <div className="hero_right">
        <ParticleEffect />
      </div>

      <aside className="hero_socials">
        {SOCIALS.map(({ icon, href, label }) => (
          <a key={label} href={href} aria-label={label} className="hero_social_link">
            {icon}
          </a>
        ))}
      </aside>
    </section>
  )
}
