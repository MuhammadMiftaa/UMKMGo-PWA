// src/pages/NotificationsScreen.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Bell,
  CheckCheck,
  Send,
  FileCheck,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  application_id?: number; // Add application_id field
}

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "final_approved",
      title: "Pengajuan Disetujui Final",
      message:
        "Selamat! Pengajuan Anda untuk Pelatihan Digital Marketing telah disetujui secara final",
      created_at: "2025-11-24 09:30:00",
      is_read: false,
      application_id: 1,
    },
    {
      id: 2,
      type: "screening_revised",
      title: "Perlu Revisi Dokumen",
      message:
        "Dokumen pengajuan Anda perlu direvisi. Silakan periksa komentar pada detail aplikasi.",
      created_at: "2025-11-23 15:00:00",
      is_read: false,
      application_id: 2,
    },
    {
      id: 3,
      type: "screening_approved",
      title: "Lolos Tahap Screening",
      message:
        "Pengajuan Anda telah lolos tahap screening dan akan diproses lebih lanjut",
      created_at: "2025-11-22 11:20:00",
      is_read: false,
      application_id: 3,
    },
    {
      id: 4,
      type: "final_rejected",
      title: "Pengajuan Ditolak",
      message:
        "Pengajuan Anda untuk Sertifikasi ISO 9001 tidak dapat disetujui pada tahap final",
      created_at: "2025-11-21 14:00:00",
      is_read: true,
      application_id: 4,
    },
    {
      id: 5,
      type: "screening_rejected",
      title: "Ditolak pada Tahap Screening",
      message:
        "Pengajuan Anda tidak lolos tahap screening. Data tidak lengkap, silakan periksa kembali.",
      created_at: "2025-11-21 07:13:16",
      is_read: true,
      application_id: 5,
    },
    {
      id: 6,
      type: "application_submitted",
      title: "Pengajuan Berhasil Dikirim",
      message:
        "Pengajuan Anda telah diterima dan akan segera diproses oleh tim kami",
      created_at: "2025-11-20 10:45:00",
      is_read: true,
      application_id: 6,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, is_read: true })),
    );
  };

  const getNotificationIcon = (type: string) => {
    const icons: {
      [key: string]: { icon: React.ReactNode; color: string; bg: string };
    } = {
      application_submitted: {
        icon: <Send size={24} />,
        color: "text-blue-600",
        bg: "bg-blue-100",
      },
      screening_approved: {
        icon: <FileCheck size={24} />,
        color: "text-green-600",
        bg: "bg-green-100",
      },
      screening_rejected: {
        icon: <XCircle size={24} />,
        color: "text-red-600",
        bg: "bg-red-100",
      },
      screening_revised: {
        icon: <AlertCircle size={24} />,
        color: "text-amber-600",
        bg: "bg-amber-100",
      },
      final_approved: {
        icon: <CheckCircle2 size={24} />,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
      },
      final_rejected: {
        icon: <XCircle size={24} />,
        color: "text-rose-600",
        bg: "bg-rose-100",
      },
    };
    return (
      icons[type] || {
        icon: <Bell size={24} />,
        color: "text-muted-foreground",
        bg: "bg-muted",
      }
    );
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  const handleNotificationClick = (notif: Notification) => {
    // Mark notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
    );

    // Navigate to detail activity if application_id exists
    if (notif.application_id) {
      navigate(`/activity/${notif.application_id}`);
    } else {
      // Fallback to activity page if no application_id
      navigate("/activity");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-24">
      {/* Header */}
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Notifikasi</h1>
              <p className="mt-2 text-white/80">
                {unreadCount} notifikasi belum dibaca
              </p>
            </div>
            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
              <Bell className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <div className="border-b border-blue-100 bg-white px-6 py-4">
          <Button
            onClick={markAllAsRead}
            variant="outline"
            size="sm"
            className="text-primary border-blue-200 hover:bg-blue-50"
          >
            <CheckCheck size={16} />
            <span>Tandai Semua Dibaca</span>
          </Button>
        </div>
      )}

      {/* Notifications List */}
      <div className="px-6 py-6">
        {notifications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <Bell className="text-primary h-8 w-8" />
            </div>
            <p className="text-muted-foreground">Tidak ada notifikasi</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Notifikasi akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const notifIcon = getNotificationIcon(notif.type);
              return (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className="w-full text-left"
                >
                  <Card
                    className={`transition-all hover:scale-[1.02] hover:shadow-lg ${
                      notif.is_read
                        ? "border-blue-100"
                        : "border-primary/30 border-2 bg-linear-to-br from-blue-50/50 to-white"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${notifIcon.bg}`}
                        >
                          <span className={notifIcon.color}>
                            {notifIcon.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3
                              className={`font-semibold ${
                                notif.is_read
                                  ? "text-foreground"
                                  : "text-primary"
                              }`}
                            >
                              {notif.title}
                            </h3>
                            {!notif.is_read && (
                              <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
                            )}
                          </div>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {notif.message}
                          </p>
                          <p className="text-muted-foreground mt-2 text-xs">
                            {formatTime(notif.created_at)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavigation unreadCount={unreadCount} />
    </div>
  );
}
