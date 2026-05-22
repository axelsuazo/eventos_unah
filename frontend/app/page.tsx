import HomeClient from "@/app/Components/HomeClient";
import { getEventsResult } from "@/features/events/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { events, error } = await getEventsResult();

  return <HomeClient initialEvents={events} initialLoadError={error} />;
}
