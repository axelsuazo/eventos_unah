import HomeClient from "@/app/Components/HomeClient";
import {
  getEventsResult,
} from "@/features/events/api";

export default async function HomePage() {
  const {
    events,
    error,
  } = await getEventsResult();

  return (
    <HomeClient
      initialEvents={events}
      initialLoadError={error}
    />
  );
}