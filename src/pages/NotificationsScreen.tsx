import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: "approved",
      title: "Pengajuan Disetujui",
      message:
        "Pengajuan Anda untuk Pelatihan Digital Marketing telah disetujui",
      created_at: "2025-11-18 09:30:00",
      is_read: false,
    },
    {
      id: 2,
      type: "revision",
      title: "Perlu Revisi",
      message:
        "Pengajuan Anda memerlukan revisi. Silakan periksa detail aplikasi.",
      created_at: "2025-11-17 15:00:00",
      is_read: false,
    },
    {
      id: 3,
      type: "screening",
      title: "Sedang Diproses",
      message: "Pengajuan Anda sedang dalam tahap screening",
      created_at: "2025-11-16 11:20:00",
      is_read: true,
    },
    {
      id: 4,
      type: "rejected",
      title: "Pengajuan Ditolak",
      message: "Pengajuan Anda untuk Sertifikasi ISO 9001 ditolak",
      created_at: "2025-11-15 14:00:00",
      is_read: true,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      approved: <CheckCircle2 size={24} className="text-success" />,
      revision: <AlertCircle size={24} className="text-warning" />,
      screening: <Clock size={24} className="text-primary" />,
      rejected: <XCircle size={24} className="text-destructive" />,
    };
    return (
      icons[type] || <AlertCircle size={24} className="text-muted-foreground" />
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="from-primary to-accent bg-linear-to-r p-6 text-white">
        <h1 className="text-2xl font-bold">Notifikasi</h1>
        <p className="mt-1 text-sm text-white/80">Pantau update terbaru Anda</p>
      </div>

      {/* List */}
      <div className="px-6 py-4">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => navigate("/activity")}
                className={`w-full rounded-lg border p-4 transition-all ${
                  notif.is_read
                    ? "border-border bg-white hover:shadow-md"
                    : "bg-primary/5 border-primary/20 hover:shadow-md"
                }`}
              >
                <div className="flex gap-4">
                  <div className="shrink-0 pt-1">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 text-left">
                    <h3
                      className={`font-semibold ${notif.is_read ? "text-foreground" : "text-primary"}`}
                    >
                      {notif.title}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {notif.message}
                    </p>
                    <p className="text-muted-foreground mt-2 text-xs">
                      {new Date(notif.created_at).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <div className="bg-primary mt-2 h-3 w-3 shrink-0 rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation unreadCount={2} />
    </div>
  );
}
