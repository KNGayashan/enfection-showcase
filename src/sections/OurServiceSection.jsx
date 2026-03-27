import teamImg    from '../assets/images/featured/webdev.png'
import blueImg    from '../assets/images/ourservice/blue.jpg'
import greenImg   from '../assets/images/ourservice/green.jpg'
import orangeImg  from '../assets/images/ourservice/orange.jpg'
import purpleImg  from '../assets/images/ourservice/purple.jpg'
import redImg     from '../assets/images/ourservice/red.jpg'
import yellowImg  from '../assets/images/ourservice/yellow.jpg'

const SERVICES = [
  { id: 'gamedev',     label: 'Game Development',   img: blueImg   },
  { id: 'uiux',        label: 'UI / UX Design',      img: orangeImg },
  { id: 'web',         label: 'Web Development',     img: greenImg  },
  { id: 'brand',       label: 'Brand & Identity',    img: purpleImg },
  { id: 'innovation',  label: 'Innovation & R&D',    img: redImg    },
  { id: 'mobile',      label: 'Mobile Development',  img: yellowImg },
]

export default function OurServiceSection() {
  const rows = []
  for (let i = 0; i < SERVICES.length; i += 2) {
    rows.push(SERVICES.slice(i, i + 2))
  }

  return (
    <section id="services" className="svc_section">
      <div className="svc_header">
        <h2 className="svc_title">
          Our{' '}
          <span className="svc_title_img_wrap">
            <img src={teamImg} alt="" className="svc_title_img" aria-hidden="true" />
          </span>
          {' '}Services
        </h2>
        
      </div>

      <hr className="svc_divider" />

      <div className="svc_list">
        {rows.map(pair => (
          <div key={pair.map(s => s.id).join('-')} className="svc_row">
            {pair.map(svc => (
              <div
                key={svc.id}
                className="svc_item"
                style={{ '--svc-bg': `url(${svc.img})` }}
              >
                <span className="svc_item_label">{svc.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
