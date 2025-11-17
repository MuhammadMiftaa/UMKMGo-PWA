import PWABadge from "@/PWABadge";

export default function Home() {
  return (
    <div className="absolute inset-0 bg-white">
      <p className="font-manrope mt-10 text-center text-2xl text-cyan-400">
        Hello World
      </p>
      <PWABadge />
    </div>
  );
}
