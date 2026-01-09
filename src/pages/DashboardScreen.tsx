// src/pages/DashboardScreen.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  // Settings,
  Award,
  BookOpen,
  Banknote,
  TrendingUp,
  Eye,
  Calendar,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useNews } from "../contexts/NewsContext";
import { useDashboard } from "../contexts/DashboardContext";
import type { News } from "../contexts/NewsContext";
import Loader from "@/components/ui/Loader";

export default function DashboardScreen() {
  const navigate = useNavigate();
  const {
    dashboardData,
    fetchDashboard,
    isLoading: isDashboardLoading,
  } = useDashboard();
  const { newsList, fetchNews, isLoading: isNewsLoading } = useNews();
  const [recentNews, setRecentNews] = useState<News[]>([]);

  useEffect(() => {
    // Fetch data on mount
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([fetchDashboard(), fetchNews()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Update recent news (5 berita terbaru)
    if (newsList.length > 0) {
      setRecentNews(newsList.slice(0, 5));
    }
  }, [newsList]);

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: { label: string; color: string } } = {
      success_story: {
        label: "Kisah Sukses",
        color: "bg-green-100 text-green-700",
      },
      event: { label: "Event", color: "bg-purple-100 text-purple-700" },
      tips: { label: "Tips", color: "bg-blue-100 text-blue-700" },
      news: { label: "Berita", color: "bg-orange-100 text-orange-700" },
      guide: { label: "Panduan", color: "bg-indigo-100 text-indigo-700" },
    };

    return (
      labels[category] || {
        label: category,
        color: "bg-gray-100 text-gray-700",
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const menuItems = [
    {
      icon: Award,
      label: "Sertifikasi",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      path: "/programs?type=certification",
    },
    {
      icon: BookOpen,
      label: "Pelatihan",
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      path: "/programs?type=training",
    },
    {
      icon: Banknote,
      label: "Pendanaan",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      path: "/programs?type=funding",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-32">
      {/* Header with Gradient */}
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8 pb-24">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 mb-8 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">Selamat Datang</p>
            <h1 className="mt-1 text-3xl font-bold text-white">
              {dashboardData?.name?.split(" ")[0] || "User"}
            </h1>
          </div>
          {/* <Button
            onClick={() => navigate("/profile")}
            variant="ghost"
            className="h-10 w-10 rounded-xl bg-white/20 p-0 backdrop-blur-sm hover:bg-white/30"
          >
            <Settings size={20} className="text-white" />
          </Button> */}
          <div className="rounded-xl bg-white/20 p-1">
            <img
              className="h-12 w-12 brightness-10000"
              src="/logo.png"
              alt="UMKMGo Logo"
            />
          </div>
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
                  {dashboardData?.name || "User"}
                </h2>
                <div className="mt-4 flex items-center gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs">Tipe Kartu</p>
                    <p className="font-mono text-sm font-semibold uppercase">
                      {dashboardData?.kartu_type || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Nomor Kartu</p>
                    <p className="font-mono text-sm font-semibold">
                      {dashboardData?.kartu_number || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="from-primary/10 to-accent/10 overflow-hidden rounded-2xl bg-linear-to-br">
                {dashboardData?.qrcode ? (
                  <img
                    src={dashboardData.qrcode}
                    alt="QR Code"
                    className="h-20 w-20 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="p-4">
                    <div className="bg-primary/20 h-12 w-12 animate-pulse rounded-lg" />
                  </div>
                )}
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
                  <p className="text-foreground text-xl font-bold">
                    {isDashboardLoading
                      ? "-"
                      : (dashboardData?.total_applications ?? 0)}
                  </p>
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
                  <p className="text-muted-foreground text-xs">Pengajuan Lolos</p>
                  <p className="text-foreground text-xl font-bold">
                    {isDashboardLoading
                      ? "-"
                      : (dashboardData?.approved_applications ?? 0)}
                  </p>
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
          {/* <Sparkles className="text-primary h-5 w-5" /> */}
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
      {/* <div className="mt-8 px-6">
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
      </div> */}

      {/* Recent News */}
      <div className="mt-8 px-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-foreground text-lg font-bold">Berita Terbaru</h3>
          <button
            onClick={() => navigate("/news")}
            className="text-primary text-sm font-semibold hover:underline"
          >
            Lihat Semua
          </button>
        </div>

        {isNewsLoading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : recentNews.length === 0 ? (
          <Card className="border-blue-100">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Belum ada berita tersedia</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentNews.map((item) => {
              const categoryInfo = getCategoryLabel(item.category);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(`/news/${item.slug}`)}
                  className="w-full text-left"
                >
                  <Card className="border-blue-100 transition-all hover:scale-[1.01] hover:shadow-md">
                    <CardContent className="p-0">
                      <div className="flex gap-3 p-3">
                        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://via.placeholder.com/400x200/0077B6/FFFFFF?text=News";
                            }}
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="mb-1">
                              <span
                                className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${categoryInfo.color}`}
                              >
                                {categoryInfo.label}
                              </span>
                            </div>
                            <h4 className="text-foreground line-clamp-2 text-sm leading-tight font-semibold">
                              {item.title}
                            </h4>
                          </div>
                          <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{formatDate(item.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={12} />
                              <span>{formatViewCount(item.views_count)}</span>
                            </div>
                          </div>
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

      <BottomNavigation />
    </div>
  );
}
