import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Settings,
  QrCode,
  Award,
  BookOpen,
  Banknote,
  Bell,
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
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    // Get user data
    const stored = localStorage.getItem("userData");
    if (stored) {
      setUserData(JSON.parse(stored));
    } else {
      // Mock data
      setUserData({
        fullname: "Akbar Chalay",
        businessName: "PT Semua Teman",
        kartuNumber: "1234567890",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const menuItems = [
    {
      icon: Award,
      label: "Sertifikasi",
      color: "text-primary",
      path: "/activity?type=certification",
    },
    {
      icon: BookOpen,
      label: "Pelatihan",
      color: "text-secondary",
      path: "/activity?type=training",
    },
    {
      icon: Banknote,
      label: "Pendanaan",
      color: "text-accent",
      path: "/activity?type=funding",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="from-primary to-accent bg-linear-to-r p-6 pb-20 text-white">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold">UMKMGo</div>
            <p className="text-sm text-white/80">Selamat datang kembali!</p>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="rounded-lg p-2 transition-colors hover:bg-white/20"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="-mt-16 mb-8 px-6">
        <div className="border-border rounded-2xl border bg-white p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-semibold">
                UMKMGo Card
              </p>
              <h2 className="mt-2 text-xl font-bold">{userData?.fullname}</h2>
              <p className="text-muted-foreground mt-4 text-sm">
                **** **** **** {userData?.kartuNumber.slice(-4)}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <QrCode size={48} className="text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Utama */}
      <div className="mb-8 px-6">
        <h3 className="text-foreground mb-4 text-lg font-semibold">
          Menu Utama
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="bg-muted rounded-xl p-4 text-center transition-shadow hover:shadow-md"
            >
              <item.icon className={`${item.color} mx-auto mb-2`} size={32} />
              <p className="text-foreground text-sm font-semibold">
                {item.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="mb-8 px-6">
        <div className="from-primary/10 to-accent/10 border-primary/20 rounded-xl border bg-linear-to-r p-6">
          <h4 className="text-foreground mb-2 font-semibold">Promo Spesial</h4>
          <p className="text-muted-foreground mb-4 text-sm">
            Dapatkan akses ke program pendanaan eksklusif dengan bunga rendah
          </p>
          <button className="text-primary text-sm font-semibold hover:underline">
            Pelajari lebih lanjut →
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation unreadCount={unreadCount} />
    </div>
  );
}
