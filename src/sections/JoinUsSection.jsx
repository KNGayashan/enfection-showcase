const TO = 'nilanga18@gmail.com'

function handleContactSubmit(e) {
  e.preventDefault()
  const d       = new FormData(e.target)
  const name    = d.get('name')
  const email   = d.get('email')
  const subject = d.get('subject') || 'Project Inquiry'
  const message = d.get('message')
  const body    = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  e.target.reset()
}

export default function JoinUsSection() {
  return (
    <section id="contact" className="joinus_section">
      <div className="joinus_contact">
        <div className="joinus_contact_info">
          <h2 className="joinus_contact_title">Contact Us</h2>
          <p className="joinus_contact_sub">
            Have an idea or project in mind? Let&apos;s discuss how we can bring it to life.
          </p>
        </div>

        <form className="joinus_form" onSubmit={handleContactSubmit}>
          <div className="joinus_form_row">
            <div className="joinus_field">
              <label className="joinus_label" htmlFor="jf_name">Name</label>
              <input id="jf_name" name="name" className="joinus_input" type="text" placeholder="Your name" required />
            </div>
            <div className="joinus_field">
              <label className="joinus_label" htmlFor="jf_email">Email</label>
              <input id="jf_email" name="email" className="joinus_input" type="email" placeholder="your@email.com" required />
            </div>
          </div>
          <div className="joinus_field">
            <label className="joinus_label" htmlFor="jf_subject">Subject</label>
            <input id="jf_subject" name="subject" className="joinus_input" type="text" placeholder="Project subject" />
          </div>
          <div className="joinus_field">
            <label className="joinus_label" htmlFor="jf_message">Message</label>
            <textarea id="jf_message" name="message" className="joinus_input joinus_textarea" placeholder="Tell us about your project..." rows={5} required />
          </div>
          <button type="submit" className="joinus_submit">Send Message →</button>
        </form>
      </div>
    </section>
  )
}
