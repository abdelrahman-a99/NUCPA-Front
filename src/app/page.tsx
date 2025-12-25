import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Details from "@/components/sections/Details";
import Timeline from "@/components/sections/Timeline";
import Awards from "@/components/sections/Awards";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Details />
        <Timeline />
        <Awards />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
