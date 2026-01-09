import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  Award,
  CheckCircle,
  FileText,
  Building2,
  AlertCircle,
} from "lucide-react";
import { useProgram } from "../contexts/ProgramContext";
import type { Program } from "../contexts/ProgramContext";
import Loader from "@/components/ui/Loader";

export default function TrainingDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProgramDetail } = useProgram();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProgramDetail();
    }
  }, [id]);

  const fetchProgramDetail = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getProgramDetail(parseInt(id));
      setProgram(data);
    } catch (err) {
      console.error("Error fetching program detail:", err);
      setError("Gagal memuat detail program");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateDaysLeft = (deadline?: string) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader />
          <p className="text-muted-foreground mt-4">Memuat detail program...</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-muted-foreground">
            {error || "Program tidak ditemukan"}
          </p>
          <Button
            onClick={() => navigate("/programs?type=training")}
            className="mt-4"
          >
            Kembali ke Daftar Program
          </Button>
        </div>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft(program.application_deadline);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-24">
      {/* Header */}
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

      {/* Deadline Alert */}
      {daysLeft <= 7 && (
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
        {/* Quick Info */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <Card className="border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Batch</p>
                  <p className="text-foreground font-bold">
                    Batch {program.batch}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-2">
                  <Clock size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Durasi</p>
                  <p className="text-foreground font-bold">14 Hari</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Card */}
        <Card className="mb-6 border-blue-100">
          <CardContent className="p-5">
            <h3 className="text-foreground mb-4 flex items-center gap-2 font-bold">
              <Calendar size={20} className="text-primary" />
              Jadwal Pelatihan
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Calendar size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">Tanggal Mulai</p>
                  <p className="text-foreground font-semibold">
                    {formatDate(program.batch_start_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-green-50 p-2">
                  <Calendar size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">
                    Tanggal Selesai
                  </p>
                  <p className="text-foreground font-semibold">
                    {formatDate(program.batch_end_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-purple-50 p-2">
                  <MapPin size={16} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">Lokasi</p>
                  <p className="text-foreground font-semibold">
                    {program.location}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
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

        {/* Benefits */}
        {program.benefits && program.benefits.length > 0 && (
          <Card className="mb-6 border-blue-100">
            <CardContent className="p-5">
              <h3 className="text-foreground mb-4 flex items-center gap-2 font-bold">
                <Award size={20} className="text-primary" />
                Manfaat yang Didapat
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
        )}

        {/* Requirements */}
        {program.requirements && program.requirements.length > 0 && (
          <Card className="mb-6 border-blue-100">
            <CardContent className="p-5">
              <h3 className="text-foreground mb-4 flex items-center gap-2 font-bold">
                <CheckCircle size={20} className="text-primary" />
                Persyaratan
              </h3>
              <ol className="space-y-3">
                {program.requirements.map((requirement, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="border-primary text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground flex-1 text-sm leading-relaxed">
                      {requirement}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Deadline Info */}
        <Card className="mb-6 border-2 border-red-100 bg-linear-to-br from-red-50/50 to-orange-50/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-red-100 p-2">
                <Clock size={20} className="text-red-600" />
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

        {/* CTA Button */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate(`/apply/training/${program.id}`)}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            <Users size={20} />
            <span>Daftar Sekarang</span>
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang berlaku
          </p>
        </div>
      </div>
    </div>
  );
}
