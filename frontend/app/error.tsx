"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 dark:bg-slate-950">
      <div className="max-w-lg rounded-3xl bg-white p-8 text-center shadow-md ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-slate-700">
        <h2 className="text-2xl font-extrabold text-[#183972] dark:text-slate-100">
          No se pudieron cargar los eventos
        </h2>

        <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">
          Verifique que el CMS Payload esté activo y que la API de eventos responda correctamente.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-[#183972] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#f5c400] hover:text-[#183972]"
        >
          Intentar de nuevo
        </button>
      </div>
    </main>
  );
}
