import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
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

      // Simulasi API call
      setTimeout(() => {
        navigate("/verify-otp", { state: { phone, mode: "forgot-password" } });
      }, 500);
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="from-primary to-accent bg-linear-to-r p-6 text-white">
        <button
          onClick={() => navigate("/login")}
          className="mb-4 flex items-center gap-2 opacity-80 hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl font-bold">Lupa Password</h1>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 py-8">
        <p className="text-muted-foreground mb-8 text-center">
          Masukkan nomor WhatsApp terdaftar Anda untuk mereset password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border-destructive/30 text-destructive rounded-lg border px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Phone Field */}
          <div>
            <label className="text-foreground mb-2 block text-sm font-semibold">
              Nomor WhatsApp
            </label>
            <div className="flex gap-2">
              <span className="bg-input border-border text-muted-foreground flex items-center rounded-lg border px-3 font-semibold">
                +62
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="8xxxxxxxxx"
                className="input-field flex-1"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary mt-6">
            {loading ? "Mengirim..." : "Kirim Kode OTP"}
          </button>
        </form>

        <div className="flex-1"></div>
      </div>
    </div>
  );
}
