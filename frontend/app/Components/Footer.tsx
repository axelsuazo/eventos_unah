export default function Footer() {
  return (
    <footer
      className="bg-cover bg-right-bottom text-white"
      style={{ backgroundImage: "url('https://u2024.unah.edu.hn/assets/footer-b.jpg')" }}
    >
      <div className="bg-[#102652]/90">
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
         

          <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-5 md:text-left">
 <div className="mb-10 flex justify-center">
            <img
              src="https://www.unah.edu.hn/themes/portalunah-new/assets/images/logo-unah-blanco.png"
              alt="Escudo UNAH"
              className="h-28 w-auto object-contain"
            />
          </div>


            <div>
              <h2 className="mb-2 font-semibold text-white">  Universidad Nacional Autónoma de Honduras.</h2>
              <p className="text-sm leading-relaxed text-gray-400  font-regular">
                Última actualización: 26 May 2026, 09:11 am
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-semibold text-white">
                Sistema de Gestión de Eventos UNAH
              </h2>
              <p className="text-sm leading-relaxed text-gray-400">
                Desarrollado por la Dirección Ejecutiva de Gestión de Tecnología
                
              </p>
            </div>

            <div>
              <h2 className="mb-2  font-semibold text-white"> Derechos reservados DEGT 2026 </h2>
              <p className="text-sm text-white">
                

              </p>
              <p className="mt-2 text-sm text-gray-400">
               Implementación, soporte y mantenimiento: Dirección Ejecutiva de Gestión de Tecnología 
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-semibold text-white">Redes sociales</h2>
              <div className="flex justify-center gap-5 md:justify-start">
                <a href="https://x.com/UNAHoficial" aria-label="X" className=" text-white hover:text-yellow-400 ">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/unahoficial"
                  aria-label="Facebook"
                  className="text-white hover:text-yellow-400"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.25c-1.24 0-1.63.77-1.63 1.56v1.9h2.78l-.44 2.9h-2.34V22c4.78-.75 8.44-4.91 8.44-9.93z" />
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
              © 2026 Gestión de Eventos UNAH.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
