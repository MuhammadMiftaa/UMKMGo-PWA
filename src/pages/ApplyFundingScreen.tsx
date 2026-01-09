import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
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
  DollarSign,
  Send,
} from "lucide-react";
import { useProgram } from "../contexts/ProgramContext";
import { useAuth } from "../contexts/AuthContext";
import { useProfile, type UserDocument } from "../contexts/ProfileContext";

interface FormData {
  business_sector: string;
  business_description: string;
  years_operating: string;
  requested_amount: string;
  fund_purpose: string;
  business_plan: string;
  revenue_projection: string;
  monthly_revenue: string;
  requested_tenure_months: string;
  collateral_description: string;
}

interface Documents {
  ktp: File | null;
  nib: File | null;
  npwp: File | null;
  rekening: File | null;
  proposal: File | null;
  laporan_keuangan: File | null;
  dokumen_agunan: File | null;
}

export default function ApplyFundingScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { applyFunding } = useProgram();
  const { user } = useAuth();
  const { getDocuments } = useProfile();
  const [loading, setLoading] = useState(false);
  const [profileDocuments, setProfileDocuments] = useState<UserDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    business_sector: "",
    business_description: "",
    years_operating: "",
    requested_amount: "",
    fund_purpose: "",
    business_plan: "",
    revenue_projection: "",
    monthly_revenue: "",
    requested_tenure_months: "",
    collateral_description: "",
  });
  const [documents, setDocuments] = useState<Documents>({
    ktp: null,
    nib: null,
    npwp: null,
    rekening: null,
    proposal: null,
    laporan_keuangan: null,
    dokumen_agunan: null,
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

  const businessSectors = [
    "Kuliner & F&B",
    "Fashion & Pakaian",
    "Kerajinan Tangan",
    "Teknologi & Digital",
    "Perdagangan/Retail",
    "Jasa",
    "Pertanian & Perikanan",
    "Industri Kreatif",
    "Lainnya",
  ];

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
    type: keyof Documents,
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

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(number));
  };

  const handleCurrencyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData,
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Validasi required fields
      if (!formData.business_sector) {
        setError("Sektor usaha harus diisi");
        setLoading(false);
        return;
      }

      if (!formData.business_description.trim()) {
        setError("Deskripsi usaha harus diisi");
        setLoading(false);
        return;
      }

      if (!formData.requested_amount) {
        setError("Jumlah dana yang diajukan harus diisi");
        setLoading(false);
        return;
      }

      if (!formData.fund_purpose.trim()) {
        setError("Tujuan penggunaan dana harus diisi");
        setLoading(false);
        return;
      }

      if (!formData.requested_tenure_months) {
        setError("Tenor/jangka waktu harus diisi");
        setLoading(false);
        return;
      }

      // Check if documents are available (either uploaded or from profile)
      const docMapping: {
        key: keyof Documents;
        profileType: string;
        label: string;
      }[] = [
        { key: "ktp", profileType: "ktp", label: "KTP" },
        { key: "nib", profileType: "nib", label: "NIB" },
        { key: "npwp", profileType: "npwp", label: "NPWP" },
        { key: "rekening", profileType: "rekening", label: "Rekening" },
        { key: "proposal", profileType: "proposal", label: "Proposal" },
        {
          key: "laporan_keuangan",
          profileType: "revenue_record",
          label: "Laporan Keuangan",
        },
      ];

      const missingDocs = docMapping.filter(
        (doc) => !documents[doc.key] && !getProfileDocUrl(doc.profileType),
      );

      if (missingDocs.length > 0) {
        setError(
          `Dokumen wajib belum lengkap: ${missingDocs.map((d) => d.label).join(", ")}`,
        );
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
      const rekeningBase64 = documents.rekening
        ? await fileToBase64(documents.rekening)
        : getProfileDocUrl("rekening") || undefined;
      const proposalBase64 = documents.proposal
        ? await fileToBase64(documents.proposal)
        : getProfileDocUrl("proposal") || undefined;
      const financialRecordsBase64 = documents.laporan_keuangan
        ? await fileToBase64(documents.laporan_keuangan)
        : getProfileDocUrl("revenue_record") || undefined;
      const dokumenAgunanBase64 = documents.dokumen_agunan
        ? await fileToBase64(documents.dokumen_agunan)
        : undefined;

      // Submit to API
      await applyFunding({
        program_id: parseInt(id || "0"),
        business_sector: formData.business_sector,
        business_description: formData.business_description,
        years_operating: parseInt(formData.years_operating) || 0,
        requested_amount: parseInt(formData.requested_amount) || 0,
        fund_purpose: formData.fund_purpose,
        business_plan: formData.business_plan,
        revenue_projection: parseInt(formData.revenue_projection) || 0,
        monthly_revenue: parseInt(formData.monthly_revenue) || 0,
        requested_tenure_months:
          parseInt(formData.requested_tenure_months) || 0,
        collateral_description: formData.collateral_description,
        documents: {
          ktp: ktpBase64!,
          nib: nibBase64!,
          npwp: npwpBase64!,
          rekening: rekeningBase64!,
          proposal: proposalBase64!,
          financial_records: financialRecordsBase64!,
          dokumen_agunan: dokumenAgunanBase64,
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
          <h1 className="text-3xl font-bold text-white">Pengajuan Pendanaan</h1>
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

          {/* Data Pribadi */}
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

          {/* Data Usaha */}
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

          {/* Informasi Usaha */}
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
                    className="border-border focus:border-primary focus:ring-primary/10 flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                    required
                  >
                    <option value="">Pilih Sektor Usaha</option>
                    {businessSectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_description">
                    Deskripsi Usaha <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="business_description"
                    name="business_description"
                    value={formData.business_description}
                    onChange={handleInputChange}
                    placeholder="Jelaskan usaha Anda secara detail..."
                    rows={4}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years_operating">
                    Lama Usaha Berjalan (Tahun)
                  </Label>
                  <Input
                    id="years_operating"
                    name="years_operating"
                    type="number"
                    value={formData.years_operating}
                    onChange={handleInputChange}
                    placeholder="Contoh: 2"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_revenue">
                    Omzet Bulanan Saat Ini
                  </Label>
                  <div className="relative">
                    <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2">
                      Rp
                    </span>
                    <Input
                      id="monthly_revenue"
                      name="monthly_revenue"
                      value={formatCurrency(formData.monthly_revenue)}
                      onChange={(e) =>
                        handleCurrencyChange(e, "monthly_revenue")
                      }
                      placeholder="0"
                      className="pl-12"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pengajuan Pendanaan */}
          <Card className="border-blue-100">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-primary" />
                <h2 className="text-foreground font-bold">
                  Pengajuan Pendanaan
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="requested_amount">
                    Jumlah Dana yang Diajukan{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2">
                      Rp
                    </span>
                    <Input
                      id="requested_amount"
                      name="requested_amount"
                      value={formatCurrency(formData.requested_amount)}
                      onChange={(e) =>
                        handleCurrencyChange(e, "requested_amount")
                      }
                      placeholder="0"
                      className="pl-12"
                      required
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Masukkan jumlah dana yang Anda butuhkan
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requested_tenure_months">
                    Tenor/Jangka Waktu (Bulan){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="requested_tenure_months"
                    name="requested_tenure_months"
                    value={formData.requested_tenure_months}
                    onChange={handleInputChange}
                    className="border-border focus:border-primary focus:ring-primary/10 flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                    required
                  >
                    <option value="">Pilih Tenor</option>
                    <option value="6">6 Bulan</option>
                    <option value="12">12 Bulan</option>
                    <option value="18">18 Bulan</option>
                    <option value="24">24 Bulan</option>
                    <option value="36">36 Bulan</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund_purpose">
                    Tujuan Penggunaan Dana{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="fund_purpose"
                    name="fund_purpose"
                    value={formData.fund_purpose}
                    onChange={handleInputChange}
                    placeholder="Jelaskan secara detail untuk apa dana akan digunakan..."
                    rows={4}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_plan">
                    Rencana Bisnis/Pengembangan
                  </Label>
                  <textarea
                    id="business_plan"
                    name="business_plan"
                    value={formData.business_plan}
                    onChange={handleInputChange}
                    placeholder="Rencana pengembangan usaha setelah menerima pendanaan..."
                    rows={3}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue_projection">
                    Proyeksi Omzet Setelah Pendanaan
                  </Label>
                  <div className="relative">
                    <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2">
                      Rp
                    </span>
                    <Input
                      id="revenue_projection"
                      name="revenue_projection"
                      value={formatCurrency(formData.revenue_projection)}
                      onChange={(e) =>
                        handleCurrencyChange(e, "revenue_projection")
                      }
                      placeholder="0"
                      className="pl-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collateral_description">
                    Deskripsi Agunan/Jaminan (Opsional)
                  </Label>
                  <textarea
                    id="collateral_description"
                    name="collateral_description"
                    value={formData.collateral_description}
                    onChange={handleInputChange}
                    placeholder="Jika ada agunan, jelaskan di sini..."
                    rows={2}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Dokumen */}
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
                  {/* KTP */}
                  <div className="space-y-2">
                    <Label>
                      KTP <span className="text-red-500">*</span>
                    </Label>
                    <FileUploadBox
                      id="ktp"
                      file={documents.ktp}
                      onChange={(e) => handleFileChange(e, "ktp")}
                      label="Pilih file KTP"
                      color="blue"
                      profileDocUrl={getProfileDocUrl("ktp")}
                      getFilenameFromUrl={getFilenameFromUrl}
                    />
                  </div>

                  {/* NIB */}
                  <div className="space-y-2">
                    <Label>
                      NIB <span className="text-red-500">*</span>
                    </Label>
                    <FileUploadBox
                      id="nib"
                      file={documents.nib}
                      onChange={(e) => handleFileChange(e, "nib")}
                      label="Pilih file NIB"
                      color="purple"
                      profileDocUrl={getProfileDocUrl("nib")}
                      getFilenameFromUrl={getFilenameFromUrl}
                    />
                  </div>

                  {/* NPWP */}
                  <div className="space-y-2">
                    <Label>
                      NPWP <span className="text-red-500">*</span>
                    </Label>
                    <FileUploadBox
                      id="npwp"
                      file={documents.npwp}
                      onChange={(e) => handleFileChange(e, "npwp")}
                      label="Pilih file NPWP"
                      color="indigo"
                      profileDocUrl={getProfileDocUrl("npwp")}
                      getFilenameFromUrl={getFilenameFromUrl}
                    />
                  </div>

                  {/* Rekening Bank */}
                  <div className="space-y-2">
                    <Label>
                      Rekening Bank / Mutasi 3-6 Bulan{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <FileUploadBox
                      id="rekening"
                      file={documents.rekening}
                      onChange={(e) => handleFileChange(e, "rekening")}
                      label="Pilih file rekening"
                      color="cyan"
                      profileDocUrl={getProfileDocUrl("rekening")}
                      getFilenameFromUrl={getFilenameFromUrl}
                    />
                  </div>

                  {/* Proposal Bisnis */}
                  <div className="space-y-2">
                    <Label>
                      Proposal Bisnis <span className="text-red-500">*</span>
                    </Label>
                    <FileUploadBox
                      id="proposal"
                      file={documents.proposal}
                      onChange={(e) => handleFileChange(e, "proposal")}
                      label="Pilih file proposal"
                      color="green"
                      profileDocUrl={getProfileDocUrl("proposal")}
                      getFilenameFromUrl={getFilenameFromUrl}
                    />
                  </div>

                  {/* Laporan Keuangan */}
                  <div className="space-y-2">
                    <Label>
                      Laporan Keuangan / Catatan Omzet{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <FileUploadBox
                      id="laporan_keuangan"
                      file={documents.laporan_keuangan}
                      onChange={(e) => handleFileChange(e, "laporan_keuangan")}
                      label="Pilih file laporan keuangan"
                      color="amber"
                      profileDocUrl={getProfileDocUrl("revenue_record")}
                      getFilenameFromUrl={getFilenameFromUrl}
                    />
                  </div>

                  {/* Dokumen Agunan */}
                  <div className="space-y-2">
                    <Label>Dokumen Agunan (Opsional)</Label>
                    <FileUploadBox
                      id="dokumen_agunan"
                      file={documents.dokumen_agunan}
                      onChange={(e) => handleFileChange(e, "dokumen_agunan")}
                      label="Pilih file agunan"
                      color="orange"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-foreground text-sm font-semibold">
                    Perhatian
                  </p>
                  <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-4 text-xs">
                    <li>
                      Pastikan semua dokumen yang diunggah jelas dan dapat
                      dibaca
                    </li>
                    <li>Format file: JPG, PNG, atau PDF (Max 5MB per file)</li>
                    <li>Verifikasi akan dilakukan dalam 3-5 hari kerja</li>
                    <li>Dana akan dicairkan setelah pengajuan disetujui</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
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
              Pastikan semua data dan dokumen yang Anda masukkan sudah benar
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
        title="Kirim Pengajuan Pendanaan"
        message="Pastikan semua data dan dokumen yang Anda masukkan sudah benar. Pengajuan yang sudah dikirim tidak dapat diubah."
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
        message="Pengajuan pendanaan Anda sedang diproses. Anda akan diarahkan ke halaman aktivitas."
        duration={3000}
      />
    </div>
  );
}

// File Upload Component
interface FileUploadBoxProps {
  id: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  color: string;
  profileDocUrl?: string | null;
  getFilenameFromUrl?: (url: string) => string;
}

function FileUploadBox({
  id,
  file,
  onChange,
  label,
  color,
  profileDocUrl,
  getFilenameFromUrl,
}: FileUploadBoxProps) {
  const hasFile = !!file;
  const hasProfileDoc = !!profileDocUrl;

  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-100" },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      icon: "bg-purple-100",
    },
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      icon: "bg-indigo-100",
    },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-600", icon: "bg-cyan-100" },
    green: { bg: "bg-green-50", text: "text-green-600", icon: "bg-green-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "bg-amber-100" },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      icon: "bg-orange-100",
    },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="relative">
      <input
        id={id}
        type="file"
        accept="image/*,.pdf"
        onChange={onChange}
        className="hidden"
      />
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-center justify-between rounded-xl border-2 border-dashed p-4 transition-all ${
          hasFile || hasProfileDoc
            ? "border-green-300 bg-green-50/50 hover:border-green-400"
            : `border-border ${colors.bg} hover:border-primary hover:bg-opacity-70`
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`rounded-xl ${colors.icon} p-2`}>
            <Upload size={20} className={colors.text} />
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">
              {hasFile
                ? file!.name
                : hasProfileDoc && getFilenameFromUrl
                  ? `Dari Profil: ${getFilenameFromUrl(profileDocUrl!)}`
                  : label}
            </p>
            <p className="text-muted-foreground text-xs">
              {hasFile
                ? "File baru dipilih"
                : hasProfileDoc
                  ? "Klik untuk mengganti dengan file baru"
                  : "Format: JPG, PNG, PDF (Max 5MB)"}
            </p>
          </div>
        </div>
        {(hasFile || hasProfileDoc) && (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        )}
      </label>
    </div>
  );
}
