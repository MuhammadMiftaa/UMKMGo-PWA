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

      // Simulasi API call
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
      {/* Header */}
      <div className="from-primary to-accent bg-linear-to-r p-6 text-white">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 opacity-80 hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl font-bold">Reset Password</h1>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 py-8">
        <p className="text-muted-foreground mb-8 text-center">
          Buat password baru untuk akun Anda
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border-destructive/30 text-destructive rounded-lg border px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="text-foreground mb-2 block text-sm font-semibold">
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password baru"
                className="input-field"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-foreground mb-2 block text-sm font-semibold">
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
          <button type="submit" disabled={loading} className="btn-primary mt-6">
            {loading ? "Memproses..." : "Simpan Password"}
          </button>
        </form>

        <div className="flex-1"></div>
      </div>
    </div>
  );
}
