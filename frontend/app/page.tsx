import EventManager from './Components/EventManager';
import { getEventsResult } from '@/features/events/api';

/**
 * Página principal del frontend que muestra la lista de eventos.
 * Carga los eventos iniciales desde la API de Payload CMS.
 */
export default async function HomePage() {
  const { events, error } = await getEventsResult();

  return (
    <EventManager initialEvents={events} initialLoadError={error} />
  );
}