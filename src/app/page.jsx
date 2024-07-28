import HeroBanner from "@/components/HeroBanner";
import BlogAreaEight from "@/components/template/BlogAreaEight";
import ContactAreaSix from "@/components/template/ContactAreaSix";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProjectAreaThree from "@/components/template/ProjectAreaThree";
import ServiceArea from "@/components/ServiceArea";
import SolutionOne from "@/components/template/SolutionOne";
import TeamAreaFive from "@/components/template/TeamAreaFive";
import TestimonialSeven from "@/components/template/TestimonialSeven";
import WhyChoose from "@/components/WhyChoose";
import WorkProcessSeven from "@/components/template/WorkProcessSeven";

export const metadata = {
  title: "Home || Coastal PASS - High Tech Advantage With Old Fasioned Service",
  description:
    "Discover Coastal PASS, a leader in precision agriculture. We offer advanced equipment from top brands like New Holland, Raven, and PTX Trimble, along with innovative SaaS solutions for streamlined service and support. Enhance your farm's efficiency and sustainability with our cutting-edge technology and expert services.",
};

const page = () => {
  return (
    <>
      {/* Navigation Bar */}
      <Navbar />

      {/* Banner Eight */}
      <HeroBanner />

      {/* Service Area */}
      <ServiceArea />

      {/* Why Choose */}
      <WhyChoose />

      {/* Project Area Three */}
      {/* <ProjectAreaThree /> */}

      {/* ContactAreaSix */}
      {/* <ContactAreaSix /> */}

      {/* TestimonialSeven */}
      <TestimonialSeven />

      {/* BlogAreaEight */}
      {/* <BlogAreaEight /> */}

      {/* TeamAreaFive */}
      {/* <TeamAreaFive /> */}

      {/* FooterSeven */}
      <Footer />
    </>
  );
};

export default page;
