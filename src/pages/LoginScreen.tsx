// src/pages/LoginScreen.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { ArrowLeft, Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!phone || !password) {
        setError("Semua field harus diisi");
        setLoading(false);
        return;
      }

      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
      localStorage.setItem("authToken", mockToken);
      localStorage.setItem("userPhone", phone);

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      setError("Gagal login. Periksa kembali data Anda.");
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
          <h1 className="text-3xl font-bold text-white">Selamat Datang</h1>
          <p className="mt-2 text-white/80">Masuk untuk melanjutkan</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-1 flex-col px-6 py-8">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-xl border px-4 py-3 text-sm">
              {error}
            </div>
          )}

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
              Gunakan nomor WhatsApp yang terdaftar
            </p>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-primary text-sm font-semibold hover:underline"
            >
              Lupa Password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Masuk</span>
              </>
            )}
          </Button>
        </form>

        <div className="flex-1" />

        {/* Sign Up Link */}
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-center">
          <p className="text-muted-foreground text-sm">
            Belum memiliki akun UMKMGo?
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="text-primary mt-2 font-semibold hover:underline"
          >
            Daftar Sekarang →
          </button>
        </div>
      </div>
    </div>
  );
}
