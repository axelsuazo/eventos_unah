export default function Hero() {
  return (
    <section id="inicio" className="bg-[#183972] px-6 py-20 text-white dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            Bienvenido al portal oficial de eventos de la UNAH
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-blue-50 md:text-lg">
            Aquí encontrarás una lista completa y actualizada de todos los eventos académicos,
            culturales, deportivos y administrativos que se realizan en
            nuestras instalaciones.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#eventos"
              className="rounded-md bg-[#f5c400] px-6 py-3 text-center font-bold text-[#183972] transition hover:bg-[#ffd52e]"
            >
              Ver eventos
            </a>
          </div>
        </div>

        <div className="rounded-3xl bg-white/10 p-4 shadow-2xl ring-1 ring-white/15">
          <img
            src="/eventos/feria.jpg"
            alt="Actividad académica universitaria"
            className="h-72 w-full rounded-2xl object-cover"
          />
          <div className="mt-4 rounded-2xl bg-white p-5 text-[#183972] dark:bg-slate-900 dark:text-slate-100">
            <p className="text-sm font-semibold text-gray-500 dark:text-slate-300">
              ¿Qué Harás Este Mes en la UNAH?
            </p>
            <h2 className="mt-1 text-xl font-bold">Explora la Agenda Completa</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              No te pierdas charlas, seminarios, actividades deportivas y culturales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
