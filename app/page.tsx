import Navbar from "@/app/Components/Navbar";
import Hero from "@/app/Components/Hero";
import EventManager from "@/app/Components/EventManager";
import AuthSection from "@/app/Components/AuthSection";
import Footer from "@/app/Components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <EventManager />
        <AuthSection />
      </main>
      <Footer />
    </>
  );
}
