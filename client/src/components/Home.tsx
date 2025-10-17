import DocumentTitle from "./DocumentTitle";
import ExperienceCarousel from "./home/ExperienceCarousel";
import ExploreDestination from "./home/ExploreDestination";
import GallerySection from "./home/GallerySection";
import Hero from "./home/Hero";
import JkTourismBanner from "./home/JkTourismBanner";
import ReviewSlider from "./home/ReviewSlider";
import SocialMediaBanner from "./home/SocialMediaBanner";
import UpcomingEvents from "./home/UpcomingEvents";

const HeroCarousel = () => {

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <DocumentTitle title="Home" />
        <Hero />
        <ExploreDestination />
        <UpcomingEvents />
        <ExperienceCarousel />
        <GallerySection />
        <JkTourismBanner />
        <ReviewSlider />
        <SocialMediaBanner />
      </div>
    </>
  );
};

export default HeroCarousel;
