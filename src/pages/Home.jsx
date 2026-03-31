import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import AdvantageSection from '../sections/AdvantageSection'
import DiscoverSection from '../sections/DiscoverSection'
import FeaturedWorksSection from '../sections/FeaturedWorksSection'
import HeroSection from '../sections/HeroSection'
import InfiniteMarque from '../sections/InfiniteMarque'
import JoinUsSection from '../sections/JoinUsSection'
import OurClientsSection from '../sections/OurClientsSection'
import OurServiceSection from '../sections/OurServiceSection'
import ProjectsGridSection from '../sections/ProjectsGridSection'
import ReadyTextSliderSection from '../sections/ReadyTextSliderSection'


export default function Home() {
  return (
    <>
    <Navbar />
    <main className="home">
      <HeroSection/>
      <InfiniteMarque/>
      <DiscoverSection/>
      <FeaturedWorksSection/>
      <ProjectsGridSection />
      <OurServiceSection/>
      <AdvantageSection/>
      <ReadyTextSliderSection/>
      <JoinUsSection/>
      <OurClientsSection/>
    </main>
    <Footer />
    </>
  )
}
