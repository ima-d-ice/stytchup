export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[3/4] w-full bg-mist" />
          <div className="mt-3 h-2.5 w-2/3 bg-mist" />
          <div className="mt-2 h-2.5 w-1/3 bg-mist" />
        </div>
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-2.5 bg-mist" style={{ width: `${100 - index * 12}%` }} />
      ))}
    </div>
  );
}
