import Breadcrumb from "@/components/template/Breadcrumb";
import ContactMain from "@/components/template/ContactMain";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AboutAreaOne from "@/components/template/AboutAreaOne";

export const metadata = {
  title: "Contact || AglieTech - IT Solutions & Technology NEXT JS Template",
  description:
    "Agiletech provide you to build the best agency, app, business, digital, it services, it solutions, network solution, startup, technology, technology company, technology service template.",
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
