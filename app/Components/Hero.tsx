export default function Hero() {
  return (
    <section id="inicio" className="bg-[#183972] px-6 py-20 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-yellow-200">
            Sistema de Gestión de Eventos UNAH
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            Consulta, filtra y administra eventos universitarios.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-blue-50 md:text-lg">
            Plataforma visual para que los usuarios públicos puedan encontrar eventos fácilmente y para que el administrador gestione la información desde un solo panel.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#eventos"
              className="rounded-full bg-[#f5c400] px-6 py-3 text-center font-bold text-[#183972] transition hover:bg-[#ffd52e]"
            >
              Ver eventos
            </a>
            <a
              href="#admin-dashboard"
              className="rounded-full border border-white/40 px-6 py-3 text-center font-bold text-white transition hover:bg-white/10"
            >
              Ir al dashboard
            </a>
          </div>
        </div>

        <div className="rounded-3xl bg-white/10 p-4 shadow-2xl ring-1 ring-white/15">
          <img
            src="/eventos/feria.jpg"
            alt="Actividad académica universitaria"
            className="h-72 w-full rounded-2xl object-cover"
          />
          <div className="mt-4 rounded-2xl bg-white p-5 text-[#183972]">
            <p className="text-sm font-semibold text-gray-500">Próximo evento</p>
            <h2 className="mt-1 text-xl font-bold">Feria Académica UNAH</h2>
            <p className="mt-2 text-sm text-gray-600">Ciudad Universitaria · 10 de junio de 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
}
