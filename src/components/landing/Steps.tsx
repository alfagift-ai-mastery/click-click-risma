const STEPS = [
  'Create a project',
  'Add tasks',
  'Set priorities',
  'Track progress on your dashboard',
]

export default function Steps() {
  return (
    <section className="section" aria-labelledby="steps-title">
      <h2 id="steps-title">How it works</h2>
      <ol className="steps">
        {STEPS.map((step, index) => (
          <li key={step}>
            <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
