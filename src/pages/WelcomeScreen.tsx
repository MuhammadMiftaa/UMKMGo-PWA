// src/pages/WelcomeScreen.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ArrowRight, Briefcase, TrendingUp, Award } from "lucide-react";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with subtle gradient */}
      <div className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-blue-50/30 px-6 py-16">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-md">
          {/* Logo */}
          <div className="mb-12 text-center">
            <div className="from-primary via-accent to-secondary mb-3 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br shadow-lg">
              <img
                className="h-16 w-16 brightness-10000"
                src="/logo.png"
                alt="UMKMGo Logo"
              />
            </div>
            <h1 className="from-primary via-accent to-secondary mt-6 bg-linear-to-r bg-clip-text text-5xl font-bold text-transparent">
              UMKMGo
            </h1>
            <p className="text-muted-foreground mt-3 text-lg font-medium">
              Solusi Digital untuk UMKM Indonesia
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mb-12 space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                <TrendingUp className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Kelola Usaha</h3>
                <p className="text-muted-foreground text-sm">
                  Pantau bisnis real-time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <div className="bg-accent/10 flex h-12 w-12 items-center justify-center rounded-xl">
                <Award className="text-accent h-6 w-6" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  Program Bantuan
                </h3>
                <p className="text-muted-foreground text-sm">
                  Akses pelatihan & pendanaan
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/login")}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              <span>Mulai Sekarang</span>
              <ArrowRight className="h-5 w-5" />
            </Button>

            <p className="text-muted-foreground text-center text-sm">
              Belum punya akun?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-primary font-semibold hover:underline"
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="border-border border-t bg-blue-50/30 px-6 py-8">
        <div className="mx-auto max-w-md text-center">
          <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
            Dipercaya oleh
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-primary text-2xl font-bold">10,000+</span>
            <span className="text-muted-foreground text-sm">
              UMKM se-Indonesia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
