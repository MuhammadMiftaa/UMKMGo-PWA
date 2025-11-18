import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function SignUpScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!email || !phone || !password || !confirmPassword) {
        setError("Semua field harus diisi");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Password tidak cocok");
        setLoading(false);
        return;
      }

      localStorage.setItem("tempPhone", phone);
      localStorage.setItem("signupEmail", email);

      setTimeout(() => {
        navigate("/verify-otp", { state: { phone, mode: "signup" } });
      }, 500);
    } catch (err) {
      setError("Gagal mendaftar. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white pb-20">
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] p-6 text-white">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali</span>
        </button>
        <div>
          <h1 className="mb-1 text-3xl font-bold">Buat Akun Baru</h1>
          <p className="text-sm text-white/80">
            Bergabunglah dengan ribuan UMKM sukses
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              className="input-field"
            />
            <p className="mt-2 text-xs text-[#94A3B8]">
              Kami akan mengirim verifikasi ke email ini
            </p>
          </div>

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
            <p className="mt-2 text-xs text-[#94A3B8]">Untuk verifikasi OTP</p>
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
                placeholder="Minimal 8 karakter"
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
            <p className="mt-2 text-xs text-[#94A3B8]">
              Gunakan kombinasi huruf, angka, dan simbol
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password Anda"
              className="input-field"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary mt-8">
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 border-t border-[#F1F5F9] pt-6 text-center">
          <p className="mb-2 text-sm text-[#64748B]">Sudah punya akun?</p>
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-[#0077B6] transition-colors hover:text-[#0063A0]"
          >
            Masuk sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
