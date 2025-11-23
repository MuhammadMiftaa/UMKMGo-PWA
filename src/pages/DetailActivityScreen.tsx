// src/pages/DetailActivityScreen.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ArrowLeft,
  Download,
  File,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  FileText,
  Award,
  DollarSign,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";

interface TimelineItem {
  id: number;
  status: string;
  notes: string;
  actioned_at: string;
  actioned_by_name: string;
}

interface Document {
  id: number;
  type: string;
  file: string | File;
  fileName?: string;
}

interface BaseApplication {
  id: number;
  status: string;
  submitted_at: string;
  program: {
    id: number;
    title: string;
    type: "training" | "certification" | "funding";
  };
  documents: Document[];
  histories: TimelineItem[];
  userData: {
    fullname: string;
    nik: string;
    gender: string;
    birth_date: string;
    phone: string;
    business_name: string;
    kartu_type: string;
    kartu_number: string;
    nib: string;
    npwp: string;
  };
}

interface TrainingApplication extends BaseApplication {
  formData: {
    motivation: string;
    business_experience: string;
    learning_objectives: string;
    availability_notes: string;
  };
}

interface CertificationApplication extends BaseApplication {
  formData: {
    business_sector: string;
    product_or_service: string;
    business_description: string;
    years_operating: string;
    current_standards: string;
    certification_goals: string;
  };
}

interface FundingApplication extends BaseApplication {
  formData: {
    business_sector: string;
    business_description: string;
    years_operating: string;
    requested_amount: string;
    fund_purpose: string;
    business_plan: string;
    revenue_projection: string;
    monthly_revenue: string;
    requested_tenure_months: string;
    collateral_description: string;
  };
}

type Application =
  | TrainingApplication
  | CertificationApplication
  | FundingApplication;

