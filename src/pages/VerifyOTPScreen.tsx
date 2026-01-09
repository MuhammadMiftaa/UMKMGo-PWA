// src/pages/VerifyOTPScreen.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ArrowLeft, Shield, MessageSquare } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { formatPhoneForDisplay } from "../lib/api";

export default function VerifyOTPScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, register, forgotPassword } = useAuth();
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

      const result = await verifyOTP({
        phone: state.phone,
        otp_code: otpCode,
      });

      if (result.success && result.tempToken) {
        if (state.mode === "signup") {
          navigate("/complete-profile", {
            state: { tempToken: result.tempToken },
          });
        } else if (state.mode === "forgot-password") {
          navigate("/reset-password", {
            state: { tempToken: result.tempToken },
          });
        }
      } else {
        setError(result.message || "Verifikasi OTP gagal. Coba lagi.");
      }
    } catch (err) {
      setError("Verifikasi OTP gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setTimer(59);
    setError("");

    try {
      if (state.mode === "signup") {
        const email = localStorage.getItem("tempEmail") || "";
        await register({ email, phone: state.phone });
      } else if (state.mode === "forgot-password") {
        await forgotPassword(state.phone);
      }
    } catch (err) {
      setError("Gagal mengirim ulang OTP");
    }
  };

  const maskPhone = (phone: string) => {
    const formatted = formatPhoneForDisplay(phone);
    // Mask format: +628xxx****xxx
    return formatted.substring(0, 7) + "xxxx" + formatted.substring(11);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header with gradient */}
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Verifikasi</h1>
            <p className="mt-1 text-white/80">Konfirmasi nomor Anda</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col px-6 py-8">
        {/* Info Card */}
        <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
          <div className="mb-3 flex items-center gap-3">
            <MessageSquare className="text-primary h-5 w-5" />
            <p className="text-foreground font-semibold">Kode OTP Terkirim</p>
          </div>
          <p className="text-muted-foreground text-sm">
            Kami telah mengirimkan kode verifikasi 6 digit ke nomor WhatsApp
            Anda
          </p>
          <p className="text-primary mt-2 text-center text-lg font-bold">
            {maskPhone(state.phone)}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="border-destructive/20 bg-destructive/5 text-destructive mb-6 rounded-xl border px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground text-sm font-medium">
            Masukkan kode OTP yang Anda terima
          </p>
        </div>

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
              className="border-border focus:border-primary focus:ring-primary/10 h-14 w-12 rounded-xl border-2 bg-white text-center text-xl font-bold transition-all focus:ring-4 focus:outline-none"
              inputMode="numeric"
            />
          ))}
        </div>

        {/* Timer & Resend */}
        <div className="mb-8 text-center">
          {timer > 0 ? (
            <p className="text-muted-foreground text-sm">
              Kirim ulang kode dalam{" "}
              <span className="text-primary font-semibold">{timer} detik</span>
            </p>
          ) : (
            <button
              onClick={handleResendOTP}
              className="text-primary text-sm font-semibold hover:underline"
            >
              Kirim Ulang Kode OTP
            </button>
          )}
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerifyOTP}
          disabled={loading || otp.some((d) => !d)}
          variant="gradient"
          size="lg"
          className="w-full"
        >
          {loading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Memverifikasi...</span>
            </>
          ) : (
            <>
              <Shield size={20} />
              <span>Verifikasi Sekarang</span>
            </>
          )}
        </Button>

        <div className="flex-1" />

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-xs">
            Tidak menerima kode? Pastikan nomor WhatsApp Anda aktif
          </p>
        </div>
      </div>
    </div>
  );
}
