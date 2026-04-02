import logo1  from '../assets/images/ourclients/logo1.png'
import logo2  from '../assets/images/ourclients/logo2.png'
import logo3  from '../assets/images/ourclients/logo3.png'
import logo4  from '../assets/images/ourclients/logo4.png'
import logo5  from '../assets/images/ourclients/logo5.png'
import logo6  from '../assets/images/ourclients/logo6.png'
import logo7  from '../assets/images/ourclients/logo7.png'
import logo8  from '../assets/images/ourclients/logo8.png'
import logo9  from '../assets/images/ourclients/logo9.png'
import logo10 from '../assets/images/ourclients/logo10.png'
import logo11 from '../assets/images/ourclients/logo11.png'
import logo12 from '../assets/images/ourclients/logo12.png'

const ROW1 = [logo1, logo2, logo3, logo4, logo5, logo6]
const ROW2 = [logo7, logo8, logo9, logo10, logo11, logo12]

// 4 copies so the track always overflows the viewport — animates exactly -25% (one full set)
const SET = 4

export default function OurClientsSection() {
  return (
    <section className="clients_section">
      <p className="clients_eyebrow">Trusted By</p>
      <h2 className="clients_heading">Our Clients</h2>

      <div className="clients_rows">
        {/* Row 1 — scrolls left */}
        <div className="clients_row_wrap">
          <div className="clients_track clients_track--left">
            {Array.from({ length: SET }, (_, s) =>
              ROW1.map((src, i) => (
                <div key={`r1-${s}-${i}`} className="clients_item">
                  <img src={src} alt={`Client ${i + 1}`} />
                </div>
              ))
            )}
          </div>
          <div className="clients_fade clients_fade--left" />
          <div className="clients_fade clients_fade--right" />
        </div>

        {/* Row 2 — scrolls right */}
        <div className="clients_row_wrap">
          <div className="clients_track clients_track--right">
            {Array.from({ length: SET }, (_, s) =>
              ROW2.map((src, i) => (
                <div key={`r2-${s}-${i}`} className="clients_item">
                  <img src={src} alt={`Client ${i + 7}`} />
                </div>
              ))
            )}
          </div>
          <div className="clients_fade clients_fade--left" />
          <div className="clients_fade clients_fade--right" />
        </div>
      </div>
    </section>
  )
}
