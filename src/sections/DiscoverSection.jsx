import gamepad from '../assets/images/discover/gamepad-fill.png'
import global from '../assets/images/discover/global-line.png'
import lightbulb from '../assets/images/discover/lightbulb-ai-line.png'

const THUMB_IMAGES = [
  { id: 'gamepad-1', src: gamepad },
  { id: 'global-1',  src: global },
  { id: 'bulb-1',    src: lightbulb },
  { id: 'gamepad-2', src: gamepad },
  { id: 'global-2',  src: global },
  { id: 'bulb-2',    src: lightbulb },
  { id: 'gamepad-3', src: gamepad },
  { id: 'global-3',  src: global },
  { id: 'bulb-3',    src: lightbulb },
]

export default function DiscoverSection() {
  return (
    <section className="discover_section">

      <p className="discover_tagline">
        A global team of design-first developers engineering
        seamless digital experiences &amp; scalable solutions
        for both startups and enterprises.
      </p>

      <div className="discover_right">
        <h2 className="discover_heading">
          Driving Results<br />
          &amp; Discovery
          <span className="discover_thumb" aria-hidden="true">
            <span className="discover_thumb_track">
              {/* Triple for seamless vertical loop */}
              {THUMB_IMAGES.map(({ id, src }) => (
                <img key={id} src={src} alt="" className="discover_thumb_img" />
              ))}
            </span>
          </span>
        </h2>

        <div className="discover_actions">
          <a href="#about" className="discover_btn discover_btn--filled">
            Our Story <span>↗</span>
          </a>
          <a href="#services" className="discover_btn">
            Our Services <span>↗</span>
          </a>
        </div>
      </div>

    </section>
  )
}
