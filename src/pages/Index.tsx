import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VolumeAdvantage from "@/components/VolumeAdvantage";
import Process from "@/components/Process";
import OurWork from "@/components/OurWork";
import Services from "@/components/Services";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import FloatingChatButton from "@/components/FloatingChatButton";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <VolumeAdvantage />
      <Process />
      <OurWork />
      <Services />
      <CTA />
      <Footer />
      <FloatingChatButton />
    </main>
  );
};

export default Index;
