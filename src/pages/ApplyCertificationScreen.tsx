import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { Card, CardContent } from "../components/ui/Card";
import { ConfirmModal } from "../components/ui/Modal";
import { Alert } from "../components/ui/Alert";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  FileText,
  User,
  Briefcase,
  AlertCircle,
  Award,
  Send,
} from "lucide-react";
import { useProgram } from "../contexts/ProgramContext";
import { useAuth } from "../contexts/AuthContext";
import { useProfile, type UserDocument } from "../contexts/ProfileContext";

interface FormData {
  business_sector: string;
  product_or_service: string;
  business_description: string;
  years_operating: string;
  current_standards: string;
  certification_goals: string;
}

export default function ApplyCertificationScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { applyCertification } = useProgram();
  const { user } = useAuth();
  const { getDocuments } = useProfile();
  const [loading, setLoading] = useState(false);
  const [profileDocuments, setProfileDocuments] = useState<UserDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    business_sector: "",
    product_or_service: "",
    business_description: "",
    years_operating: "",
    current_standards: "",
    certification_goals: "",
  });
  const [documents, setDocuments] = useState({
    ktp: null as File | null,
    nib: null as File | null,
    npwp: null as File | null,
    portfolio: null as File | null,
    izin_usaha: null as File | null,
  });
  const [error, setError] = useState("");

  // Modal & Alert states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Load profile documents on mount
  useEffect(() => {
    const loadProfileDocuments = async () => {
      try {
        const docs = await getDocuments();
        setProfileDocuments(docs);
      } catch (err) {
        console.error("Error loading profile documents:", err);
      } finally {
        setLoadingDocs(false);
      }
    };
    loadProfileDocuments();
  }, []);

  // Helper to get profile document URL by type
  const getProfileDocUrl = (type: string): string | null => {
    const doc = profileDocuments.find((d) => d.document_type === type);
    return doc?.document_url || null;
  };

  // Helper to extract filename from URL
  const getFilenameFromUrl = (url: string): string => {
    try {
      const pathname = new URL(url).pathname;
      return pathname.split("/").pop() || "Dokumen dari Profil";
    } catch {
      return "Dokumen dari Profil";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof typeof documents,
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
      if (!formData.business_sector.trim()) {
        setError("Sektor usaha harus diisi");
        setLoading(false);
        return;
      }

      if (!formData.product_or_service.trim()) {
        setError("Produk/layanan yang akan disertifikasi harus diisi");
        setLoading(false);
        return;
      }

      if (!formData.business_description.trim()) {
        setError("Deskripsi usaha harus diisi");
        setLoading(false);
        return;
      }

      if (!formData.certification_goals.trim()) {
        setError("Tujuan sertifikasi harus diisi");
        setLoading(false);
        return;
      }

      // Check if documents are available (either uploaded or from profile)
      const hasKtp = documents.ktp || getProfileDocUrl("ktp");
      const hasNib = documents.nib || getProfileDocUrl("nib");
      const hasNpwp = documents.npwp || getProfileDocUrl("npwp");
      const hasPortfolio = documents.portfolio || getProfileDocUrl("portfolio");

      if (!hasKtp || !hasNib || !hasNpwp || !hasPortfolio) {
        setError("Semua dokumen wajib harus diupload");
        setLoading(false);
        return;
      }

      // Convert files to base64 or use profile document URL
      const ktpBase64 = documents.ktp
        ? await fileToBase64(documents.ktp)
        : getProfileDocUrl("ktp") || undefined;
      const nibBase64 = documents.nib
        ? await fileToBase64(documents.nib)
        : getProfileDocUrl("nib") || undefined;
      const npwpBase64 = documents.npwp
        ? await fileToBase64(documents.npwp)
        : getProfileDocUrl("npwp") || undefined;
      const portfolioBase64 = documents.portfolio
        ? await fileToBase64(documents.portfolio)
        : getProfileDocUrl("portfolio") || undefined;
      const izinUsahaBase64 = documents.izin_usaha
        ? await fileToBase64(documents.izin_usaha)
        : getProfileDocUrl("business_permit") || undefined;

      // Submit to API
      await applyCertification({
        program_id: parseInt(id || "0"),
        business_sector: formData.business_sector,
        product_or_service: formData.product_or_service,
        business_description: formData.business_description,
        years_operating: parseInt(formData.years_operating) || 0,
        current_standards: formData.current_standards,
        certification_goals: formData.certification_goals,
        documents: {
          ktp: ktpBase64!,
          nib: nibBase64!,
          npwp: npwpBase64!,
          portfolio: portfolioBase64!,
          izin_usaha: izinUsahaBase64,
        },
      });

      setShowSuccessAlert(true);
      setTimeout(() => {
        navigate("/activity");
      }, 2000);
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
          <h1 className="text-3xl font-bold text-white">
            Pengajuan Sertifikasi
          </h1>
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
                <div className="flex justify-between">
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
                <h2 className="text-foreground font-bold">Informasi Usaha</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business_sector">
                    Sektor Usaha <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="business_sector"
                    name="business_sector"
                    value={formData.business_sector}
                    onChange={handleInputChange}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  >
                    <option value="">Pilih Sektor Usaha</option>
                    <option value="F&B">Food & Beverage</option>
                    <option value="Fashion">Fashion & Apparel</option>
                    <option value="Craft">Kerajinan Tangan</option>
                    <option value="Agriculture">Pertanian & Perkebunan</option>
                    <option value="Services">Jasa</option>
                    <option value="Technology">Teknologi</option>
                    <option value="Other">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_or_service">
                    Produk/Layanan yang Akan Disertifikasi{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="product_or_service"
                    name="product_or_service"
                    value={formData.product_or_service}
                    onChange={handleInputChange}
                    placeholder="Contoh: Makanan Ringan Keripik Singkong"
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_description">
                    Deskripsi Lengkap Usaha{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="business_description"
                    name="business_description"
                    value={formData.business_description}
                    onChange={handleInputChange}
                    placeholder="Jelaskan usaha Anda secara detail, proses produksi, dan target pasar..."
                    rows={4}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years_operating">
                    Lama Usaha Berjalan (Tahun)
                  </Label>
                  <input
                    id="years_operating"
                    name="years_operating"
                    type="number"
                    value={formData.years_operating}
                    onChange={handleInputChange}
                    placeholder="Contoh: 2"
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current_standards">
                    Standar/Prosedur yang Sudah Diterapkan
                  </Label>
                  <textarea
                    id="current_standards"
                    name="current_standards"
                    value={formData.current_standards}
                    onChange={handleInputChange}
                    placeholder="Jelaskan standar atau prosedur yang sudah diterapkan saat ini..."
                    rows={3}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Award size={20} className="text-primary" />
                <h2 className="text-foreground font-bold">
                  Tujuan Sertifikasi
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certification_goals">
                    Tujuan Mendapatkan Sertifikasi{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="certification_goals"
                    name="certification_goals"
                    value={formData.certification_goals}
                    onChange={handleInputChange}
                    placeholder="Jelaskan tujuan dan target yang ingin dicapai dengan mendapatkan sertifikasi ini..."
                    rows={4}
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
                  <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
                  <span className="text-muted-foreground ml-2 text-sm">
                    Memuat dokumen dari profil...
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    {
                      id: "ktp",
                      profileType: "ktp",
                      label: "KTP",
                      required: true,
                      color: "blue",
                    },
                    {
                      id: "nib",
                      profileType: "nib",
                      label: "NIB",
                      required: true,
                      color: "green",
                    },
                    {
                      id: "npwp",
                      profileType: "npwp",
                      label: "NPWP",
                      required: true,
                      color: "purple",
                    },
                    {
                      id: "portfolio",
                      profileType: "portfolio",
                      label: "Portfolio Produk/Layanan",
                      required: true,
                      color: "orange",
                    },
                    {
                      id: "izin_usaha",
                      profileType: "business_permit",
                      label: "Izin Usaha Lainnya",
                      required: false,
                      color: "gray",
                    },
                  ].map((doc) => {
                    const profileDocUrl = getProfileDocUrl(doc.profileType);
                    const hasFile = documents[doc.id as keyof typeof documents];
                    const hasProfileDoc = !!profileDocUrl;

                    return (
                      <div key={doc.id} className="space-y-2">
                        <Label>
                          {doc.label}{" "}
                          {doc.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        <div className="relative">
                          <input
                            id={doc.id}
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                doc.id as keyof typeof documents,
                              )
                            }
                            className="hidden"
                          />
                          <label
                            htmlFor={doc.id}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border-2 border-dashed p-4 transition-all ${
                              hasFile || hasProfileDoc
                                ? "border-green-300 bg-green-50/50 hover:border-green-400"
                                : "border-border hover:border-primary bg-blue-50/30 hover:bg-blue-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`rounded-xl bg-${doc.color}-100 p-2`}
                              >
                                <Upload
                                  size={20}
                                  className={`text-${doc.color}-600`}
                                />
                              </div>
                              <div>
                                <p className="text-foreground text-sm font-semibold">
                                  {hasFile
                                    ? hasFile.name
                                    : hasProfileDoc
                                      ? `Dari Profil: ${getFilenameFromUrl(profileDocUrl!)}`
                                      : `Pilih file ${doc.label}`}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {hasFile
                                    ? "File baru dipilih"
                                    : hasProfileDoc
                                      ? "Klik untuk mengganti dengan file baru"
                                      : `Format: JPG, PNG, PDF (Max ${doc.id === "portfolio" ? "5MB" : "2MB"})`}
                                </p>
                              </div>
                            </div>
                            {(hasFile || hasProfileDoc) && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={() => setShowConfirmModal(true)}
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

      {/* Confirm Submit Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          handleSubmit();
        }}
        title="Kirim Pengajuan"
        message="Pastikan semua data yang Anda masukkan sudah benar. Pengajuan yang sudah dikirim tidak dapat diubah."
        confirmText="Ya, Kirim"
        cancelText="Periksa Lagi"
        variant="info"
        icon={<Send size={24} />}
        isLoading={loading}
      />

      {/* Success Alert */}
      <Alert
        isOpen={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        type="success"
        title="Pengajuan Berhasil Dikirim"
        message="Pengajuan sertifikasi Anda sedang diproses. Anda akan diarahkan ke halaman aktivitas."
        duration={3000}
      />
    </div>
  );
}
