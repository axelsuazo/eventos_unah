# Eventos UNAH

Este proyecto es una página web para mostrar y administrar eventos universitarios de la UNAH. La idea principal es que los usuarios puedan ver los eventos disponibles, buscar por nombre o información relacionada, filtrar por categoría y revisar los detalles de cada evento.

También cuenta con una sección administrativa donde se pueden agregar, modificar y eliminar eventos. En esta versión, los datos se guardan de forma local en el navegador usando `localStorage`, por lo que no se necesita una base de datos ni un backend para probar el funcionamiento.

---

## Tecnologías utilizadas

El proyecto fue desarrollado con:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- localStorage

Estas herramientas permiten crear una página moderna, ordenada y con componentes reutilizables.

---

## Funciones principales

El sistema permite realizar las siguientes acciones:

- Ver eventos universitarios.
- Buscar eventos por nombre, descripción, ubicación u organizador.
- Filtrar eventos por categoría.
- Ver la información completa de cada evento.
- Agregar nuevos eventos desde el panel administrativo.
- Modificar eventos existentes.
- Eliminar eventos con confirmación.
- Subir una imagen para cada evento.
- Guardar los cambios en el navegador.
- Usar formularios visuales de inicio de sesión y registro.

---

## Estructura del proyecto

La estructura principal del proyecto es la siguiente:

```txt
app/
├── Components/
│   ├── AuthSection.tsx
│   ├── EventCard.tsx
│   ├── EventManager.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── Navbar.tsx
│
├── data/
│   └── events.tsx
│
├── globals.css
├── layout.tsx
├── loading.tsx
└── page.tsx