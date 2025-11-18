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
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] p-6 text-white">
        <button
          onClick={() => navigate("/login")}
          className="mb-6 flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali</span>
        </button>
        <div>
          <h1 className="mb-1 text-3xl font-bold">Reset Password</h1>
          <p className="text-sm text-white/80">
            Kami akan mengirimkan kode ke WhatsApp Anda
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 py-8">
        <p className="mb-8 text-center text-[#64748B]">
          Masukkan nomor WhatsApp yang terdaftar untuk memulai proses reset
          password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Phone Field */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
              Nomor WhatsApp
            </label>
            <div className="flex gap-2">
              <div className="input-prefix">+62</div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="8xxxxxxxxx"
                className="input-field flex-1"
              />
            </div>
            <p className="mt-2 text-xs text-[#94A3B8]">
              Gunakan nomor yang terdaftar di akun Anda
            </p>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary mt-8">
            {loading ? "Mengirim..." : "Kirim Kode OTP"}
          </button>
        </form>

        <div className="flex-1"></div>
      </div>
    </div>
  );
}
