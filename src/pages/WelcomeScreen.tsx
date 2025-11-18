import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="px-6 pt-12 pb-8">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#0077B6] to-[#00B4D8]">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-[#0F172A]">UMKMGo</h1>
          <p className="mb-1 text-lg font-medium text-[#64748B]">
            Platform Digital untuk UMKM
          </p>
          <p className="text-sm text-[#94A3B8]">
            Raih peluang bisnis terbaik dengan teknologi modern
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-8">
        <div className="rounded-2xl border border-[#00B4D8]/20 bg-linear-to-br from-[#F0F9FF] to-[#E0F2FE] p-6">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0077B6]/10">
                <Shield size={24} className="text-[#0077B6]" />
              </div>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-[#0F172A]">
                Aman & Terpercaya
              </h3>
              <p className="text-sm text-[#64748B]">
                Data Anda dilindungi dengan enkripsi tingkat enterprise
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#16A34A]/20 bg-linear-to-br from-[#F0FDF4] to-[#E0F4E9] p-6">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#16A34A]/10">
                <TrendingUp size={24} className="text-[#16A34A]" />
              </div>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-[#0F172A]">
                Tingkatkan Bisnis
              </h3>
              <p className="text-sm text-[#64748B]">
                Kelola seluruh aspek bisnis Anda dari satu platform
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#F59E0B]/20 bg-linear-to-br from-[#FEF3C7] to-[#FCD34D]/30 p-6">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10">
                <Zap size={24} className="text-[#F59E0B]" />
              </div>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-[#0F172A]">
                Mudah & Cepat
              </h3>
              <p className="text-sm text-[#64748B]">
                Interface intuitif yang mudah digunakan oleh siapa saja
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-[#F1F5F9] px-6 py-8">
        <button
          onClick={() => navigate("/login")}
          className="btn-primary group flex items-center justify-center gap-2"
        >
          <span>Mulai Sekarang</span>
          <ArrowRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

        <p className="text-center text-sm text-[#64748B]">
          Belum punya akun?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-semibold text-[#0077B6] transition-colors hover:text-[#0063A0]"
          >
            Daftar di sini
          </button>
        </p>
      </div>
    </div>
  );
}
