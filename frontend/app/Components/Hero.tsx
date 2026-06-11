import { getEventsResult } from "@/features/events/api";
import { getImageUrl, getModalityLabel } from "@/features/events/types";
import HeroCarousel, { type HeroSlide } from "@/app/Components/HeroCarousel";

const FALLBACK_SLIDE: HeroSlide = {
  id: "hero-static",
  title: "Bienvenidos al portal oficial de eventos UNAH",
  subtitle: "Portal de eventos universitarios",
  description:
    "Aquí encontrarás una lista completa y actualizada de todos los eventos académicos, culturales y deportivos...",
  buttonText: "Ver eventos",
  buttonHref: "#eventos",
  image: "/eventos/feria.jpg",
  imageAlt: "Actividad académica universitaria",
  cardEyebrow: "¿Qué Haremos este Mes en la UNAH?",
  cardTitle: "Explora la Agenda Completa",
  cardDescription:
    "No te pierdas charlas, seminarios, actividades deportivas y culturales.",
};

export default async function Hero() {
  const { events } = await getEventsResult();

  const now = Date.now();
  // Ordenamos los eventos antes de seleccionar los 6 que aparecerán en el carrusel
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    const isPastA = timeA < now;
    const isPastB = timeB < now;

    if (isPastA !== isPastB) return isPastA ? 1 : -1;
    return timeA - timeB;
  });

  const apiSlides: HeroSlide[] = sortedEvents.slice(0, 6).map((event) => ({
    id: event.id,
    title: event.title,
    subtitle: event.category || "Evento UNAH",
    description:
      event.description ||
      "Consulta los detalles de este evento disponible para la comunidad universitaria.",
    buttonText: "Ver eventos",
    buttonHref: "#eventos",
    image: getImageUrl(event.image),
    imageAlt: event.title,
    cardEyebrow: getModalityLabel(event.modality),
    cardTitle: event.location || "Evento universitario",
    cardDescription: event.organizer
      ? `Organizado por ${event.organizer}`
      : "Actividad disponible para la comunidad universitaria.",
  }));

  const slides =
    apiSlides.length > 0 ? [FALLBACK_SLIDE, ...apiSlides] : [FALLBACK_SLIDE];

  return <HeroCarousel slides={slides} />;
}