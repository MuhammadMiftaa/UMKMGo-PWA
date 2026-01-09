export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="relative h-16 w-16">
          <div
            className="absolute h-full w-full animate-spin rounded-full border-[3px] border-gray-100/10 border-r-secondary border-b-secondary"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute h-full w-full animate-spin rounded-full border-[3px] border-gray-100/10 border-t-secondary"
            style={{ animationDuration: "2s", animationDirection: "reverse" }}
          />
        </div>
        <div className="absolute inset-0 animate-pulse rounded-full bg-linear-to-tr from-secondary/10 via-transparent to-secondary/5 blur-sm" />
      </div>
    </div>
  );
}
