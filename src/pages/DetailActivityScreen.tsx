import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, File } from "lucide-react";
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
  file: string;
}

export default function DetailActivityScreen() {
  const navigate = useNavigate();
  // const { id } = useParams();

  const [application] = useState({
    id: 1,
    status: "revised",
    submitted_at: "2025-11-17 14:30:00",
    program: {
      id: 1,
      title: "Pelatihan Digital Marketing",
      type: "training",
    },
    documents: [
      { id: 1, type: "KTP", file: "ktp.pdf" },
      { id: 2, type: "NIB", file: "nib.pdf" },
    ] as Document[],
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
        notes: "Pengajuan sedang diproses",
        actioned_at: "2025-11-17 16:00:00",
        actioned_by_name: "Admin Screening",
      },
      {
        id: 3,
        status: "revise",
        notes: "Mohon perbaiki dokumen KTP",
        actioned_at: "2025-11-18 10:00:00",
        actioned_by_name: "Admin Screening",
      },
    ] as TimelineItem[],
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      submit: "bg-primary",
      screening: "bg-warning",
      revise: "bg-warning",
      approved: "bg-success",
      rejected: "bg-destructive",
    };
    return colors[status] || "bg-muted";
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="from-primary to-accent bg-linear-to-r p-6 text-white">
        <button
          onClick={() => navigate("/activity")}
          className="mb-4 flex items-center gap-2 opacity-80 hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl font-bold">{application.program.title}</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Status Card */}
        <div className="bg-muted mb-6 rounded-lg p-4">
          <p className="text-muted-foreground mb-1 text-sm">Status Pengajuan</p>
          <div className="flex items-center justify-between">
            <span className="text-foreground text-lg font-semibold">
              Perlu Revisi
            </span>
            <div className="bg-warning/20 text-warning rounded-full px-3 py-1 text-xs font-semibold">
              Dalam Proses
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="mb-8">
          <h3 className="text-foreground mb-3 font-semibold">
            Dokumen Terkait
          </h3>
          <div className="space-y-2">
            {application.documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-muted border-border hover:border-primary flex items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <File size={20} className="text-primary" />
                  <div>
                    <p className="text-foreground text-sm font-semibold">
                      {doc.type}
                    </p>
                    <p className="text-muted-foreground text-xs">{doc.file}</p>
                  </div>
                </div>
                <button className="rounded p-2 transition-colors hover:bg-white">
                  <Download size={18} className="text-primary" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-foreground mb-4 font-semibold">
            Riwayat Perubahan
          </h3>
          <div className="space-y-4">
            {application.histories.map((item, idx) => (
              <div key={item.id} className="relative">
                {idx !== application.histories.length - 1 && (
                  <div className="bg-border absolute top-12 left-6 h-full w-1"></div>
                )}
                <div className="flex gap-4">
                  <div
                    className={`h-12 w-12 rounded-full ${getStatusColor(item.status)} flex shrink-0 items-center justify-center font-semibold text-white`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-foreground font-semibold">
                      {item.notes}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {item.actioned_by_name} •{" "}
                      {new Date(item.actioned_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation unreadCount={0} />
    </div>
  );
}
