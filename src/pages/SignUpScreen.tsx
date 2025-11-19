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

      // Simulasi API call
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
      {/* Header */}
      <div className="from-primary to-accent bg-linear-to-r p-6 text-white">
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2 opacity-80 hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl font-bold">Daftar Akun Baru</h1>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8">
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border-destructive/30 text-destructive rounded-lg border px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="text-foreground mb-2 block text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              className="input-field"
            />
          </div>

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
                placeholder="Buat password"
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

          {/* Confirm Password Field */}
          <div>
            <label className="text-foreground mb-2 block text-sm font-semibold">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              className="input-field"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary mt-6">
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <div className="flex-1"></div>

        {/* Login Link */}
        <p className="text-muted-foreground text-center text-sm">
          Sudah punya akun?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-semibold hover:underline"
          >
            Masuk
          </button>
        </p>
      </div>
    </div>
  );
}
