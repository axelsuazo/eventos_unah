"use client";

import { useState } from "react";
import SwitchIconLabelDemo from "@/app/Components/switch/switch-10";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#inicio", label: "Inicio" },
    { href: "#eventos", label: "Eventos" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <a href="#inicio" className="flex items-center gap-3">
          <img src="/UNAH-escudo.png" alt="UNAH Logo" className="h-12 w-auto" />
          <div className="leading-tight">
           
          
          </div>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-7 text-sm font-bold text-gray-700 dark:text-slate-200">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition hover:text-[#183972] dark:hover:text-yellow-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>


          <SwitchIconLabelDemo />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-bold text-[#183972] dark:border-slate-700 dark:text-slate-100 md:hidden"
          aria-label="Abrir menú"
        >
          Menú
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-gray-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-bold text-gray-700 dark:text-slate-200">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-3 py-2 hover:bg-gray-100 hover:text-[#183972] dark:hover:bg-slate-800 dark:hover:text-yellow-300"
              >
                {link.label}
              </a>
            ))}


            <div>
              <SwitchIconLabelDemo />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
