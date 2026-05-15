"use client";

import { useState } from "react";
import SwitchIconLabelDemo from "@/app/Components/switch/switch-10";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#eventos", label: "Eventos" },
  { href: "#admin-dashboard", label: "Admin" },
  
];
      
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <a href="#inicio" className="flex items-center gap-3">
          <img src="/UNAH-escudo.png" alt="UNAH Logo" className="h-12 w-auto" />
          <div className="leading-tight">
           <h1 className="text-lg font-black text-[#183972]">Eventos Universitarios</h1>
          </div>
        </a>

        <ul className="hidden items-center gap-7 text-sm font-bold text-gray-700 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}><a href={link.href} className="transition hover:text-[#183972]">{link.label}</a></li>
          ))}
        </ul>

         
        
        <div className="hidden items-center md:flex gap-4">
          <a href="#login" className="rounded-full border border-[#183972] px-4 py-2 text-sm font-bold text-[#183972] transition hover:bg-[#183972] hover:text-white">Login
            
          </a>
          <div className=" hidden md:block " >
          <SwitchIconLabelDemo />

        </div>
        </div>


        <button type="button" onClick={() => setIsOpen((current) => !current)} className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-bold text-[#183972] md:hidden" aria-label="Abrir menú">
          Menú
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-gray-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-bold text-gray-700">
            {[...navLinks, { href: "#login", label: "Login" }, ].map((link) => (
              <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="rounded-xl px-3 py-2 hover:bg-gray-100 hover:text-[#183972]">
                {link.label}
              </a>
            ))}
              <div className="rounded-xl px-3 py-2 hover:bg-gray-100 hover:text-[#183972] " >
          <SwitchIconLabelDemo />
        </div>
          </div>

          
        </div>
      
      )}
    </header>
  );
}
