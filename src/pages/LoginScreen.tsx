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
      // Simulasi API call
      if (!phone || !password) {
        setError("Semua field harus diisi");
        setLoading(false);
        return;
      }

      // Simulasi token response
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
      {/* Header */}
      <div className="from-primary to-accent bg-linear-to-r p-6 text-white">
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2 opacity-80 hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl font-bold">Masuk ke Akun</h1>
      </div>

      {/* Form */}
      <div className="flex flex-1 flex-col px-6 py-8">
        <form onSubmit={handleLogin} className="space-y-4">
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

          {/* Password Field */}
          <div>
            <label className="text-foreground mb-2 block text-sm font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="input-field"
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

          {/* Links */}
          <div className="flex justify-between pt-2 text-sm">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-primary font-semibold hover:underline"
            >
              Lupa Password?
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary mt-6">
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="flex-1"></div>

        {/* Sign Up Link */}
        <p className="text-muted-foreground pb-4 text-center text-sm">
          Belum punya akun?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-primary font-semibold hover:underline"
          >
            Daftar
          </button>
        </p>
      </div>
    </div>
  );
}
