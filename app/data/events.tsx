export type EventItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  organizer: string;
  modality: string;
  image: string;
};

export const categories = [
  "Académico",
  "Tecnología",
  "Cultura",
  "Deportes",
  "Investigación",
  "Danza",
];

export const events: EventItem[] = [
  {
    id: 1,
    title: "Feria Académica UNAH",
    category: "Académico",
    description:
      "Evento dirigido a estudiantes que desean conocer carreras, proyectos, laboratorios y actividades universitarias. Incluye recorridos, charlas cortas y espacios para resolver dudas con docentes y coordinadores.",
    date: "2026-02-10T09:00",
    endDate: "2026-02-11T15:00",
    location: "Ciudad Universitaria",
    organizer: "Vicerrectoría Académica",
    modality: "Presencial",
    image: "/eventos/feria.jpg",
  },
  {
    id: 2,
    title: "Conferencia de Tecnología",
    category: "Tecnología",
    description:
      "Charla sobre innovación, desarrollo web, herramientas digitales y buenas prácticas para proyectos universitarios. Se compartirán ejemplos sencillos de plataformas modernas y su aplicación en la vida académica.",
    date: "2026-01-15T14:00",
    endDate: "2026-01-17T16:00",
    location: "Auditorio Principal",
    organizer: "Facultad de Ingeniería",
    modality: "Presencial",
    image: "/eventos/tecnologia.jpg",
  },
  {
    id: 3,
    title: "Uso responsable de redes sociales",
    category: "Tecnología",
    description:
      "Actividad enfocada en el uso seguro y responsable de redes sociales. Se hablará sobre privacidad, reputación digital, manejo del tiempo y formas de evitar riesgos en espacios digitales.",
    date: "2026-04-20T10:00",
    endDate: "2026-04-21T12:00",
    location: "Edificio C3",
    organizer: "Dirección de Vida Estudiantil",
    modality: "Presencial",
    image: "/eventos/viral.jpg",
  },
  {
    id: 4,
    title: "Taller de Investigación Universitaria",
    category: "Investigación",
    description:
      "Taller práctico para estudiantes que desean mejorar la búsqueda de fuentes, el planteamiento del problema, la redacción de objetivos y la organización de un informe académico.",
    date: "2026-05-24T08:30",
    endDate: "2026-05-25T11:30",
    location: "Biblioteca Central",
    organizer: "Sistema Bibliotecario UNAH",
    modality: "Presencial",
    image: "/eventos/feria.jpg",
  },
  {
    id: 5,
    title: "Festival Cultural Universitario",
    category: "Cultura",
    description:
      "Espacio para presentaciones artísticas, música, danza y exposición de proyectos culturales realizados por estudiantes de diferentes carreras y centros regionales.",
    date: "2026-06-26T16:00",
    endDate: "2026-06-28T20:00",
    location: "Plaza Central UNAH",
    organizer: "Dirección de Cultura",
    modality: "Presencial",
    image: "/eventos/feria.jpg",
  },
  {
    id: 6,
    title: "Jornada Deportiva Puma",
    category: "Deportes",
    description:
      "Jornada recreativa con torneos cortos, actividades físicas y dinámicas para promover la integración estudiantil y los hábitos saludables dentro del campus.",
    date: "2026-07-02T07:00",
    endDate: "2026-07-03T12:00",
    location: "Complejo Deportivo UNAH",
    organizer: "Área de Deportes",
    modality: "Presencial",
    image: "/eventos/viral.jpg",
  },
];
