// src/pages/SignUpScreen.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function SignUpScreen() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email || !phone) {
        setError("Semua field harus diisi");
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Format email tidak valid");
        setLoading(false);
        return;
      }

      // Phone validation (must be numbers)
      if (!/^\d+$/.test(phone)) {
        setError("Nomor telepon hanya boleh berisi angka");
        setLoading(false);
        return;
      }

      const result = await register({ email, phone });

      if (result.success) {
        navigate("/verify-otp", { state: { phone, mode: "signup" } });
      } else {
        setError(result.message || "Gagal mendaftar. Coba lagi.");
      }
    } catch (err) {
      setError("Gagal mendaftar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header with gradient */}
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Daftar Akun</h1>
          <p className="mt-2 text-white/80">Bergabung dengan UMKMGo</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-1 flex-col px-6 py-8">
        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-xl border px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
            />
            <p className="text-muted-foreground text-xs">
              Email akan digunakan untuk notifikasi penting
            </p>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor WhatsApp</Label>
            <div className="flex gap-2">
              <div className="border-border bg-muted text-muted-foreground flex h-12 items-center rounded-xl border-2 px-4 font-semibold">
                +62
              </div>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="812345678"
                className="flex-1"
                maxLength={12}
              />
            </div>
            <p className="text-muted-foreground text-xs">
              Verifikasi akan dikirim via WhatsApp. Password akan dibuat setelah verifikasi OTP.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            variant="gradient"
            size="lg"
            className="mt-8 w-full"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                <span>Daftar Sekarang</span>
              </>
            )}
          </Button>
        </form>

        <div className="flex-1" />

        {/* Login Link */}
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-center">
          <p className="text-muted-foreground text-sm">
            Sudah punya akun UMKMGo?
          </p>
          <button
            onClick={() => navigate("/login")}
            className="text-primary mt-2 font-semibold hover:underline"
          >
            Masuk Sekarang →
          </button>
        </div>
      </div>
    </div>
  );
}
