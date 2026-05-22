import EventManager from "@/app/Components/EventManager";
import Footer from "@/app/Components/Footer";
import Hero from "@/app/Components/Hero";
import Navbar from "@/app/Components/Navbar";
import type { EventItem } from "@/features/events/types";

type HomeClientProps = {
  initialEvents: EventItem[];
  initialLoadError?: string | null;
};

export default function HomeClient({
  initialEvents,
  initialLoadError = null,
}: HomeClientProps) {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <EventManager
          initialEvents={initialEvents}
          initialLoadError={initialLoadError}
        />
      </main>

      <Footer />
    </>
  );
}
