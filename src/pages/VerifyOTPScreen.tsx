import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function VerifyOTPScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const state = (location.state as { phone: string; mode: string }) || {
    phone: "81234567890",
    mode: "signup",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");

    try {
      const otpCode = otp.join("");
      if (otpCode.length !== 6) {
        setError("Kode OTP harus 6 digit");
        setLoading(false);
        return;
      }

      // Simulasi API call
      const mockTempToken = "temp_token_abc123xyz";
      localStorage.setItem("tempToken", mockTempToken);

      setTimeout(() => {
        if (state.mode === "signup") {
          navigate("/complete-profile", {
            state: { tempToken: mockTempToken },
          });
        } else if (state.mode === "forgot-password") {
          navigate("/reset-password");
        }
      }, 500);
    } catch (err) {
      setError("Verifikasi OTP gagal. Coba lagi.");
      setLoading(false);
    }
  };

  const maskPhone = (phone: string) => {
    return `+62${phone.substring(0, 3)}xxxx${phone.substring(7)}`;
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
        <h1 className="text-2xl font-bold">Verifikasi Nomor</h1>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 py-8">
        <p className="text-muted-foreground mb-8 text-center">
          Kode OTP telah dikirim ke <br />
          <span className="text-foreground font-semibold">
            {maskPhone(state.phone)}
          </span>
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border-destructive/30 text-destructive mb-6 rounded-lg border px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* OTP Input */}
        <div className="mb-8 flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="border-border focus:border-primary focus:ring-primary/20 h-12 w-12 rounded-lg border-2 text-center text-xl font-bold focus:ring-2 focus:outline-none"
              inputMode="numeric"
            />
          ))}
        </div>

        {/* Timer */}
        <div className="mb-6 text-center">
          {timer > 0 ? (
            <p className="text-muted-foreground">
              Kirim ulang dalam{" "}
              <span className="text-primary font-semibold">{timer}</span> detik
            </p>
          ) : (
            <button
              onClick={() => setTimer(59)}
              className="text-primary font-semibold hover:underline"
            >
              Kirim Ulang OTP
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerifyOTP}
          disabled={loading || otp.some((d) => !d)}
          className="btn-primary"
        >
          {loading ? "Memverifikasi..." : "Verifikasi"}
        </button>

        <div className="flex-1"></div>
      </div>
    </div>
  );
}
