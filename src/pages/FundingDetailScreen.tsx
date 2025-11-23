import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  ArrowLeft,
  Calendar,
  Banknote,
  Clock,
  Award,
  CheckCircle,
  FileText,
  Building2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface Program {
  id: number;
  title: string;
  description: string;
  provider: string;
  min_amount: number;
  max_amount: number;
  interest_rate: string;
  max_tenure_months: number;
  application_deadline: string;
  benefits: string[];
  requirements: string[];
  funding_purposes: string[];
}

export default function FundingDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProgram({
        id: parseInt(id || "1"),
        title: "Pendanaan Modal Usaha Produktif",
        description:
          "Program pembiayaan modal kerja dan investasi untuk UMKM dengan bunga rendah dan tenor fleksibel. Dirancang khusus untuk membantu UMKM mengembangkan usaha, meningkatkan produksi, atau ekspansi bisnis.",
        provider: "KUR - Bank Mandiri",
        min_amount: 5000000,
        max_amount: 50000000,
        interest_rate: "6% per tahun",
        max_tenure_months: 36,
        application_deadline: "2025-12-31",
        benefits: [
          "Bunga rendah dan kompetitif",
          "Proses persetujuan cepat (7-14 hari kerja)",
          "Tenor fleksibel hingga 3 tahun",
          "Tanpa agunan untuk pinjaman di bawah Rp 25 juta",
          "Pendampingan bisnis gratis",
          "Dapat digunakan untuk modal kerja atau investasi",
        ],
        requirements: [
          "Usaha telah berjalan minimal 1 tahun",
          "Memiliki NIB dan NPWP",
          "Omzet minimal Rp 5 juta per bulan",
          "Tidak sedang dalam kredit macet",
          "Memiliki rencana bisnis yang jelas",
          "Bersedia dilakukan survey lapangan",
        ],
        funding_purposes: [
          "Modal kerja (pembelian bahan baku, stok barang)",
          "Pembelian peralatan/mesin produksi",
          "Renovasi atau ekspansi tempat usaha",
          "Pengembangan produk baru",
          "Marketing dan promosi",
          "Investasi teknologi/digitalisasi",
        ],
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading || !program) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground mt-4">Memuat detail program...</p>
        </div>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft(program.application_deadline);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-24">
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <button
          onClick={() => navigate(-1)}
          className="relative z-10 mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <div className="relative z-10">
          <h1 className="text-2xl leading-tight font-bold text-white">
            {program.title}
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <Building2 size={16} className="text-white" />
            <span className="text-sm font-semibold text-white">
              {program.provider}
            </span>
          </div>
        </div>
      </div>

      {daysLeft <= 30 && (
        <div className="relative z-20 mx-6 -mt-4">
          <Card className="border-2 border-orange-200 bg-linear-to-br from-orange-50 to-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-100 p-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-semibold">
                    Pendaftaran Segera Ditutup!
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Tersisa {daysLeft} hari lagi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="px-6 py-6">
        <div className="mb-6 grid grid-cols-2 gap-3">
          <Card className="border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-2">
                  <Banknote size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Plafon</p>
                  <p className="text-foreground text-sm font-bold">
                    {formatCurrency(program.min_amount)} -{" "}
                    {formatCurrency(program.max_amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Bunga</p>
                  <p className="text-foreground font-bold">
                    {program.interest_rate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 border-blue-100">
          <CardContent className="p-5">
            <h3 className="text-foreground mb-4 flex items-center gap-2 font-bold">
              <Clock size={20} className="text-primary" />
              Info Pendanaan
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">
                  Tenor Maksimal
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {program.max_tenure_months} Bulan
                </span>
              </div>
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">
                  Suku Bunga
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {program.interest_rate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Range Dana
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {formatCurrency(program.min_amount)} -{" "}
                  {formatCurrency(program.max_amount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-blue-100">
          <CardContent className="p-5">
            <h3 className="text-foreground mb-3 flex items-center gap-2 font-bold">
              <FileText size={20} className="text-primary" />
              Deskripsi Program
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {program.description}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6 border-blue-100">
          <CardContent className="p-5">
            <h3 className="text-foreground mb-4 flex items-center gap-2 font-bold">
              <Award size={20} className="text-primary" />
              Keuntungan Program
            </h3>
            <ol className="space-y-3">
              {program.benefits.map((benefit, index) => (
                <li key={index} className="flex gap-3">
                  <span className="bg-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground flex-1 text-sm leading-relaxed">
                    {benefit}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6 border-blue-100">
          <CardContent className="p-5">
            <h3 className="text-foreground mb-4 flex items-center gap-2 font-bold">
              <CheckCircle size={20} className="text-primary" />
              Persyaratan
            </h3>
            <ol className="space-y-3">
              {program.requirements.map((req, index) => (
                <li key={index} className="flex gap-3">
                  <span className="border-primary text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground flex-1 text-sm leading-relaxed">
                    {req}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6 border-2 border-red-100 bg-linear-to-br from-red-50/50 to-orange-50/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-red-100 p-2">
                <Calendar size={20} className="text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-foreground mb-1 font-bold">
                  Batas Pendaftaran
                </p>
                <p className="text-lg font-bold text-red-600">
                  {formatDate(program.application_deadline)}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Tersisa {daysLeft} hari lagi
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={() => navigate(`/apply/funding/${program.id}`)}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            <Banknote size={20} />
            <span>Ajukan Pendanaan</span>
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang berlaku
          </p>
        </div>
      </div>
    </div>
  );
}
