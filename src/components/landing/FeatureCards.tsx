const FEATURES = [
  {
    title: 'Projects',
    description: 'Group work into projects and keep each one’s status clear.',
  },
  {
    title: 'Tasks',
    description: 'Break every project into tasks with priority and a clear owner.',
  },
  {
    title: 'Progress',
    description: 'See how far each project has come without asking for updates.',
  },
]

export default function FeatureCards() {
  return (
    <section className="section" aria-labelledby="features-title">
      <h2 id="features-title">Everything in one view</h2>
      <div className="cards">
        {FEATURES.map((feature) => (
          <article key={feature.title} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
