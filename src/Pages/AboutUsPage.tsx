import AboutUs from "@/components/AboutUs";
import WhyUs from "@/components/WhyUs";
import { Helmet } from "react-helmet-async";

function AboutUsPage() {
  return (
    <div>
      <Helmet>
        <title>Just Dive Scuba | PADI Dive Center in Murudeshwar</title>
        <meta name="description" content="Explore Netrani Island with Just Dive Scuba, Murudeshwar’s trusted PADI dive center for safe and exciting underwater adventures." />
        <meta name="keywords" content="Just Dive Scuba Diving" />
      </Helmet>
      <AboutUs />
      <WhyUs />
    </div>
  );
}

export default AboutUsPage;
