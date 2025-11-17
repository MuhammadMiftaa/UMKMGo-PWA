import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
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
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("semua");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    // Mock data
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
      [key: string]: { bg: string; text: string; label: string };
    } = {
      screening: {
        bg: "bg-warning/10",
        text: "text-warning",
        label: "Screening",
      },
      revised: {
        bg: "bg-warning/10",
        text: "text-warning",
        label: "Perlu Revisi",
      },
      final: { bg: "bg-primary/10", text: "text-primary", label: "Final" },
      approved: {
        bg: "bg-success/10",
        text: "text-success",
        label: "Disetujui",
      },
      rejected: {
        bg: "bg-destructive/10",
        text: "text-destructive",
        label: "Ditolak",
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
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="from-primary to-accent bg-linear-to-r p-6 text-white">
        <h1 className="text-2xl font-bold">Riwayat Pengajuan</h1>
        <p className="mt-1 text-sm text-white/80">
          Pantau status aplikasi Anda
        </p>
      </div>

      {/* Filters */}
      <div className="border-border border-b px-6 py-4">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`rounded-full px-4 py-2 font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === filter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-border"
              }`}
            >
              {filter.label}
            </button>
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

      {/* List */}
      <div className="px-6 py-4">
        {sortedApplications.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Belum ada pengajuan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedApplications.map((app) => {
              const statusBadge = getStatusBadge(app.status);
              return (
                <button
                  key={app.id}
                  onClick={() => navigate(`/activity/${app.id}`)}
                  className="border-border w-full rounded-lg border bg-white p-4 text-left transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-foreground font-semibold">
                        {app.program.title}
                      </h3>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {getTypeLabel(app.type)}
                      </p>
                    </div>
                    <div
                      className={`${statusBadge.bg} ${statusBadge.text} rounded-full px-3 py-1 text-xs font-semibold`}
                    >
                      {statusBadge.label}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {new Date(app.submitted_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
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
