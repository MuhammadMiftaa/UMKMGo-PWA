import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  ArrowLeft,
  Eye,
  Calendar,
  User,
  Tag,
  Clock,
} from "lucide-react";

interface NewsDetail {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  category: string;
  author_name: string;
  views_count: number;
  created_at: string;
  tags: string[];
}

export default function NewsDetailScreen() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
//   const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchNewsDetail();
  }, [slug]);

  const fetchNewsDetail = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/mobile/news/${slug}`);
      // const data = await response.json();

      // Mock data for now
      const mockNewsDetail: NewsDetail = {
        id: 2,
        title: "Expo UMKM Jakarta 2025 - Pameran Produk Lokal Terbesar",
        slug: "expo-umkm-jakarta-2025-pameran-produk-lokal-terbesar",
        content:
          "<h2>Expo UMKM Jakarta 2025</h2><p>Kami mengundang seluruh pelaku UMKM untuk berpartisipasi dalam Expo UMKM Jakarta 2025, pameran produk lokal terbesar yang akan diselenggarakan di Jakarta Convention Center.</p><h3>Detail Event</h3><ul><li><strong>Tanggal:</strong> 15-17 Maret 2025</li><li><strong>Waktu:</strong> 09:00 - 21:00 WIB</li><li><strong>Lokasi:</strong> Jakarta Convention Center, Hall A-C</li><li><strong>Tema:</strong> Produk Lokal Go Global</li></ul><h3>Fasilitas untuk Peserta</h3><p>Setiap peserta akan mendapatkan:</p><ol><li>Booth pameran ukuran 3x3 meter</li><li>Branding dan promosi online</li><li>Kesempatan networking dengan buyer</li><li>Media coverage</li><li>Sertifikat keikutsertaan</li></ol><h3>Cara Mendaftar</h3><p>Pendaftaran dibuka hingga 1 Maret 2025. Hubungi kami di expo@umkm.go.id atau WhatsApp 0812-3456-7890.</p>",
        thumbnail:
          "http://127.0.0.1:9000/umkmgo-programs/expo_umkm_jakarta_2025_-_pameran_produk_lokal_terbesar/news_thumbnail___1764337504.png",
        category: "event",
        author_name: "Super Admin",
        views_count: 1,
        created_at: "2025-11-28 20:45:04",
        tags: ["expo", "pameran", "umkm", "jakarta", "2025"],
      };

      setNews(mockNewsDetail);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news detail:", error);
      setLoading(false);
    }
  };

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
      month: "long",
      year: "numeric",
    });
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, "");
    const wordCount = textContent.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

//   const handleShare = async () => {
//     if (navigator.share && news) {
//       try {
//         await navigator.share({
//           title: news.title,
//           text: news.title,
//           url: window.location.href,
//         });
//       } catch (error) {
//         console.log("Error sharing:", error);
//       }
//     }
//   };

//   const handleBookmark = () => {
//     setIsBookmarked(!isBookmarked);
//     // Save to localStorage or API
//   };

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

  if (!news) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-muted-foreground">Berita tidak ditemukan</p>
          <Button onClick={() => navigate("/news")} className="mt-4">
            Kembali ke Daftar Berita
          </Button>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryLabel(news.category);
  const readTime = calculateReadTime(news.content);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-primary flex items-center gap-2 text-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          {/* <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-9 w-9 p-0"
            >
              <Share2 size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className="h-9 w-9 p-0"
            >
              <Bookmark
                size={18}
                className={isBookmarked ? "fill-primary text-primary" : ""}
              />
            </Button>
          </div> */}
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={news.thumbnail}
          alt={news.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${categoryInfo.color}`}
          >
            {categoryInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {/* Title */}
        <h1 className="text-foreground mb-4 text-2xl leading-tight font-bold">
          {news.title}
        </h1>

        {/* Meta Info */}
        <div className="text-muted-foreground mb-6 flex flex-wrap items-center gap-4 border-b border-blue-100 pb-4 text-sm">
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{news.author_name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{formatDate(news.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={16} />
            <span>{formatViewCount(news.views_count)} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{readTime} menit baca</span>
          </div>
        </div>

        {/* Article Content */}
        <div
          className="prose prose-blue max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
          style={{
            fontSize: "16px",
            lineHeight: "1.75",
            color: "#374151",
          }}
        />

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="mt-8 border-t border-blue-100 pt-6">
            <div className="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
              <Tag size={16} />
              <span>Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {/* <div className="mt-8 flex gap-3">
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1"
          >
            <Share2 size={18} />
            Bagikan
          </Button>
          <Button
            onClick={handleBookmark}
            variant={isBookmarked ? "default" : "outline"}
            className="flex-1"
          >
            <Bookmark size={18} />
            {isBookmarked ? "Tersimpan" : "Simpan"}
          </Button>
        </div> */}

        {/* Back to List */}
        <div className="mt-6">
          <Button
            onClick={() => navigate("/news")}
            variant="ghost"
            className="w-full"
          >
            Lihat Berita Lainnya
          </Button>
        </div>
      </div>
    </div>
  );
}
