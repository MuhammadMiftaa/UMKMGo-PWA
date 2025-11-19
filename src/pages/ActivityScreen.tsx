// src/pages/ActivityScreen.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import {
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";

interface Application {
  id: number;
  type: string;
  status: string;
  submitted_at: string;
  program: {
    id: number;
    title: string;
    type: string;
  };
}

export default function ActivityScreen() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("semua");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setApplications([
      {
        id: 1,
        type: "training",
        status: "screening",
        submitted_at: "2025-11-17 14:30:00",
        program: {
          id: 1,
          title: "Pelatihan Digital Marketing",
          type: "training",
        },
      },
      {
        id: 2,
        type: "funding",
        status: "approved",
        submitted_at: "2025-11-16 10:15:00",
        program: {
          id: 2,
          title: "Pendanaan UMKM Produktif",
          type: "funding",
        },
      },
      {
        id: 3,
        type: "certification",
        status: "revised",
        submitted_at: "2025-11-15 09:00:00",
        program: {
          id: 3,
          title: "Sertifikasi ISO 9001",
          type: "certification",
        },
      },
    ]);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap: {
      [key: string]: {
        bg: string;
        text: string;
        label: string;
        icon: React.ReactNode;
      };
    } = {
      screening: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Screening",
        icon: <Clock size={14} />,
      },
      revised: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Perlu Revisi",
        icon: <AlertCircle size={14} />,
      },
      final: {
        bg: "bg-indigo-100",
        text: "text-indigo-700",
        label: "Final",
        icon: <History size={14} />,
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Disetujui",
        icon: <CheckCircle2 size={14} />,
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Ditolak",
        icon: <XCircle size={14} />,
      },
    };
    return statusMap[status] || statusMap["screening"];
  };

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      training: "Pelatihan",
      funding: "Pendanaan",
      certification: "Sertifikasi",
    };
    return typeMap[type] || type;
  };

  const filteredApplications =
    selectedFilter === "semua"
      ? applications
      : applications.filter((app) => app.type === selectedFilter);

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
      );
    } else {
      return (
        new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
      );
    }
  });

  const filters = [
    { id: "semua", label: "Semua" },
    { id: "certification", label: "Sertifikasi" },
    { id: "training", label: "Pelatihan" },
    { id: "funding", label: "Pendanaan" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-24">
      {/* Header */}
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white">Riwayat Pengajuan</h1>
          <p className="mt-2 text-white/80">Pantau status aplikasi Anda</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="border-b border-blue-100 bg-white px-6 py-4">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap ${
                selectedFilter === filter.id
                  ? "from-primary to-accent bg-linear-to-r"
                  : ""
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ChevronDown size={18} className="text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-muted-foreground bg-transparent text-sm font-semibold focus:outline-none"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="px-6 py-6">
        {sortedApplications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <History className="text-primary h-8 w-8" />
            </div>
            <p className="text-muted-foreground">Belum ada pengajuan</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Mulai ajukan program yang Anda butuhkan
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedApplications.map((app) => {
              const statusBadge = getStatusBadge(app.status);
              return (
                <button
                  key={app.id}
                  onClick={() => navigate(`/activity/${app.id}`)}
                  className="w-full text-left"
                >
                  <Card className="border-blue-100 transition-all hover:scale-[1.02] hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-foreground font-semibold">
                            {app.program.title}
                          </h3>
                          <p className="text-muted-foreground mt-1 text-xs">
                            {getTypeLabel(app.type)}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 rounded-full ${statusBadge.bg} px-3 py-1.5`}
                        >
                          <span className={statusBadge.text}>
                            {statusBadge.icon}
                          </span>
                          <span
                            className={`text-xs font-semibold ${statusBadge.text}`}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-xs">
                          {new Date(app.submitted_at).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-primary text-xs font-semibold">
                          Lihat Detail →
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavigation unreadCount={0} />
    </div>
  );
}
