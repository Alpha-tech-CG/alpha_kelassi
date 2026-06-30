export default function DashboardLoading() {
  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-40 bg-gray-200 rounded-3xl" />

      {/* Shortcuts skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-56 bg-gray-100 rounded-2xl" />
        <div className="h-56 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  )
}
