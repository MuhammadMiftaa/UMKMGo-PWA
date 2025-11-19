// src/pages/DashboardScreen.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Settings,
  QrCode,
  Award,
  BookOpen,
  Banknote,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";

interface UserData {
  fullname: string;
  businessName: string;
  kartuNumber: string;
}

export default function DashboardScreen() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [unreadCount] = useState(3);

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) {
      setUserData(JSON.parse(stored));
    } else {
      setUserData({
        fullname: "Akbar Chalay",
        businessName: "PT Semua Teman",
        kartuNumber: "1234567890",
      });
    }
  }, []);

  const menuItems = [
    {
      icon: Award,
      label: "Sertifikasi",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      path: "/activity?type=certification",
    },
    {
      icon: BookOpen,
      label: "Pelatihan",
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      path: "/activity?type=training",
    },
    {
      icon: Banknote,
      label: "Pendanaan",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      path: "/activity?type=funding",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-24">
      {/* Header with Gradient */}
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8 pb-24">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mb-8 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Selamat Datang</p>
            <h1 className="mt-1 text-3xl font-bold text-white">
              {userData?.fullname.split(" ")[0]}
            </h1>
          </div>
          <Button
            onClick={() => navigate("/profile")}
            variant="ghost"
            className="h-10 w-10 rounded-xl bg-white/20 p-0 backdrop-blur-sm hover:bg-white/30"
          >
            <Settings size={20} className="text-white" />
          </Button>
        </div>
      </div>

      {/* UMKMGo Card */}
      <div className="relative z-20 -mt-20 px-6">
        <Card className="overflow-hidden border-2 border-blue-100 bg-linear-to-br from-white via-blue-50/30 to-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    UMKMGo Card
                  </p>
                </div>
                <h2 className="text-foreground text-xl font-bold">
                  {userData?.fullname}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {userData?.businessName}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs">Nomor Kartu</p>
                    <p className="font-mono text-sm font-semibold">
                      **** **** **** {userData?.kartuNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="from-primary/10 to-accent/10 rounded-2xl bg-linear-to-br p-4">
                <QrCode size={56} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 px-6">
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-blue-100 bg-linear-to-br from-blue-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Total Pengajuan
                  </p>
                  <p className="text-foreground text-xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-linear-to-br from-green-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-100 p-2">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Disetujui</p>
                  <p className="text-foreground text-xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Menu Utama */}
      <div className="mt-8 px-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-foreground text-lg font-bold">
            Program Tersedia
          </h3>
          <Sparkles className="text-primary h-5 w-5" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="group"
            >
              <Card className="border-blue-100 transition-all hover:scale-105 hover:shadow-lg">
                <CardContent className="p-4">
                  <div
                    className={`mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${item.color}`}
                  >
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-foreground text-sm font-semibold">
                    {item.label}
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="mt-8 px-6">
        <Card className="border-primary/20 from-primary/5 via-accent/5 to-secondary/5 overflow-hidden border-2 bg-linear-to-br">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="from-primary to-accent rounded-2xl bg-linear-to-br p-3">
                <Banknote className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-foreground font-bold">Program Spesial</h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Dapatkan pendanaan hingga Rp 50 juta dengan bunga rendah
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/5 mt-4"
                  onClick={() => navigate("/activity?type=funding")}
                >
                  Pelajari Lebih Lanjut
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 px-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-foreground text-lg font-bold">
            Aktivitas Terbaru
          </h3>
          <button
            onClick={() => navigate("/activity")}
            className="text-primary text-sm font-semibold hover:underline"
          >
            Lihat Semua
          </button>
        </div>
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <Card
              key={item}
              className="border-blue-100 transition-shadow hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">
                        Pelatihan Digital Marketing
                      </p>
                      <p className="text-muted-foreground text-xs">
                        2 hari lalu
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-green-100 px-3 py-1">
                    <p className="text-xs font-semibold text-green-700">
                      Disetujui
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation unreadCount={unreadCount} />
    </div>
  );
}
