import Breadcrumb from "@/components/template/Breadcrumb";
import ContactMain from "@/components/template/ContactMain";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AboutAreaOne from "@/components/template/AboutAreaOne";

export const metadata = {
  title:
    "Contact || Coastal PASS - High Tech Advantage With Old Fasioned Service",
  description:
    "Discover Coastal PASS, a leader in precision agriculture. We offer advanced equipment from top brands like New Holland, Raven, and PTX Trimble, along with innovative SaaS solutions for streamlined service and support. Enhance your farm's efficiency and sustainability with our cutting-edge technology and expert services.",
};

const page = () => {
  return (
    <>
      {/* Navigation Bar */}
      <Navbar />

      {/* Navigation Bar
      <Breadcrumb title={"Contact"} /> */}

      <AboutAreaOne />

      {/* Contact Main */}
      <ContactMain />

      {/* Footer One */}
      <Footer />
    </>
  );
};

export default page;
