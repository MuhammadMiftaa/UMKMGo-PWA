import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

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
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] p-6 text-white">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali</span>
        </button>
        <div>
          <h1 className="mb-1 text-3xl font-bold">Selamat Datang Kembali</h1>
          <p className="text-sm text-white/80">Masuk ke akun UMKMGo Anda</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 py-8">
        <form onSubmit={handleLogin} className="space-y-6">
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
              Gunakan nomor WhatsApp yang terdaftar
            </p>
          </div>

          {/* Password Field */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                className="input-field"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#0077B6]"
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
              className="text-sm font-semibold text-[#0077B6] transition-colors hover:text-[#0063A0]"
            >
              Lupa Password?
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary mt-8">
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="flex-1"></div>

        {/* Sign Up Link */}
        <div className="border-t border-[#F1F5F9] pt-6 text-center">
          <p className="mb-2 text-sm text-[#64748B]">Belum punya akun?</p>
          <button
            onClick={() => navigate("/signup")}
            className="text-sm font-semibold text-[#0077B6] transition-colors hover:text-[#0063A0]"
          >
            Daftar sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
