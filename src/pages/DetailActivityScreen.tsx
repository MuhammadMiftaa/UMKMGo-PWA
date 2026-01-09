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
import { useProgram } from "../contexts/ProgramContext";
import type {
  ApplicationDetail,
  ApplicationDocument,
} from "../contexts/ProgramContext";

export default function DetailActivityScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getApplicationDetail } = useProgram();
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchApplicationDetail();
    }
  }, [id]);

  const fetchApplicationDetail = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getApplicationDetail(parseInt(id));
      setApplication(data);
    } catch (err) {
      console.error("Error fetching application detail:", err);
      setError("Gagal memuat detail pengajuan");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: { icon: React.ReactNode; color: string } } = {
      screening: { icon: <Clock size={20} />, color: "text-amber-600" },
      revision: { icon: <AlertTriangle size={20} />, color: "text-orange-600" },
      final: { icon: <CheckCircle2 size={20} />, color: "text-green-600" },
      rejected: { icon: <AlertTriangle size={20} />, color: "text-red-600" },
    };
    return icons[status] || icons["screening"];
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
      revision: {
        badge: "Perlu Revisi",
        badgeColor: "bg-orange-100 text-orange-700",
        title: "Perlu Revisi",
        description:
          "Silakan perbaiki dokumen yang ditandai untuk melanjutkan proses",
        icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
        bgColor: "from-orange-50 to-amber-50 border-orange-200",
        iconBg: "bg-orange-100",
      },
      final: {
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
    return configs[status] || configs["screening"];
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

  const handleDownload = (doc: ApplicationDocument) => {
    // Open the document file URL in new tab
    if (doc.file) {
      window.open(doc.file, "_blank");
    } else {
      alert(`Document ${doc.type} tidak tersedia`);
    }
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

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => navigate("/activity")} className="mt-4">
            Kembali
          </Button>
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

        {/* Program Info */}
        <Card className="mb-6 border-blue-100">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              <h2 className="text-foreground font-bold">Informasi Program</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">
                  Nama Program
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {application.program.title}
                </span>
              </div>
              <div className="flex justify-between border-b border-blue-50 pb-2">
                <span className="text-muted-foreground text-sm">
                  Penyelenggara
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {application.program.provider}
                </span>
              </div>
              {application.program.location && (
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">Lokasi</span>
                  <span className="text-foreground text-sm font-semibold">
                    {application.program.location}
                  </span>
                </div>
              )}
              {application.program.batch && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Batch</span>
                  <span className="text-foreground text-sm font-semibold">
                    Batch {application.program.batch}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Program Specific Data */}
        {application.program.type === "training" &&
          application.training_data && (
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
                      {application.training_data.motivation}
                    </p>
                  </div>
                  {application.training_data.business_experience && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Pengalaman Menjalankan Usaha
                      </p>
                      <p className="text-foreground text-sm">
                        {application.training_data.business_experience}
                      </p>
                    </div>
                  )}
                  {application.training_data.learning_objectives && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Target Pembelajaran
                      </p>
                      <p className="text-foreground text-sm">
                        {application.training_data.learning_objectives}
                      </p>
                    </div>
                  )}
                  {application.training_data.availability_notes && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Catatan Ketersediaan
                      </p>
                      <p className="text-foreground text-sm">
                        {application.training_data.availability_notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        {application.program.type === "certification" &&
          application.certification_data && (
            <>
              <Card className="mb-6 border-blue-100">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    <h2 className="text-foreground font-bold">
                      Informasi Usaha
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground mb-1 text-sm font-medium">
                          Sektor Usaha
                        </p>
                        <p className="text-foreground text-sm font-semibold">
                          {application.certification_data.business_sector}
                        </p>
                      </div>
                      {application.certification_data.years_operating > 0 && (
                        <div>
                          <p className="text-muted-foreground mb-1 text-sm font-medium">
                            Lama Usaha
                          </p>
                          <p className="text-foreground text-sm font-semibold">
                            {application.certification_data.years_operating}{" "}
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
                        {application.certification_data.product_or_service}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Deskripsi Usaha
                      </p>
                      <p className="text-foreground text-sm">
                        {application.certification_data.business_description}
                      </p>
                    </div>
                    {application.certification_data.current_standards && (
                      <div>
                        <p className="text-muted-foreground mb-1 text-sm font-medium">
                          Standar yang Sudah Diterapkan
                        </p>
                        <p className="text-foreground text-sm">
                          {application.certification_data.current_standards}
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
                      {application.certification_data.certification_goals}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

        {application.program.type === "funding" && application.funding_data && (
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
                        {application.funding_data.business_sector}
                      </p>
                    </div>
                    {application.funding_data.years_operating > 0 && (
                      <div>
                        <p className="text-muted-foreground mb-1 text-sm font-medium">
                          Lama Usaha
                        </p>
                        <p className="text-foreground text-sm font-semibold">
                          {application.funding_data.years_operating} Tahun
                        </p>
                      </div>
                    )}
                  </div>
                  {application.funding_data.monthly_revenue > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Omzet Bulanan
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {formatCurrency(
                          application.funding_data.monthly_revenue.toString(),
                        )}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Deskripsi Usaha
                    </p>
                    <p className="text-foreground text-sm">
                      {application.funding_data.business_description}
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
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(
                          application.funding_data.requested_amount.toString(),
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Tenor
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {application.funding_data.requested_tenure_months} Bulan
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Tujuan Penggunaan Dana
                    </p>
                    <p className="text-foreground text-sm">
                      {application.funding_data.fund_purpose}
                    </p>
                  </div>
                  {application.funding_data.business_plan && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Rencana Bisnis
                      </p>
                      <p className="text-foreground text-sm">
                        {application.funding_data.business_plan}
                      </p>
                    </div>
                  )}
                  {application.funding_data.revenue_projection > 0 && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Proyeksi Omzet
                      </p>
                      <p className="text-foreground text-sm font-semibold">
                        {formatCurrency(
                          application.funding_data.revenue_projection.toString(),
                        )}
                      </p>
                    </div>
                  )}
                  {application.funding_data.collateral_description && (
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Agunan/Jaminan
                      </p>
                      <p className="text-foreground text-sm">
                        {application.funding_data.collateral_description}
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
                          {new Date(doc.created_at).toLocaleDateString("id-ID")}
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
                            {item.notes || item.status}
                          </p>
                          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
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

        {/* Action Button - Only show if status is revision */}
        {application.status === "revision" && (
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

      <BottomNavigation />
    </div>
  );
}
