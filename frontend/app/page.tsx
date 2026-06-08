import EventManager from "./Components/EventManager";
import { getEventsResult } from "@/features/events/api";

export default async function HomePage() {
  const { events, error } = await getEventsResult();

  return (
    <EventManager
      initialEvents={events}
      initialLoadError={error}
    />
  );
}