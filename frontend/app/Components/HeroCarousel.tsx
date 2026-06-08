"use client";

import { useEffect, useMemo, useState } from "react";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  image: string;
  imageAlt: string;
  cardEyebrow: string;
  cardTitle: string;
  cardDescription: string;
};

type HeroCarouselProps = {
  slides: HeroSlide[];
};

const AUTO_PLAY_TIME = 6000;

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const safeSlides = slides.length > 0 ? slides : [];
  const activeSlide = safeSlides[activeIndex] ?? safeSlides[0];

  const nextIndex = useMemo(() => {
    if (safeSlides.length <= 1) {
      return 0;
    }

    return activeIndex === safeSlides.length - 1 ? 0 : activeIndex + 1;
  }, [activeIndex, safeSlides.length]);

  useEffect(() => {
    if (!isPlaying || safeSlides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === safeSlides.length - 1 ? 0 : currentIndex + 1
      );
    }, AUTO_PLAY_TIME);

    return () => window.clearInterval(interval);
  }, [isPlaying, safeSlides.length]);

  if (!activeSlide) {
    return null;
  }

  function limitText(text: string, maxLength: number) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  function goToSlide(index: number) {
    setActiveIndex(index);
  }

  function goToNextSlide() {
    setActiveIndex((currentIndex) =>
      currentIndex === safeSlides.length - 1 ? 0 : currentIndex + 1
    );
  }

  function goToPreviousSlide() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? safeSlides.length - 1 : currentIndex - 1
    );
  }

  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden bg-[#183972] px-6 py-20 text-white dark:bg-slate-950 md:py-24"
    >
      <div className="absolute inset-0 -z-20">
        {safeSlides.map((slide, index) => (
          <img
            key={`background-${slide.id}`}
            src={slide.image}
            alt={slide.imageAlt}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out ${
              index === activeIndex
                ? "scale-100 opacity-100"
                : "scale-105 opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071225]/10 via-[#183972]/5 to-black/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative">
          <h1
            key={`title-${activeSlide.id}`}
            title={activeSlide.title}
            className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl animate-[heroFade_.65s_ease-in-out] overflow-hidden"
          >
            {limitText(activeSlide.title, 45)}
          </h1>

          <p
            key={`description-${activeSlide.id}`}
            title={activeSlide.description}
            className="mt-5 max-w-2xl text-base leading-7 text-blue-50 md:text-lg animate-[heroFade_.75s_ease-in-out] overflow-hidden"
          >
            {limitText(activeSlide.description, 150)}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={activeSlide.buttonHref}
              className="rounded-[0.5rem] bg-[#f5c400] px-6 py-3 text-center font-bold text-[#183972] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#ffd52e]"
            >
              {activeSlide.buttonText}
            </a>

            {safeSlides.length > 1 && (
              <button
                type="button"
                onClick={() => setIsPlaying((current) => !current)}
                className="rounded-[0.5rem] border border-white/25 bg-white/10 px-6 py-3 text-center font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                {isPlaying ? "Pausar carrusel" : "Reproducir carrusel"}
              </button>
            )}
          </div>

          {safeSlides.length > 1 && (
            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                onClick={goToPreviousSlide}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xl font-black text-white backdrop-blur transition hover:bg-white hover:text-[#183972]"
                aria-label="Diapositiva anterior"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={goToNextSlide}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xl font-black text-white backdrop-blur transition hover:bg-white hover:text-[#183972]"
                aria-label="Siguiente diapositiva"
              >
                ›
              </button>

              <div className="ml-2 flex items-center gap-2">
                {safeSlides.map((slide, index) => (
                  <button
                    key={`dot-${slide.id}`}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-8 bg-[#f5c400]"
                        : "w-2.5 bg-white/40 hover:bg-white"
                    }`}
                    aria-label={`Ir a la diapositiva ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

      
      </div>
    </section>
  );
}