export default function DetailActivityScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    // In real app, fetch from API based on id
    setTimeout(() => {
      // Mock data - in production, this would come from API
      const mockApplication: Application = {
        id: 1,
        status: "revised",
        submitted_at: "2025-11-17 14:30:00",
        program: {
          id: 1,
          title: "Pelatihan Digital Marketing",
          type: "training", // Change to "certification" or "funding" to test
        },
        userData: {
          fullname: "Akbar Chalay",
          nik: "1234567890987654",
          gender: "Laki-laki",
          birth_date: "2008-08-06",
          phone: "81234567890",
          business_name: "PT Semua Teman",
          kartu_type: "Kartu Afirmatif",
          kartu_number: "1234567890",
          nib: "1234567890123",
          npwp: "12.345.678.9-012.000",
        },
        documents: [
          { id: 1, type: "KTP", file: "ktp.pdf" },
          { id: 2, type: "Portfolio", file: "portfolio.pdf" },
        ],
        formData: {
          motivation:
            "Saya ingin meningkatkan kemampuan digital marketing untuk mengembangkan bisnis saya.",
          business_experience:
            "Sudah menjalankan usaha selama 2 tahun di bidang kuliner.",
          learning_objectives:
            "Menguasai social media marketing dan digital advertising.",
          availability_notes:
            "Tersedia setiap hari Senin-Jumat pukul 09.00-17.00.",
        },
        histories: [
          {
            id: 1,
            status: "submit",
            notes: "Pengajuan berhasil dikirim",
            actioned_at: "2025-11-17 14:30:00",
            actioned_by_name: "Sistem",
          },
          {
            id: 2,
            status: "screening",
            notes: "Pengajuan sedang diproses oleh tim",
            actioned_at: "2025-11-17 16:00:00",
            actioned_by_name: "Admin Screening",
          },
          {
            id: 3,
            status: "revise",
            notes: "Mohon perbaiki dokumen KTP, gambar kurang jelas",
            actioned_at: "2025-11-18 10:00:00",
            actioned_by_name: "Admin Screening",
          },
        ],
      } as TrainingApplication;

      setApplication(mockApplication);
      setLoading(false);
    }, 500);
  }, [id]);

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: { icon: React.ReactNode; color: string } } = {
      submit: { icon: <CheckCircle2 size={20} />, color: "text-blue-600" },
      screening: { icon: <Clock size={20} />, color: "text-amber-600" },
      revise: { icon: <AlertTriangle size={20} />, color: "text-orange-600" },
      approved: { icon: <CheckCircle2 size={20} />, color: "text-green-600" },
      rejected: { icon: <AlertTriangle size={20} />, color: "text-red-600" },
    };
    return icons[status] || icons["submit"];
  };

  const getStatusConfig = (status: string) => {
    const configs: {
      [key: string]: {
        badge: string;
        badgeColor: string;
        title: string;
        description: string;
        icon: React.ReactNode;
        bgColor: string;
        iconBg: string;
      };
    } = {
      submit: {
        badge: "Terkirim",
        badgeColor: "bg-blue-100 text-blue-700",
        title: "Pengajuan Terkirim",
        description: "Pengajuan Anda sedang menunggu untuk diproses",
        icon: <CheckCircle2 className="h-6 w-6 text-blue-600" />,
        bgColor: "from-blue-50 to-cyan-50 border-blue-200",
        iconBg: "bg-blue-100",
      },
      screening: {
        badge: "Dalam Proses",
        badgeColor: "bg-amber-100 text-amber-700",
        title: "Sedang Diverifikasi",
        description:
          "Tim kami sedang memproses dan memverifikasi pengajuan Anda",
        icon: <Clock className="h-6 w-6 text-amber-600" />,
        bgColor: "from-amber-50 to-yellow-50 border-amber-200",
        iconBg: "bg-amber-100",
      },
      revise: {
        badge: "Perlu Revisi",
        badgeColor: "bg-orange-100 text-orange-700",
        title: "Perlu Revisi",
        description:
          "Silakan perbaiki dokumen yang ditandai untuk melanjutkan proses",
        icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
        bgColor: "from-orange-50 to-amber-50 border-orange-200",
        iconBg: "bg-orange-100",
      },
      approved: {
        badge: "Disetujui",
        badgeColor: "bg-green-100 text-green-700",
        title: "Pengajuan Disetujui",
        description: "Selamat! Pengajuan Anda telah disetujui",
        icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
        bgColor: "from-green-50 to-emerald-50 border-green-200",
        iconBg: "bg-green-100",
      },
      rejected: {
        badge: "Ditolak",
        badgeColor: "bg-red-100 text-red-700",
        title: "Pengajuan Ditolak",
        description: "Mohon maaf, pengajuan Anda tidak dapat diproses",
        icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
        bgColor: "from-red-50 to-pink-50 border-red-200",
        iconBg: "bg-red-100",
      },
    };
    return configs[status] || configs["submit"];
  };

  const getProgramTypeLabel = (type: string) => {
    const types: {
      [key: string]: { label: string; color: string; icon: React.ReactNode };
    } = {
      training: {
        label: "Pelatihan",
        color: "bg-blue-100 text-blue-700",
        icon: "📚",
      },
      certification: {
        label: "Sertifikasi",
        color: "bg-purple-100 text-purple-700",
        icon: "🏆",
      },
      funding: {
        label: "Pendanaan",
        color: "bg-green-100 text-green-700",
        icon: "💰",
      },
    };
    return types[type] || types["training"];
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(number));
  };

  const handleDownload = (doc: Document) => {
    // In production, implement actual download
    alert(`Downloading ${doc.type}...`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground mt-4">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-muted-foreground">Data tidak ditemukan</p>
          <Button onClick={() => navigate("/activity")} className="mt-4">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(application.status);
  const programType = getProgramTypeLabel(application.program.type);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-24">
      {/* Header */}
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <button
          onClick={() => navigate("/activity")}
          className="relative z-10 mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div className={`rounded-full px-3 py-1 ${programType.color}`}>
              <p className="flex items-center gap-1 text-xs font-semibold">
                <span>{programType.icon}</span>
                <span>{programType.label}</span>
              </p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {application.program.title}
          </h1>
          <p className="mt-2 text-sm text-white/80">Detail Pengajuan</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Status Card */}
        <Card
          className={`mb-6 border-2 bg-linear-to-br ${statusConfig.bgColor}`}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`rounded-2xl ${statusConfig.iconBg} p-3`}>
                {statusConfig.icon}
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm font-semibold">
                    Status Pengajuan
                  </p>
                  <div
                    className={`rounded-full px-3 py-1 ${statusConfig.badgeColor}`}
                  >
                    <p className="text-xs font-semibold">
                      {statusConfig.badge}
                    </p>
                  </div>
                </div>
                <h3 className="text-foreground text-xl font-bold">
                  {statusConfig.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {statusConfig.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Card className="border-blue-100">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-xs">Jenis Program</p>
              <p className="text-foreground mt-1 text-sm font-semibold">
                {programType.label}
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-xs">Tanggal Pengajuan</p>
              <p className="text-foreground mt-1 text-sm font-semibold">
                {new Date(application.submitted_at).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-xs">No. Pengajuan</p>
              <p className="text-foreground mt-1 font-mono text-sm font-semibold">
                #{application.id.toString().padStart(6, "0")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Pribadi */}
        {/* <Card className="mb-6 border-blue-100">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <User size={20} className="text-primary" />
              <h2 className="text-foreground font-bold">Data Pribadi</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">
                  Nama Lengkap
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {application.userData.fullname}
                </span>
              </div>
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">NIK</span>
                <span className="text-foreground text-sm font-semibold">
                  {application.userData.nik}
                </span>
              </div>
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">
                  Jenis Kelamin
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {application.userData.gender}
                </span>
              </div>
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">
                  Tanggal Lahir
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {application.userData.birth_date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Nomor Telepon
                </span>
                <span className="text-foreground text-sm font-semibold">
                  +62{application.userData.phone}
                </span>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Data Usaha */}
        <Card className="mb-6 border-blue-100">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              <h2 className="text-foreground font-bold">Data Usaha</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">
                  Nama Usaha
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {application.userData.business_name}
                </span>
              </div>
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">
                  Kartu UMKM
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {application.userData.kartu_type}
                </span>
              </div>
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">
                  Nomor Kartu
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {application.userData.kartu_number}
                </span>
              </div>
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">NIB</span>
                <span className="text-foreground text-sm font-semibold">
                  {application.userData.nib}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">NPWP</span>
                <span className="text-foreground text-sm font-semibold">
                  {application.userData.npwp}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Specific Data */}
        {application.program.type === "training" && (
          <Card className="mb-6 border-blue-100">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                <h2 className="text-foreground font-bold">
                  Informasi Pelatihan
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm font-medium">
                    Motivasi Mengikuti Pelatihan
                  </p>
                  <p className="text-foreground text-sm">
                    {(application as TrainingApplication).formData.motivation}
                  </p>
                </div>
                {(application as TrainingApplication).formData
                  .business_experience && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Pengalaman Menjalankan Usaha
                    </p>
                    <p className="text-foreground text-sm">
                      {
                        (application as TrainingApplication).formData
                          .business_experience
                      }
                    </p>
                  </div>
                )}
                {(application as TrainingApplication).formData
                  .learning_objectives && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Target Pembelajaran
                    </p>
                    <p className="text-foreground text-sm">
                      {
                        (application as TrainingApplication).formData
                          .learning_objectives
                      }
                    </p>
                  </div>
                )}
                {(application as TrainingApplication).formData
                  .availability_notes && (
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Catatan Ketersediaan
                    </p>
                    <p className="text-foreground text-sm">
                      {
                        (application as TrainingApplication).formData
                          .availability_notes
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {application.program.type === "certification" && (
          <>
            <Card className="mb-6 border-blue-100">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  <h2 className="text-foreground font-bold">Informasi Usaha</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Sektor Usaha
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {
                          (application as CertificationApplication).formData
                            .business_sector
                        }
                      </p>
                    </div>
                    {(application as CertificationApplication).formData
                      .years_operating && (
                      <div>
                        <p className="text-muted-foreground mb-1 text-sm font-medium">
                          Lama Usaha
                        </p>
                        <p className="text-foreground text-sm font-semibold">
                          {
                            (application as CertificationApplication).formData
                              .years_operating
                          }{" "}
                          Tahun
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Produk/Layanan yang Disertifikasi
                    </p>
                    <p className="text-foreground text-sm font-semibold">
                      {
                        (application as CertificationApplication).formData
                          .product_or_service
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Deskripsi Usaha
                    </p>
                    <p className="text-foreground text-sm">
                      {
                        (application as CertificationApplication).formData
                          .business_description
                      }
                    </p>
                  </div>
                  {(application as CertificationApplication).formData
                    .current_standards && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Standar yang Sudah Diterapkan
                      </p>
                      <p className="text-foreground text-sm">
                        {
                          (application as CertificationApplication).formData
                            .current_standards
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 border-blue-100">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Award size={20} className="text-primary" />
                  <h2 className="text-foreground font-bold">
                    Tujuan Sertifikasi
                  </h2>
                </div>
                <div>
                  <p className="text-foreground text-sm">
                    {
                      (application as CertificationApplication).formData
                        .certification_goals
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {application.program.type === "funding" && (
          <>
            <Card className="mb-6 border-blue-100">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  <h2 className="text-foreground font-bold">Informasi Usaha</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Sektor Usaha
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {
                          (application as FundingApplication).formData
                            .business_sector
                        }
                      </p>
                    </div>
                    {(application as FundingApplication).formData
                      .years_operating && (
                      <div>
                        <p className="text-muted-foreground mb-1 text-sm font-medium">
                          Lama Usaha
                        </p>
                        <p className="text-foreground text-sm font-semibold">
                          {
                            (application as FundingApplication).formData
                              .years_operating
                          }{" "}
                          Tahun
                        </p>
                      </div>
                    )}
                  </div>
                  {(application as FundingApplication).formData
                    .monthly_revenue && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Omzet Bulanan
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {formatCurrency(
                          (application as FundingApplication).formData
                            .monthly_revenue,
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Deskripsi Usaha
                    </p>
                    <p className="text-foreground text-sm">
                      {
                        (application as FundingApplication).formData
                          .business_description
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 border-blue-100">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <DollarSign size={20} className="text-primary" />
                  <h2 className="text-foreground font-bold">
                    Pengajuan Pendanaan
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Jumlah Dana
                      </p>
                      <p className="text-foreground text-lg font-bold text-green-600">
                        {formatCurrency(
                          (application as FundingApplication).formData
                            .requested_amount,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Tenor
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {
                          (application as FundingApplication).formData
                            .requested_tenure_months
                        }{" "}
                        Bulan
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Tujuan Penggunaan Dana
                    </p>
                    <p className="text-foreground text-sm">
                      {
                        (application as FundingApplication).formData
                          .fund_purpose
                      }
                    </p>
                  </div>
                  {(application as FundingApplication).formData
                    .business_plan && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Rencana Bisnis
                      </p>
                      <p className="text-foreground text-sm">
                        {
                          (application as FundingApplication).formData
                            .business_plan
                        }
                      </p>
                    </div>
                  )}
                  {(application as FundingApplication).formData
                    .revenue_projection && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Proyeksi Omzet
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {formatCurrency(
                          (application as FundingApplication).formData
                            .revenue_projection,
                        )}
                      </p>
                    </div>
                  )}
                  {(application as FundingApplication).formData
                    .collateral_description && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Agunan/Jaminan
                      </p>
                      <p className="text-foreground text-sm">
                        {
                          (application as FundingApplication).formData
                            .collateral_description
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Documents Section */}
        <div className="mb-8">
          <h3 className="text-foreground mb-4 text-lg font-bold">
            Dokumen Terkait
          </h3>
          <div className="space-y-3">
            {application.documents.map((doc) => (
              <Card
                key={doc.id}
                className="border-blue-100 transition-shadow hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-100 p-3">
                        <File className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-foreground font-semibold">
                          {doc.type}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {typeof doc.file === "string"
                            ? doc.file
                            : doc.file.name}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary border-blue-200 hover:bg-blue-50"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div>
          <h3 className="text-foreground mb-4 text-lg font-bold">
            Riwayat Perubahan
          </h3>
          <div className="space-y-4">
            {application.histories.map((item, idx) => {
              const statusIcon = getStatusIcon(item.status);
              return (
                <div key={item.id} className="relative">
                  {idx !== application.histories.length - 1 && (
                    <div className="absolute top-16 left-6 h-full w-0.5 bg-linear-to-b from-blue-200 to-transparent"></div>
                  )}
                  <Card className="border-blue-100">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-100 to-blue-50 ${statusIcon.color}`}
                        >
                          {statusIcon.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground font-semibold">
                            {item.notes}
                          </p>
                          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                            <span>{item.actioned_by_name}</span>
                            <span>•</span>
                            <span>
                              {new Date(item.actioned_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button - Only show if status is revise */}
        {application.status === "revise" && (
          <div className="mt-8">
            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={() => navigate(`/activity/${id}/revise`)}
            >
              Upload Dokumen Revisi
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation unreadCount={0} />
    </div>
  );
}
