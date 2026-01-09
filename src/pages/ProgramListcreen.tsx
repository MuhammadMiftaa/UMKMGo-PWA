import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Banknote,
  Calendar,
  MapPin,
  TrendingUp,
  Filter,
  Search,
  Building2,
} from "lucide-react";
import { Input } from "../components/ui/Input";
import BottomNavigation from "../components/BottomNavigation";
import { useProgram } from "../contexts/ProgramContext";
import type { Program } from "../contexts/ProgramContext";
import Loader from "@/components/ui/Loader";

export default function ProgramListScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programType = (searchParams.get("type") || "training") as
    | "training"
    | "certification"
    | "funding";

  const { programs, fetchPrograms, isLoading } = useProgram();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);

  useEffect(() => {
    loadPrograms();
  }, [programType]);

  const loadPrograms = async () => {
    try {
      await fetchPrograms(programType);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  useEffect(() => {
    filterPrograms();
  }, [searchQuery, filterLocation, programs]);

  const filterPrograms = () => {
    let filtered = programs;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filterLocation !== "all" && programType === "training") {
      filtered = filtered.filter((p) => p.location === filterLocation);
    }

    setFilteredPrograms(filtered);
  };

  const getTypeConfig = () => {
    const configs = {
      training: {
        icon: BookOpen,
        title: "Program Pelatihan",
        subtitle: "Tingkatkan skill untuk bisnis Anda",
        color: "from-cyan-500 to-cyan-600",
        bgColor: "bg-cyan-50",
      },
      certification: {
        icon: Award,
        title: "Program Sertifikasi",
        subtitle: "Dapatkan sertifikat resmi untuk usaha",
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
      },
      funding: {
        icon: Banknote,
        title: "Program Pendanaan",
        subtitle: "Modal usaha dengan bunga rendah",
        color: "from-indigo-500 to-indigo-600",
        bgColor: "bg-indigo-50",
      },
    };
    return configs[programType as keyof typeof configs] || configs.training;
  };

  const typeConfig = getTypeConfig();
  const TypeIcon = typeConfig.icon;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader />
          <p className="text-muted-foreground mt-4">Memuat program...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-24">
      {/* Header */}
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <button
          onClick={() => navigate("/dashboard")}
          className="relative z-10 mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <div className="relative z-10 flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm`}
          >
            <TypeIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {typeConfig.title}
            </h1>
            <p className="mt-1 text-white/80">{typeConfig.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="border-b border-blue-100 bg-white px-6 py-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Cari program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          {programType === "training" && (
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-muted-foreground" />
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="text-muted-foreground bg-transparent text-sm font-semibold focus:outline-none"
              >
                <option value="all">Semua Lokasi</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Surabaya">Surabaya</option>
                <option value="Bandung">Bandung</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Programs List */}
      <div className="px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Menampilkan{" "}
            <span className="text-foreground font-semibold">
              {filteredPrograms.length}
            </span>{" "}
            program
          </p>
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="py-16 text-center">
            <div
              className={`mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${typeConfig.bgColor}`}
            >
              <TypeIcon className="text-primary h-8 w-8" />
            </div>
            <p className="text-muted-foreground">Tidak ada program tersedia</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Coba ubah filter pencarian Anda
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrograms.map((program) => (
              <button
                key={program.id}
                onClick={() =>
                  navigate(`/program/${program.type}/${program.id}`)
                }
                className="w-full text-left"
              >
                <Card className="border-blue-100 transition-all hover:scale-[1.02] hover:shadow-lg">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-foreground mb-2 text-lg leading-tight font-bold">
                          {program.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {program.description}
                        </p>
                      </div>
                    </div>

                    {/* Provider */}
                    <div className="mb-4 flex items-center gap-2 rounded-xl bg-blue-50/50 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                        <Building2 size={16} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-blue-600">Provider</p>
                        <p className="text-foreground text-sm font-semibold">
                          {program.provider}
                        </p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-2">
                      {program.batch && (
                        <div className="flex items-center gap-2">
                          <TrendingUp
                            size={16}
                            className="text-muted-foreground"
                          />
                          <span className="text-muted-foreground text-xs">
                            Batch {program.batch}
                          </span>
                        </div>
                      )}

                      {program.batch_start_date && (
                        <div className="flex items-center gap-2">
                          <Calendar
                            size={16}
                            className="text-muted-foreground"
                          />
                          <span className="text-muted-foreground text-xs">
                            {formatDate(program.batch_start_date)} -{" "}
                            {formatDate(program.batch_end_date!)}
                          </span>
                        </div>
                      )}

                      {program.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-muted-foreground" />
                          <span className="text-muted-foreground text-xs">
                            {program.location}
                          </span>
                        </div>
                      )}

                      {program.min_amount && program.max_amount && (
                        <div className="mt-2 rounded-lg bg-green-50 p-2">
                          <p className="text-xs text-green-600">Plafon Dana</p>
                          <p className="text-foreground text-sm font-bold">
                            {formatCurrency(program.min_amount)} -{" "}
                            {formatCurrency(program.max_amount)}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t border-blue-100 pt-3">
                        <div>
                          <p className="text-xs text-red-600">
                            Batas Pendaftaran
                          </p>
                          <p className="text-foreground text-sm font-semibold">
                            {formatDate(program.application_deadline)}
                          </p>
                        </div>
                        <div className="text-primary flex items-center gap-1 text-sm font-semibold">
                          <span>Lihat Detail</span>
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
