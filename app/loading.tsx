export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-10 w-72 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="rounded-xl bg-white p-4 shadow">
              <div className="mb-4 h-44 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
