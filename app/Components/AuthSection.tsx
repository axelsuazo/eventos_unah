"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";

type RegisteredUser = {
  name: string;
  email: string;
};

const usersStorageKey = "unah-users";

function getRegisteredUsers() {
  if (typeof window === "undefined") return [] as RegisteredUser[];

  const savedUsers = localStorage.getItem(usersStorageKey);

  if (!savedUsers) return [] as RegisteredUser[];

  try {
    return JSON.parse(savedUsers) as RegisteredUser[];
  } catch {
    localStorage.removeItem(usersStorageKey);
    return [] as RegisteredUser[];
  }
}

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
      toast.error("Datos incompletos", {
        description: "Escribe el correo y la contraseña para continuar.",
      });
      return;
    }

    setLoginMessage("Datos recibidos. Este login queda como demostración visual.");
    toast.success("Ingreso recibido", {
      description: "El login queda como demostración visual del sistema.",
    });
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("registerName") || "").trim();
    const email = String(formData.get("registerEmail") || "").trim();
    const password = String(formData.get("registerPassword") || "").trim();

    if (!name || !email || !password) {
      setRegisterMessage("Completa todos los campos para crear la cuenta.");
      toast.error("Registro incompleto", {
        description: "Completa nombre, correo y contraseña.",
      });
      return;
    }

    const users = getRegisteredUsers();
    const userExists = users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!userExists) {
      const updatedUsers = [...users, { name, email }];
      localStorage.setItem(usersStorageKey, JSON.stringify(updatedUsers));
    }

    setRegisterMessage(
      userExists
        ? "Este correo ya estaba registrado para recibir notificaciones."
        : "Registro recibido. El usuario recibirá notificaciones de nuevos eventos."
    );

    toast.success(userExists ? "Usuario ya registrado" : "Usuario registrado", {
      description: userExists
        ? "El correo ya está guardado en el sistema."
        : "El correo quedó guardado para notificaciones de eventos.",
    });

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

       
      </div>
    </section>
  );
}