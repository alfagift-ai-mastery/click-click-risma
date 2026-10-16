import CtaFooter from '../components/landing/CtaFooter'
import FeatureCards from '../components/landing/FeatureCards'
import Hero from '../components/landing/Hero'
import Navbar from '../components/landing/Navbar'
import Steps from '../components/landing/Steps'

export default function LandingPage() {
  return (
    <div className="landing">
      <Navbar />
      <main>
        <Hero />
        <FeatureCards />
        <Steps />
        <CtaFooter />
      </main>
    </div>
  )
}
