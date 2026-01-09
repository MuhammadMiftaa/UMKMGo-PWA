// src/pages/ForgotPasswordScreen.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { ArrowLeft, KeyRound, Send } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!phone) {
        setError("Nomor WhatsApp harus diisi");
        setLoading(false);
        return;
      }

      const result = await forgotPassword(phone);

      if (result.success) {
        navigate("/verify-otp", { state: { phone, mode: "forgot-password" } });
      } else {
        setError(result.message || "Terjadi kesalahan. Coba lagi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8">
        <button
          onClick={() => navigate("/login")}
          className="mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <KeyRound className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Lupa Password</h1>
            <p className="mt-1 text-white/80">Reset password Anda</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 py-8">
        {/* Info Card */}
        <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
          <p className="text-muted-foreground text-sm">
            Masukkan nomor WhatsApp yang terdaftar. Kami akan mengirimkan kode
            verifikasi untuk mereset password Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-xl border px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor WhatsApp Terdaftar</Label>
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
              Pastikan nomor ini masih aktif dan terdaftar di akun Anda
            </p>
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
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Kirim Kode Verifikasi</span>
              </>
            )}
          </Button>
        </form>

        <div className="flex-1" />

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Ingat password Anda?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-semibold hover:underline"
            >
              Kembali ke Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
