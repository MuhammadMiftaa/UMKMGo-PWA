import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!password || !confirmPassword) {
        setError("Semua field harus diisi");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Password tidak cocok");
        setLoading(false);
        return;
      }

      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err) {
      setError("Gagal mereset password. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] p-6 text-white">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali</span>
        </button>
        <div>
          <h1 className="mb-1 text-3xl font-bold">Buat Password Baru</h1>
          <p className="text-sm text-white/80">
            Pastikan password yang kuat dan aman
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="input-field"
                required
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

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              className="input-field"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary mt-8">
            {loading ? "Memproses..." : "Simpan Password"}
          </button>
        </form>

        <div className="flex-1"></div>
      </div>
    </div>
  );
}
