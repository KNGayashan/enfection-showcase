import css3 from '../assets/images/marque/css3-line.png'
import html5 from '../assets/images/marque/html5-line.png'
import javascript from '../assets/images/marque/javascript-line.png'
import nextjs from '../assets/images/marque/nextjs-line.png'
import php from '../assets/images/marque/php-line.png'
import reactjs from '../assets/images/marque/reactjs-line.png'
import tailwind from '../assets/images/marque/tailwind-css-line.png'
import wordpress from '../assets/images/marque/wordpress-fill.png'

const LOGOS = [
  { src: html5,      alt: 'HTML5' },
  { src: css3,       alt: 'CSS3' },
  { src: javascript, alt: 'JavaScript' },
  { src: reactjs,    alt: 'React' },
  { src: nextjs,     alt: 'Next.js' },
  { src: tailwind,   alt: 'Tailwind CSS' },
  { src: php,        alt: 'PHP' },
  { src: wordpress,  alt: 'WordPress' },
]

export default function InfiniteMarque() {
  return (
    <section className="marque_section">
      <div className="marque_track">
        {/* 4 copies — ensures no gap regardless of viewport width */}
        {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map(({ src, alt }, i) => (
          <div key={`${alt}-${i}`} className="marque_item">
            <img src={src} alt={alt} />
          </div>
        ))}
      </div>

      <div className="marque_fade marque_fade--left" />
      <div className="marque_fade marque_fade--right" />
    </section>
  )
}
