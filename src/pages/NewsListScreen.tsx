import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { ArrowLeft, Eye, Calendar, User, Search } from "lucide-react";
import { Input } from "../components/ui/Input";
import BottomNavigation from "../components/BottomNavigation";

interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  author_name: string;
  views_count: number;
  created_at: string;
}

export default function NewsListScreen() {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [searchQuery, selectedCategory, news]);

  const fetchNews = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/mobile/news`);
      // const data = await response.json();
      
      // Mock data for now
      const mockNews: News[] = [
        {
          id: 1,
          title: "Kisah Sukses: Dari Warung Kecil hingga Ekspor ke 5 Negara",
          slug: "kisah-sukses-dari-warung-kecil-hingga-ekspor-ke-5-negara",
          excerpt: "Pak Budi berhasil mengembangkan usaha keripik singkongnya dari warung kecil hingga ekspor ke 5 negara",
          thumbnail: "https://storage.miftech.web.id/umkmgo-news/kisah_sukses:_dari_warung_kecil_hingga_ekspor_ke_5_negara/news_thumbnail___1764342206.png",
          category: "success_story",
          author_name: "Super Admin",
          views_count: 1250,
          created_at: "2025-11-28 15:03:32"
        },
        {
          id: 2,
          title: "Expo UMKM Jakarta 2025 - Pameran Produk Lokal Terbesar",
          slug: "expo-umkm-jakarta-2025-pameran-produk-lokal-terbesar",
          excerpt: "Kami mengundang seluruh pelaku UMKM untuk berpartisipasi dalam Expo UMKM Jakarta 2025",
          thumbnail: "http://127.0.0.1:9000/umkmgo-programs/expo_umkm_jakarta_2025_-_pameran_produk_lokal_terbesar/news_thumbnail___1764337504.png",
          category: "event",
          author_name: "Super Admin",
          views_count: 850,
          created_at: "2025-11-28 20:45:04"
        },
        {
          id: 3,
          title: "Tips Digital Marketing untuk UMKM Pemula",
          slug: "tips-digital-marketing-untuk-umkm-pemula",
          excerpt: "Pelajari strategi digital marketing yang efektif untuk meningkatkan penjualan online Anda",
          thumbnail: "https://via.placeholder.com/400x200/0077B6/FFFFFF?text=Digital+Marketing",
          category: "tips",
          author_name: "Marketing Team",
          views_count: 2100,
          created_at: "2025-11-27 10:30:00"
        },
        {
          id: 4,
          title: "Kebijakan Baru Pemerintah untuk UMKM 2025",
          slug: "kebijakan-baru-pemerintah-untuk-umkm-2025",
          excerpt: "Pemerintah meluncurkan kebijakan baru yang memberikan kemudahan akses pembiayaan bagi UMKM",
          thumbnail: "https://via.placeholder.com/400x200/00B4D8/FFFFFF?text=Kebijakan+Baru",
          category: "news",
          author_name: "News Editor",
          views_count: 1750,
          created_at: "2025-11-26 14:20:00"
        },
        {
          id: 5,
          title: "Cara Mendapatkan Sertifikat Halal untuk Produk UMKM",
          slug: "cara-mendapatkan-sertifikat-halal-untuk-produk-umkm",
          excerpt: "Panduan lengkap proses pengajuan dan persyaratan sertifikasi halal untuk produk makanan",
          thumbnail: "https://via.placeholder.com/400x200/0096C7/FFFFFF?text=Sertifikat+Halal",
          category: "guide",
          author_name: "Admin Content",
          views_count: 980,
          created_at: "2025-11-25 09:15:00"
        }
      ];
      
      setNews(mockNews);
      setFilteredNews(mockNews);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredNews(filtered);
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: { label: string; color: string } } = {
      success_story: { label: "Kisah Sukses", color: "bg-green-100 text-green-700" },
      event: { label: "Event", color: "bg-purple-100 text-purple-700" },
      tips: { label: "Tips", color: "bg-blue-100 text-blue-700" },
      news: { label: "Berita", color: "bg-orange-100 text-orange-700" },
      guide: { label: "Panduan", color: "bg-indigo-100 text-indigo-700" }
    };
    return labels[category] || { label: category, color: "bg-gray-100 text-gray-700" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground mt-4">Memuat berita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-24">
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <button
          onClick={() => navigate("/dashboard")}
          className="relative z-10 mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white">Berita UMKM</h1>
          <p className="mt-2 text-white/80">Update terbaru seputar UMKM</p>
        </div>
      </div>

      <div className="border-b border-blue-100 bg-white px-6 py-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Semua
            </button>
            {["success_story", "event", "tips", "news", "guide"].map(cat => {
              const categoryInfo = getCategoryLabel(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-white"
                      : `${categoryInfo.color} hover:opacity-80`
                  }`}
                >
                  {categoryInfo.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-4">
          <p className="text-muted-foreground text-sm">
            Menampilkan <span className="text-foreground font-semibold">{filteredNews.length}</span> berita
          </p>
        </div>

        {filteredNews.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">Tidak ada berita ditemukan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((item) => {
              const categoryInfo = getCategoryLabel(item.category);
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(`/news/${item.slug}`)}
                  className="w-full text-left"
                >
                  <Card className="border-blue-100 transition-all hover:scale-[1.02] hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden rounded-t-2xl">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                        <div className="absolute top-3 right-3">
                          <div className={`rounded-full px-3 py-1 ${categoryInfo.color}`}>
                            <p className="text-xs font-semibold">{categoryInfo.label}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-foreground mb-2 text-lg font-bold leading-tight line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                          {item.excerpt}
                        </p>

                        <div className="flex items-center justify-between border-t border-blue-100 pt-3">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>{item.author_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{formatDate(item.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye size={14} />
                            <span>{formatViewCount(item.views_count)}</span>
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

      <BottomNavigation unreadCount={0} />
    </div>
  );
}