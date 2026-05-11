"use client";

import { type FormEvent, useState } from "react";

export default function AuthSection() {
  const [loginMessage, setLoginMessage] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("loginEmail") || "").trim();
    const password = String(formData.get("loginPassword") || "").trim();

    if (!email || !password) {
      setLoginMessage("Escribe el correo y la contraseña para continuar.");
      return;
    }

    setLoginMessage("Datos recibidos. Este login queda como demostración visual.");
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("registerName") || "").trim();
    const email = String(formData.get("registerEmail") || "").trim();
    const password = String(formData.get("registerPassword") || "").trim();

    if (!name || !email || !password) {
      setRegisterMessage("Completa todos los campos para crear la cuenta.");
      return;
    }

    setRegisterMessage("Registro recibido. La conexión con backend queda pendiente.");
    event.currentTarget.reset();
  }

  return (
    <section className="bg-gray-50 px-6 py-16 md:px-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div
          id="login"
          className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-gray-200"
        >
          <span className="rounded-full bg-[#183972]/10 px-4 py-2 text-sm font-bold text-[#183972]">
            Ingreso
          </span>

          <h2 className="mt-4 text-3xl font-extrabold text-[#183972]">
            Iniciar sesión
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Espacio preparado para que un usuario pueda entrar al sistema.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="email"
              name="loginEmail"
              placeholder="Correo institucional"
              className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10"
            />

            <input
              type="password"
              name="loginPassword"
              placeholder="Contraseña"
              className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10"
            />

            {loginMessage && (
              <p className="rounded-2xl bg-gray-100 px-4 py-3 text-sm font-semibold text-[#183972]">
                {loginMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-[#183972] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#f5c400] hover:text-[#183972]"
            >
              Entrar
            </button>
          </form>
        </div>

        <div id="register" className="rounded-3xl bg-[#183972] p-8 text-white shadow-md">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-yellow-200">
            Registro
          </span>

          <h2 className="mt-4 text-3xl font-extrabold">Crear cuenta</h2>

          <p className="mt-2 text-sm text-blue-100">
            Formulario inicial para registrar nuevos usuarios del sistema de
            eventos.
          </p>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <input
              type="text"
              name="registerName"
              placeholder="Nombre completo"
              className="w-full rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:ring-4 focus:ring-yellow-300/40"
            />

            <input
              type="email"
              name="registerEmail"
              placeholder="Correo institucional"
              className="w-full rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:ring-4 focus:ring-yellow-300/40"
            />

            <input
              type="password"
              name="registerPassword"
              placeholder="Contraseña"
              className="w-full rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:ring-4 focus:ring-yellow-300/40"
            />

            {registerMessage && (
              <p className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white">
                {registerMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-[#f5c400] px-5 py-3 text-sm font-bold text-[#183972] transition hover:bg-yellow-300"
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
