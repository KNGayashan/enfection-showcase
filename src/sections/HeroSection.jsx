import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTiktok, FaGithub } from 'react-icons/fa'
import ParticleEffect from '../components/ParticleEffect'

const SOCIALS = [
  { icon: <FaFacebookF />,  href: 'https://www.facebook.com/share/1L9CDV4K74/', label: 'Facebook' },
  { icon: <FaLinkedinIn />, href: 'https://www.linkedin.com/showcase/enfection-labs/', label: 'LinkedIn' },
  { icon: <FaInstagram />,  href: 'https://www.instagram.com/getenfected?igsh=ZmQ1MGo0YmJvc3Mz', label: 'Instagram' },
  { icon: <FaTiktok />,     href: 'https://www.tiktok.com/@getenfected?_r=1&_t=ZS-9591qD0PKVh', label: 'TikTok' },
  { icon: <FaGithub />,     href: 'https://github.com/Enfection-Dev-Lab', label: 'GitHub' },
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
