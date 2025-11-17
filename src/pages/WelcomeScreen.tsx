import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="from-primary to-accent flex min-h-screen flex-col items-center justify-center bg-linear-to-br px-6 py-12">
      <div className="mb-12 text-center">
        <div className="text-primary-foreground animate-fade-in mb-4 text-6xl font-bold">
          UMKMGo
        </div>
        <p className="text-primary-foreground/90 mb-2 text-xl font-light">
          Solusi Digital untuk UMKM Indonesia
        </p>
        <p className="text-primary-foreground/70 text-sm">
          Raih peluang bisnis terbaik dengan teknologi modern
        </p>
      </div>

      <div className="mb-12 w-full max-w-md">
        <div className="flex h-48 items-center justify-center rounded-2xl bg-white/20 p-8 backdrop-blur-md">
          <div className="text-center">
            <div className="mb-4 text-6xl">🚀</div>
            <p className="text-primary-foreground/80 text-sm">
              Platform manajemen UMKM terpadu
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/login")}
        className="btn-primary text-primary hover:bg-primary-foreground mb-4 flex items-center justify-center gap-2 bg-white"
      >
        <span>Mulai Sekarang</span>
        <LogIn size={20} />
      </button>

      <p className="text-primary-foreground/70 text-center text-sm">
        Belum punya akun?{" "}
        <button
          onClick={() => navigate("/signup")}
          className="font-semibold text-white hover:underline"
        >
          Daftar di sini
        </button>
      </p>
    </div>
  );
}
