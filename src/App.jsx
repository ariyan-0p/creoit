import './App.css'
import Shader from './components/Shader'
import { LensFilterDefs } from './components/Glass'
import HeroVideo from './sections/HeroVideo'
import {
  Services,
  Process,
  Work,
  Testimonials,
  ContactCTA,
  Footer,
} from './sections/Sections'

export default function App() {
  return (
    <>
      <LensFilterDefs />

      {/* Hero is self-contained: video background + navbar + marquee */}
      <HeroVideo />

      {/* Below the fold: keep the fluid-metal shader as ambient bg for the rest */}
      <div className="below-hero">
        <Shader />
        <div className="grain" aria-hidden />
        <main>
          <Services />
          <Process />
          <Work />
          <Testimonials />
          <ContactCTA />
        </main>
        <Footer />
      </div>
    </>
  )
}
