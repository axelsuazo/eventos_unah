"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import EventCard from "@/app/Components/EventCard";
import EventCarousel from "@/app/Components/EventCarousel";
import { toast } from "sonner";

import {
  categories,
  events as defaultEvents,
  type EventItem,
} from "@/app/data/events";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type EventForm = Omit<EventItem, "id">;

const storageKey = "unah-events";
const eventsPerPage = 3;

const emptyEvent: EventForm = {
  title: "",
  category: "Académico",
  description: "",
  date: "",
  endDate: "",
  location: "",
  organizer: "UNAH",
  modality: "Presencial",
  image: "/eventos/feria.jpg",
};

function formatDate(value: string) {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-HN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function isEndDateValid(startDate: string, endDate: string) {
  if (!startDate || !endDate) return true;
  return new Date(endDate).getTime() >= new Date(startDate).getTime();
}

export default function EventManager() {
  const [events, setEvents] = useState<EventItem[]>(defaultEvents);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [adminSearchText, setAdminSearchText] = useState("");
  const [adminCategory, setAdminCategory] = useState("Todas");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [form, setForm] = useState<EventForm>(emptyEvent);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    const savedEvents = localStorage.getItem(storageKey);
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error("Error loading events from storage:", error);
        localStorage.removeItem(storageKey);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify(events));
    }
  }, [events, isLoaded]);

  const filteredEvents = useMemo(() => {
    const text = searchText.trim().toLowerCase();

    return events.filter((eventItem) => {
      const isSameCategory =
        selectedCategory === "Todas" || eventItem.category === selectedCategory;

      const isSameSearch =
        text === "" ||
        eventItem.title.toLowerCase().includes(text) ||
        eventItem.description.toLowerCase().includes(text) ||
        eventItem.location.toLowerCase().includes(text) ||
        eventItem.organizer.toLowerCase().includes(text);

      return isSameCategory && isSameSearch;
    });
  }, [events, searchText, selectedCategory]);

  const filteredAdminEvents = useMemo(() => {
    const text = adminSearchText.trim().toLowerCase();

    return events.filter((eventItem) => {
      const isSameCategory =
        adminCategory === "Todas" || eventItem.category === adminCategory;

      const isSameSearch =
        text === "" ||
        eventItem.title.toLowerCase().includes(text) ||
        eventItem.description.toLowerCase().includes(text) ||
        eventItem.location.toLowerCase().includes(text) ||
        eventItem.organizer.toLowerCase().includes(text);

      return isSameCategory && isSameSearch;
    });
  }, [events, adminSearchText, adminCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / eventsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);
  const firstEventIndex = (safePage - 1) * eventsPerPage;

  const visibleEvents = filteredEvents.slice(
    firstEventIndex,
    firstEventIndex + eventsPerPage
  );

  function changeCategory(category: string) {
    setSelectedCategory(category);
    setCurrentPage(1);
  }

  function changeSearch(value: string) {
    setSearchText(value);
    setCurrentPage(1);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((currentForm) => ({
        ...currentForm,
        image: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  }

  function resetForm() {
    setForm(emptyEvent);
    setEditingId(null);
    setFormMessage("");
  }

  function validateForm() {
    if (!form.title.trim()) return "Escribe el nombre del evento.";
    if (!form.description.trim()) return "Escribe una descripción del evento.";
    if (!form.date) return "Selecciona la fecha de inicio.";
    if (!form.location.trim()) return "Escribe la ubicación del evento.";

    if (!isEndDateValid(form.date, form.endDate)) {
      return "La fecha final no puede ser menor que la fecha de inicio.";
    }

    return "";
  }



  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const error = validateForm();

    if (error) {
      setFormMessage(error);
      return;
    }

    if (editingId !== null) {
      setEvents((currentEvents) =>
        currentEvents.map((eventItem) =>
          eventItem.id === editingId ? { id: editingId, ...form } : eventItem
        )
      );

      toast.success("Evento actualizado", {
        description: `${form.title} fue modificado correctamente.`,
      });

      resetForm();
      return;
    }

    const newEvent: EventItem = {
      id: Date.now(),
      ...form,
    };

    setEvents((currentEvents) => [newEvent, ...currentEvents]);
    resetForm();
    setSelectedCategory("Todas");
    setCurrentPage(1);

    toast.success("Evento registrado", {
      description: `${newEvent.title} fue agregado correctamente.`,
    });

  }

  function handleEdit(eventItem: EventItem) {
    const { id, ...eventData } = eventItem;

    setEditingId(id);
    setForm(eventData);
    setFormMessage("");

    document
      .getElementById("admin-dashboard")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function handleDelete(id: number) {
    const deletedEvent = events.find((eventItem) => eventItem.id === id);

    setEvents((currentEvents) =>
      currentEvents.filter((eventItem) => eventItem.id !== id)
    );

    toast.success("Evento eliminado", {
      description: deletedEvent
        ? `${deletedEvent.title} fue eliminado correctamente.`
        : "El evento fue eliminado correctamente.",
    });

    if (editingId === id) resetForm();
  }

  return (
    <>
      <section
        id="eventos"
        className="relative overflow-hidden bg-gray-50 px-6 py-16 md:px-12"
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/eventos/footer-a.jpg')" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-[#183972]/10 px-4 py-2 text-sm font-bold text-[#183972]">
              Eventos
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#183972] md:text-4xl">
              Eventos disponibles para la comunidad universitaria
            </h2>

            <p className="mt-3 text-gray-600">
              Busca eventos, filtra por categoría y abre cada tarjeta para ver
              la información completa.
            </p>
          </div>

          <div className="mt-10 rounded-3xl bg-white p-5 shadow-md ring-1 ring-gray-200">
            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#183972]">
                  Buscar evento
                </span>

                <input
                  type="search"
                  value={searchText}
                  onChange={(event) => changeSearch(event.target.value)}
                  placeholder="Buscar por nombre, descripción, lugar u organizador..."
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#183972]">
                  Categoría
                </span>

                <select
                  value={selectedCategory}
                  onChange={(event) => changeCategory(event.target.value)}
                  className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10"
                >
                  <option>Todas</option>

                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {["Todas", ...categories].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => changeCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    selectedCategory === category
                      ? "bg-[#183972] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-[#183972]/10 hover:text-[#183972]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <EventCarousel events={filteredEvents} onOpen={setSelectedEvent} />

          <div className="mt-8 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Mostrando <strong>{visibleEvents.length}</strong> de{" "}
              <strong>{filteredEvents.length}</strong> eventos encontrados.
            </p>

            
          </div>

          {visibleEvents.length === 0 ? (
            <div className="mt-8 rounded-3xl border-2 border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
              <h3 className="text-xl font-bold text-[#183972]">
                No se encontraron eventos
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Prueba con otra palabra o selecciona una categoría diferente.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {visibleEvents.map((eventItem) => (
                <EventCard
                  key={eventItem.id}
                  event={eventItem}
                  onOpen={setSelectedEvent}
                />
              ))}
            </div>
          )}

          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
              className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-bold text-[#183972] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-full text-sm font-bold ${
                    safePage === page
                      ? "bg-[#183972] text-white"
                      : "bg-white text-[#183972] ring-1 ring-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
              className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-bold text-[#183972] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>

      <section id="admin-dashboard" className="bg-white px-6 py-16 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-[#183972]">
                Panel de administración
              </span>

              <h2 className="mt-4 text-3xl font-extrabold text-[#183972] md:text-4xl">
                Administración de eventos
              </h2>

              <p className="mt-3 max-w-2xl text-gray-600">
                Desde esta sección se pueden registrar, modificar y eliminar
                eventos. La información se guarda de forma local en el
                navegador.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-[#183972] px-5 py-4 text-white">
                <p className="text-2xl font-black">{events.length}</p>
                <p className="text-xs">Eventos</p>
              </div>

              <div className="rounded-2xl bg-[#f5c400] px-5 py-4 text-[#183972]">
                <p className="text-2xl font-black">{categories.length}</p>
                <p className="text-xs">Categorías</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-gray-50 p-6 shadow-md ring-1 ring-gray-200"
            >
              <div>
                <h3 className="text-2xl font-bold text-[#1F3A69]">
                  {editingId ? "Modificar evento" : "Crear nuevo evento"}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Completa los datos principales para que el evento aparezca en
                  la lista pública.
                </p>
              </div>

              {formMessage && (
                <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {formMessage}
                </p>
              )}

              <div className="mt-6 space-y-4">
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Nombre del evento"
                  className="block w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-3 shadow-sm outline-none focus:border-[#8c0327] focus:ring-2 focus:ring-[#8c0327]/20"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-3 shadow-sm outline-none focus:border-[#8c0327] focus:ring-2 focus:ring-[#8c0327]/20"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    name="modality"
                    value={form.modality}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-3 shadow-sm outline-none focus:border-[#8c0327] focus:ring-2 focus:ring-[#8c0327]/20"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Virtual">Virtual</option>
                  </select>
                </div>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descripción del evento"
                  className="block h-48 w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-3 shadow-sm outline-none focus:border-[#8c0327] focus:ring-2 focus:ring-[#8c0327]/20"
                />

                <div>
                  <label
                    htmlFor="image-upload"
                    className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-[#f6f6f6] hover:bg-gray-50"
                  >
                    <div className="text-center">
                      <span className="rounded-full bg-[#1F3A69] px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-500">
                        Subir foto
                      </span>

                      <p className="mt-3 text-gray-500">
                        o arrastra la imagen aquí
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        PNG, JPG, SVG
                      </p>
                    </div>
                  </label>

                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />

                  {form.image && (
                    <img
                      src={form.image}
                      alt="Vista previa del evento"
                      className="mt-3 h-auto w-full rounded-md object-cover"
                    />
                  )}
                </div>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Ubicación del evento"
                  className="block w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-3 shadow-sm outline-none focus:border-[#8c0327] focus:ring-2 focus:ring-[#8c0327]/20"
                />

                <input
                  type="text"
                  name="organizer"
                  value={form.organizer}
                  onChange={handleChange}
                  placeholder="Organizador"
                  className="block w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-3 shadow-sm outline-none focus:border-[#8c0327] focus:ring-2 focus:ring-[#8c0327]/20"
                />

                <label className="block text-sm font-bold text-blue-900">
                  Fecha y hora de inicio
                  <input
                    type="datetime-local"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-3 font-normal text-gray-700 shadow-sm outline-none focus:border-[#8c0327] focus:ring-2 focus:ring-[#8c0327]/20"
                  />
                </label>

                <label className="block text-sm font-bold text-blue-900">
                  Fecha y hora de finalización
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border border-gray-300 bg-[#f6f6f6] p-3 font-normal text-gray-700 shadow-sm outline-none focus:border-[#8c0327] focus:ring-2 focus:ring-[#8c0327]/20"
                  />
                </label>
              </div>

              <div className="mt-10 flex flex-col gap-3">
              <p className="text-center text-m text-gray-600">
                Al guardar, el evento se mostrará en la lista pública y administrativa. Desde la administración podrás modificarlo o eliminarlo cuando quieras.
              </p>
                <button
                  type="submit"
                  className="mt-10 block w-full rounded-full bg-[#1F3A69] px-4 py-3 font-bold text-white hover:bg-yellow-500"
                >
                  {editingId ? "Guardar cambios" : "Registrar nuevo evento"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="block w-full rounded-full border border-[#1F3A69] px-4 py-3 font-bold text-[#1F3A69] hover:bg-gray-100"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </form>

            <div className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-gray-200">
              <div className="border-b border-gray-200 bg-[#183972] px-6 py-5 text-white">
                <h3 className="text-2xl font-bold">Eventos registrados</h3>

                <p className="mt-1 text-sm text-blue-100">
                  Lista de eventos con opciones para modificar o eliminar.
                </p>
              </div>

              <div className="grid gap-4 border-b border-gray-200 p-5 md:grid-cols-[1fr_220px]">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#183972]">
                    Buscar en admin
                  </span>

                  <input
                    type="search"
                    value={adminSearchText}
                    onChange={(event) => setAdminSearchText(event.target.value)}
                    placeholder="Buscar por título, descripción, lugar u organizador..."
                    className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#183972]">
                    Filtrar categoría
                  </span>

                  <select
                    value={adminCategory}
                    onChange={(event) => setAdminCategory(event.target.value)}
                    className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#183972] focus:ring-4 focus:ring-[#183972]/10"
                  >
                    <option>Todas</option>

                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="border-b border-gray-100 px-5 py-3 text-sm text-gray-600">
                Mostrando <strong>{filteredAdminEvents.length}</strong> de{" "}
                <strong>{events.length}</strong> eventos en administración.
              </div>

              {filteredAdminEvents.length === 0 ? (
                <div className="p-8 text-center">
                  <h4 className="text-lg font-bold text-[#183972]">
                    No hay eventos con esos filtros
                  </h4>

                  <p className="mt-2 text-sm text-gray-600">
                    Prueba con otra palabra o selecciona otra categoría.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAdminEvents.map((eventItem) => (
                    <div key={eventItem.id} className="p-5">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <img
                            src={eventItem.image}
                            alt={eventItem.title}
                            className="h-32 w-full rounded-2xl object-cover sm:h-28 sm:w-36"
                          />

                          <div>
                            <div className="mb-2 flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#183972]/10 px-3 py-1 text-xs font-bold text-[#183972]">
                                {eventItem.category}
                              </span>

                              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-[#183972]">
                                {eventItem.modality}
                              </span>
                            </div>

                            <h4 className="text-lg font-extrabold text-[#183972]">
                              {eventItem.title}
                            </h4>

                            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                              {eventItem.description}
                            </p>

                            <div className="mt-3 grid gap-2 text-xs text-gray-600 md:grid-cols-2">
                              <p>
                                <strong>Inicio:</strong>{" "}
                                {formatDate(eventItem.date)}
                              </p>

                              <p>
                                <strong>Final:</strong>{" "}
                                {formatDate(eventItem.endDate)}
                              </p>

                              <p>
                                <strong>Lugar:</strong> {eventItem.location}
                              </p>

                              <p>
                                <strong>Organizador:</strong>{" "}
                                {eventItem.organizer}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:flex-col">
                          <button
                            type="button"
                            onClick={() => handleEdit(eventItem)}
                            className="rounded-full bg-[#183972] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#f5c400] hover:text-[#183972]"
                          >
                            Modificar
                          </button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                type="button"
                                className="rounded-full border border-red-500 px-5 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                              >
                                Eliminar
                              </button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Eliminar este evento?
                                </AlertDialogTitle>

                                <AlertDialogDescription>
                                  Esta acción eliminará el evento "
                                  {eventItem.title}" de la lista. No podrás
                                  recuperarlo después.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Cancelar
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  onClick={() => handleDelete(eventItem.id)}
                                  className="bg-red-600 text-white hover:bg-red-700"
                                >
                                  Sí, eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedEvent && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="h-64 w-full object-cover"
            />

            <div className="p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#183972]/10 px-3 py-1 text-xs font-bold text-[#183972]">
                  {selectedEvent.category}
                </span>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-[#183972]">
                  {selectedEvent.modality}
                </span>
              </div>

              <h3 className="text-3xl font-extrabold text-[#183972]">
                {selectedEvent.title}
              </h3>

              <p className="mt-4 text-base leading-7 text-gray-700">
                {selectedEvent.description}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-bold text-[#183972]">Inicio</p>

                  <p className="mt-1 text-sm text-gray-700">
                    {formatDate(selectedEvent.date)}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-bold text-[#183972]">
                    Finalización
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {formatDate(selectedEvent.endDate)}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-bold text-[#183972]">Lugar</p>

                  <p className="mt-1 text-sm text-gray-700">
                    {selectedEvent.location}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-bold text-[#183972]">
                    Organizador
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {selectedEvent.organizer}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm font-bold text-[#183972]">Categoría</p>

                  <p className="mt-1 text-sm text-gray-700">
                    {selectedEvent.category}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="mt-8 w-full rounded-full bg-[#183972] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#f5c400] hover:text-[#183972] md:w-auto"
              >
                Cerrar detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}