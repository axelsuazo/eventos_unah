# Sistema de Gestión de Eventos UNAH

Este proyecto es un sistema web para la gestión y visualización de eventos de la Universidad Nacional Autónoma de Honduras. El sistema permite que los administradores gestionen eventos desde Payload CMS y que los usuarios públicos puedan visualizar los eventos disponibles desde el frontend.

El proyecto utiliza **Next.js**, **Tailwind CSS**, **Payload CMS** y **MongoDB Atlas**.

---

## Descripción del proyecto

El objetivo principal del sistema es mostrar eventos universitarios de forma pública, ordenada y atractiva, mientras que la administración de los eventos se realiza únicamente desde el panel administrativo de Payload CMS.

El frontend funciona como sitio público para los visitantes. Desde ahí se pueden consultar los eventos publicados, buscar eventos, aplicar filtros y abrir una tarjeta para ver la información completa del evento.

El backend está manejado con Payload CMS, donde el administrador puede crear, editar y eliminar eventos mediante un panel privado.

---

## Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Payload CMS
- MongoDB Atlas
- shadcn/ui
- Node.js
- npm

---

## Funcionalidades principales

### Frontend público

El frontend permite:

- Mostrar eventos publicados desde Payload CMS.
- Ver eventos en tarjetas.
- Abrir una tarjeta para ver la información completa.
- Mostrar imagen del evento en la tarjeta y en el detalle.
- Usar carrusel de eventos.
- Buscar eventos por texto.
- Filtrar eventos por:
  - Año
  - Mes
  - Semana
  - Día
  - Hora
  - Categoría
- Mostrar solo 6 tarjetas por página.
- Usar paginación para ver más eventos.
- Mostrar estados claros:
  - Cargando
  - Error
  - Sin eventos
  - Sin resultados por filtros

---

### Payload CMS

Desde Payload CMS se puede:

- Iniciar sesión como administrador.
- Crear eventos.
- Editar eventos.
- Eliminar eventos.
- Subir imágenes para los eventos.
- Gestionar usuarios según su rol.

---

## Roles del sistema

El sistema maneja los siguientes roles:

### Admin

El usuario con rol `admin` puede:

- Crear eventos.
- Editar eventos.
- Eliminar eventos.
- Subir imágenes.
- Crear nuevos administradores.
- Crear co-administradores.
- Gestionar usuarios.

### Co-admin

El usuario con rol `co-admin` puede:

- Crear eventos.
- Editar eventos.
- Eliminar eventos.
- Subir imágenes.

## Estructura del proyecto

```txt
proyecto/
├── app/
│   ├── (frontend)/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── (payload)/
│   │   ├── admin/
│   │   └── api/
│   ├── Components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── EventManager.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventCarousel.tsx
│   │   └── Footer.tsx
│   └── globals.css
│
├── collections/
│   ├── Events.ts
│   ├── Users.ts
│   └── Media.ts
│
├── features/
│   └── events/
│       ├── api.ts
│       ├── date.ts
│       └── types.ts
│
├── public/
├── payload.config.ts
├── next.config.ts
├── package.json
├── .env.example
└── README.md