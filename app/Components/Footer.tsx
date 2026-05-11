export default function Footer() {
  return (
    <footer
      className="bg-cover bg-right-bottom text-white"
      style={{ backgroundImage: "url('https://u2024.unah.edu.hn/assets/footer-b.jpg')" }}
    >
      <div className="bg-[#102652]/90">
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 flex justify-center">
            <img
              src="/UNAH-version-horizontal.png"
              alt="Escudo UNAH"
              className="h-28 w-auto object-contain"
            />
          </div>

          <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-4 md:text-left">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">UNAH</h2>
              <p className="text-sm leading-relaxed text-white">
                Universidad Nacional Autónoma de Honduras.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">
                Sistema de Gestión de Eventos UNAH
              </h2>
              <p className="text-sm leading-relaxed text-white">
                Proyecto desarrollado para la gestión y visualización de eventos universitarios.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-white">Información</h2>
              <p className="text-sm text-white">
                © 2026 Sistema de Gestión de Eventos UNAH.
              </p>
              <p className="mt-2 text-sm text-white">
                proyecto académico para la gestión de eventos.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-semibold text-white">Redes sociales</h2>
              <div className="flex justify-center gap-5 md:justify-start">
                <a href="https://x.com/UNAHoficial" aria-label="X" className="text-white hover:text-yellow-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>

                <a href="https://www.linkedin.com/school/unahoficial" aria-label="LinkedIn" className="text-white hover:text-yellow-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>

                <a href="https://www.youtube.com/@UNAHOficial" aria-label="YouTube" className="text-white hover:text-yellow-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                </a>

                <a href="https://www.instagram.com/unahoficial/" aria-label="Instagram" className="text-white hover:text-yellow-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/30 pt-6 text-center">
            <p className="text-sm text-yellow-300">
              © 2026 Sistema de Gestión de Eventos UNAH. Proyecto académico.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
