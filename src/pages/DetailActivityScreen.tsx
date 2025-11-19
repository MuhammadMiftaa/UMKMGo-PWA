// src/pages/DetailActivityScreen.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ArrowLeft,
  Download,
  File,
  Clock,
  CheckCircle2,
  AlertTriangle,
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
  file: string;
}

export default function DetailActivityScreen() {
  const navigate = useNavigate();

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
      { id: 3, type: "NPWP", file: "npwp.pdf" },
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
    ] as TimelineItem[],
  });

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
          <h1 className="text-2xl font-bold text-white">
            {application.program.title}
          </h1>
          <p className="mt-2 text-sm text-white/80">Detail Pengajuan</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Status Card */}
        <Card className="mb-6 border-2 border-amber-200 bg-linear-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-amber-100 p-3">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm font-semibold">
                    Status Pengajuan
                  </p>
                  <div className="rounded-full bg-amber-100 px-3 py-1">
                    <p className="text-xs font-semibold text-amber-700">
                      Dalam Proses
                    </p>
                  </div>
                </div>
                <h3 className="text-foreground text-xl font-bold">
                  Perlu Revisi
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Silakan perbaiki dokumen yang ditandai untuk melanjutkan
                  proses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <Card className="border-blue-100">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-xs">Tanggal Pengajuan</p>
              <p className="text-foreground mt-1 font-semibold">
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
              <p className="text-foreground mt-1 font-mono font-semibold">
                #{application.id.toString().padStart(6, "0")}
              </p>
            </CardContent>
          </Card>
        </div>

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
                          {doc.file}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary border-blue-200 hover:bg-blue-50"
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

        {/* Action Button */}
        <div className="mt-8">
          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={() => navigate("/activity")}
          >
            Upload Dokumen Revisi
          </Button>
        </div>
      </div>

      <BottomNavigation unreadCount={0} />
    </div>
  );
}
