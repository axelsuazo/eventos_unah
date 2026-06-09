# Eventos UNAH

Sistema web para la gestión y visualización de eventos de la Universidad Nacional Autónoma de Honduras.

El proyecto está separado en dos partes:

1. **CMS / Backend con Payload CMS**: permite administrar eventos, usuarios, roles e imágenes.
2. **Frontend público con Next.js**: permite mostrar, buscar y filtrar eventos publicados.


---

## Stack utilizado

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Payload CMS
- MongoDB
- Node.js
- npm

---

## Funcionalidades principales

### Frontend público

El frontend permite:

- Mostrar eventos publicados desde Payload CMS.
- Ver eventos en tarjetas.
- Abrir el detalle de cada evento.
- Mostrar imágenes de eventos.
- Buscar eventos por texto con un buscador simplificado.
- Mostrar el carrusel con descripción truncada y contador de caracteres.
- Mostrar paginación.
- Manejar estados de carga, error, vacío y sin resultados.

### Payload CMS

Desde Payload CMS se puede:

- Iniciar sesión como administrador.
- Crear eventos.
- Editar eventos.
- Eliminar eventos.
- Subir imágenes.
- Gestionar usuarios según rol.
- Consultar eventos públicos mediante endpoint protegido con JWT.
- Gestionar categorías dinámicas desde el CMS.

---

## Roles del sistema

### Admin

Tiene CRUD completo sobre eventos, medios y usuarios.

### Co-admin

Puede crear, editar y eliminar eventos y medios, pero no administra usuarios.

### Viewer / Público solo lectura

No administra el CMS. La lectura pública de eventos queda limitada a eventos publicados.

---

## Seguridad de lectura pública

La colección `events` ya no expone todos los registros al público.

La API pública solo devuelve eventos con:

```txt
published = true
```

Los roles `admin` y `co-admin` sí pueden ver todos los eventos desde el CMS.

---

## Endpoints administrativos agregados

### Métricas básicas

```txt
GET /api/dashboard-metrics
```

Devuelve:

- total de eventos
- eventos publicados
- eventos no publicados
- eventos próximos
- eventos pasados
- eventos por categoría
- próximos 5 eventos

Requiere usuario autenticado con rol `admin` o `co-admin`.

### Alertas

```txt
GET /api/alerts
```

Devuelve alertas sobre:

- eventos próximos en los siguientes 7 días
- eventos publicados sin imagen
- eventos guardados como no publicados

Requiere usuario autenticado con rol `admin` o `co-admin`.

---

## Configuración del CMS

Crear un archivo `.env.local` en la raíz del proyecto usando como base `.env.example`:



Instalar dependencias y ejecutar el CMS:

```bash
npm install
npm run dev
```

El CMS corre en:

```txt
http://localhost:3001/admin
```
