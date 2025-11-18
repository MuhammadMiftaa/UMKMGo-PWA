import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";

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
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] p-6 text-white">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali</span>
        </button>
        <div>
          <h1 className="mb-1 text-3xl font-bold">Verifikasi Nomor</h1>
          <p className="text-sm text-white/80">
            Masukkan kode yang telah kami kirim
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 py-8">
        {/* Info Box */}
        <div className="mb-8 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <MessageCircle size={20} className="mt-0.5 shrink-0 text-[#0077B6]" />
          <div>
            <p className="mb-1 text-sm font-semibold text-[#0F172A]">
              Kode OTP dikirim via WhatsApp
            </p>
            <p className="text-sm text-[#64748B]">
              Ke nomor{" "}
              <span className="font-semibold">{maskPhone(state.phone)}</span>.
              Masukkan kode 6 digit yang Anda terima.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* OTP Input - improved styling and spacing */}
        <div className="mb-8">
          <label className="mb-4 block text-sm font-semibold text-[#0F172A]">
            Kode Verifikasi
          </label>
          <div className="flex justify-center gap-3">
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
                className="h-14 w-14 rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFB] text-center text-2xl font-bold transition-all focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 focus:outline-none"
                inputMode="numeric"
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="mb-8 text-center">
          {timer > 0 ? (
            <p className="text-sm text-[#64748B]">
              Kirim ulang kode dalam{" "}
              <span className="font-bold text-[#0077B6]">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={() => setTimer(59)}
              className="text-sm font-semibold text-[#0077B6] transition-colors hover:text-[#0063A0]"
            >
              Kirim Ulang OTP
            </button>
          )}
        </div>

        {/* Verify Button - renamed to more descriptive title */}
        <button
          onClick={handleVerifyOTP}
          disabled={loading || otp.some((d) => !d)}
          className="btn-primary"
        >
          {loading ? "Memverifikasi..." : "Verifikasi Kode"}
        </button>

        <div className="flex-1"></div>
      </div>
    </div>
  );
}
