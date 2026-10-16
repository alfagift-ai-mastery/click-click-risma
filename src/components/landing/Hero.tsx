import LoginForm from '../LoginForm'

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-text">
        <h1 id="hero-title">Plan, track, and finish projects in one place</h1>
        <p className="hero-sub">
          RismaClick helps teams organize projects, follow tasks, and see progress at a glance.
        </p>
      </div>
      <div id="login" className="hero-form">
        <LoginForm />
      </div>
    </section>
  )
}
