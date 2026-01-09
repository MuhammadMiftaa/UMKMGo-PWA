import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { Card, CardContent } from "../components/ui/Card";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  FileText,
  User,
  Briefcase,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useProgram } from "../contexts/ProgramContext";
import { useAuth } from "../contexts/AuthContext";
import { useProfile, type UserDocument } from "../contexts/ProfileContext";

interface FormData {
  motivation: string;
  business_experience: string;
  learning_objectives: string;
  availability_notes: string;
}

export default function ApplyTrainingScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { applyTraining } = useProgram();
  const { user } = useAuth();
  const { getDocuments } = useProfile();
  const [loading, setLoading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [profileDocs, setProfileDocs] = useState<UserDocument[]>([]);
  const [formData, setFormData] = useState<FormData>({
    motivation: "",
    business_experience: "",
    learning_objectives: "",
    availability_notes: "",
  });
  const [documents, setDocuments] = useState({
    ktp: null as File | null,
    portfolio: null as File | null,
  });
  const [error, setError] = useState("");

  // Fetch profile documents on mount
  useEffect(() => {
    const fetchDocs = async () => {
      setLoadingDocs(true);
      try {
        const docs = await getDocuments();
        setProfileDocs(docs);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDocs();
  }, []);

  // Helper to get profile document URL by type
  const getProfileDocUrl = (type: string): string | null => {
    const doc = profileDocs.find((d) => d.document_type === type);
    return doc?.document_url || null;
  };

  // Helper to get filename from URL
  const getFilenameFromUrl = (url: string): string => {
    const parts = url.split("/");
    return parts[parts.length - 1] || "Dokumen dari profil";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "ktp" | "portfolio",
  ) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments((prev) => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (!formData.motivation.trim()) {
        setError("Motivasi harus diisi");
        setLoading(false);
        return;
      }

      // Check if KTP is available (either from file or profile)
      const profileKtpUrl = getProfileDocUrl("ktp");
      if (!documents.ktp && !profileKtpUrl) {
        setError("Dokumen KTP harus diupload");
        setLoading(false);
        return;
      }

      // Convert files to base64 or use profile URL
      let ktpBase64: string;
      if (documents.ktp) {
        ktpBase64 = await fileToBase64(documents.ktp);
      } else {
        ktpBase64 = profileKtpUrl!; // Use profile URL
      }

      let portfolioBase64: string | undefined;
      const profilePortfolioUrl = getProfileDocUrl("portfolio");
      if (documents.portfolio) {
        portfolioBase64 = await fileToBase64(documents.portfolio);
      } else if (profilePortfolioUrl) {
        portfolioBase64 = profilePortfolioUrl;
      }

      // Submit to API
      await applyTraining({
        program_id: parseInt(id || "0"),
        motivation: formData.motivation,
        business_experience: formData.business_experience,
        learning_objectives: formData.learning_objectives,
        availability_notes: formData.availability_notes,
        documents: {
          ktp: ktpBase64,
          portfolio: portfolioBase64,
        },
      });

      alert("Pengajuan pelatihan berhasil dikirim!");
      navigate("/activity");
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(err instanceof Error ? err.message : "Gagal mengirim pengajuan");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground mt-4">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-24">
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <button
          onClick={() => navigate(-1)}
          className="relative z-10 mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white">Pengajuan Pelatihan</h1>
          <p className="mt-2 text-white/80">Lengkapi data pengajuan Anda</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="space-y-6">
          {error && (
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-blue-100">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <User size={20} className="text-primary" />
                <h2 className="text-foreground font-bold">Data Pribadi</h2>
                <span className="text-muted-foreground ml-auto text-xs">
                  (Otomatis dari profil)
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">
                    Nama Lengkap
                  </span>
                  <span className="text-foreground text-sm font-semibold">
                    {user.name}
                  </span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">Email</span>
                  <span className="text-foreground text-sm font-semibold">
                    {user.email || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Nomor Telepon
                  </span>
                  <span className="text-foreground text-sm font-semibold">
                    +62{user.phone || "-"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-primary" />
                <h2 className="text-foreground font-bold">Data Usaha</h2>
                <span className="text-muted-foreground ml-auto text-xs">
                  (Otomatis dari profil)
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">
                    Nama Usaha
                  </span>
                  <span className="text-foreground text-sm font-semibold">
                    {user.business_name || "-"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">
                    Kartu UMKM
                  </span>
                  <span className="text-foreground text-sm font-semibold">
                    {user.kartu_type === "afirmatif"
                      ? "Kartu Afirmatif"
                      : user.kartu_type === "produktif"
                        ? "Kartu Produktif"
                        : "-"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                <h2 className="text-foreground font-bold">
                  Informasi Tambahan
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="motivation">
                    Motivasi Mengikuti Pelatihan{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    placeholder="Jelaskan motivasi Anda mengikuti pelatihan ini..."
                    rows={4}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_experience">
                    Pengalaman Menjalankan Usaha
                  </Label>
                  <textarea
                    id="business_experience"
                    name="business_experience"
                    value={formData.business_experience}
                    onChange={handleInputChange}
                    placeholder="Ceritakan pengalaman Anda dalam menjalankan usaha..."
                    rows={3}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learning_objectives">
                    Target/Tujuan Pembelajaran
                  </Label>
                  <textarea
                    id="learning_objectives"
                    name="learning_objectives"
                    value={formData.learning_objectives}
                    onChange={handleInputChange}
                    placeholder="Apa yang ingin Anda capai dari pelatihan ini..."
                    rows={3}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability_notes">
                    Catatan Ketersediaan Waktu
                  </Label>
                  <textarea
                    id="availability_notes"
                    name="availability_notes"
                    value={formData.availability_notes}
                    onChange={handleInputChange}
                    placeholder="Informasi terkait ketersediaan waktu Anda..."
                    rows={2}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Upload size={20} className="text-primary" />
                <h2 className="text-foreground font-bold">Upload Dokumen</h2>
              </div>

              {loadingDocs ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="text-primary h-6 w-6 animate-spin" />
                  <span className="text-muted-foreground ml-2 text-sm">
                    Memuat dokumen...
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>
                      KTP <span className="text-red-500">*</span>
                    </Label>
                    {/* Show profile document if available */}
                    {getProfileDocUrl("ktp") && !documents.ktp && (
                      <div className="mb-2 flex items-center gap-2 rounded-lg bg-green-50 p-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-green-700">
                          Menggunakan dokumen dari profil:{" "}
                          <span className="font-medium">
                            {getFilenameFromUrl(getProfileDocUrl("ktp")!)}
                          </span>
                        </span>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        id="ktp"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, "ktp")}
                        className="hidden"
                      />
                      <label
                        htmlFor="ktp"
                        className="border-border hover:border-primary flex cursor-pointer items-center justify-between rounded-xl border-2 border-dashed bg-blue-50/30 p-4 transition-all hover:bg-blue-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-blue-100 p-2">
                            <Upload size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-foreground text-sm font-semibold">
                              {documents.ktp
                                ? documents.ktp.name
                                : getProfileDocUrl("ktp")
                                  ? "Ganti file KTP"
                                  : "Pilih file KTP"}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Format: JPG, PNG, PDF (Max 2MB)
                            </p>
                          </div>
                        </div>
                        {(documents.ktp || getProfileDocUrl("ktp")) && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Portfolio Usaha/Produk (Opsional)</Label>
                    {/* Show profile document if available */}
                    {getProfileDocUrl("portfolio") && !documents.portfolio && (
                      <div className="mb-2 flex items-center gap-2 rounded-lg bg-green-50 p-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-green-700">
                          Menggunakan dokumen dari profil:{" "}
                          <span className="font-medium">
                            {getFilenameFromUrl(getProfileDocUrl("portfolio")!)}
                          </span>
                        </span>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        id="portfolio"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, "portfolio")}
                        className="hidden"
                      />
                      <label
                        htmlFor="portfolio"
                        className="border-border hover:border-primary flex cursor-pointer items-center justify-between rounded-xl border-2 border-dashed bg-blue-50/30 p-4 transition-all hover:bg-blue-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-green-100 p-2">
                            <Upload size={20} className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-foreground text-sm font-semibold">
                              {documents.portfolio
                                ? documents.portfolio.name
                                : getProfileDocUrl("portfolio")
                                  ? "Ganti file portfolio"
                                  : "Pilih file portfolio"}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Format: JPG, PNG, PDF (Max 5MB)
                            </p>
                          </div>
                        </div>
                        {(documents.portfolio ||
                          getProfileDocUrl("portfolio")) && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  <span>Kirim Pengajuan</span>
                </>
              )}
            </Button>
            <p className="text-muted-foreground text-center text-xs">
              Pastikan semua data yang Anda masukkan sudah benar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
