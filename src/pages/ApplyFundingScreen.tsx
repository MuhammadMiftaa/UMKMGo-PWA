import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  FileText,
  User,
  Briefcase,
  AlertCircle,
  DollarSign,
} from "lucide-react";

interface UserData {
  fullname: string;
  business_name: string;
  nik: string;
  gender: string;
  birth_date: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  nib: string;
  npwp: string;
  kartu_type: string;
  kartu_number: string;
  revenue_record: string;
  business_permit: string;
}

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
//   const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
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

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    let data;
    if (stored) {
      data = JSON.parse(stored);
    }
    setUserData({
      fullname: data?.fullname || "Akbar Chalay",
      business_name: data?.businessName || "PT Semua Teman",
      nik: data?.nik || "1234567890987654",
      gender: data?.gender === "male" ? "Laki-laki" : "Perempuan",
      birth_date: data?.birthDate || "2008-08-06",
      phone: data?.phone || "81234567890",
      address: data?.address || "Jl. Ketintang No. 123",
      province: "Jawa Timur",
      city: "Surabaya",
      district: data?.district || "Ketintang",
      postal_code: data?.postalCode || "60210",
      nib: data?.nib || "1234567890123",
      npwp: data?.npwp || "12.345.678.9-012.000",
      kartu_type: data?.kartuType || "Kartu Afirmatif",
      kartu_number: data?.kartuNumber || "1234567890",
      revenue_record: "Rp 50.000.000 - Rp 100.000.000 / bulan",
      business_permit: "Tersedia",
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(number));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormData) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setError("");

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

    // Validasi dokumen required
    const requiredDocs: (keyof Documents)[] = ["ktp", "nib", "npwp", "rekening", "proposal", "laporan_keuangan"];
    const missingDocs = requiredDocs.filter((doc) => !documents[doc]);

    if (missingDocs.length > 0) {
      setError(`Dokumen wajib belum lengkap: ${missingDocs.join(", ")}`);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      alert("Pengajuan pendanaan berhasil dikirim!");
      navigate("/activity");
    }, 1000);
  };

  if (!userData) {
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
                  <span className="text-muted-foreground text-sm">Nama Lengkap</span>
                  <span className="text-foreground text-sm font-semibold">{userData.fullname}</span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">NIK</span>
                  <span className="text-foreground text-sm font-semibold">{userData.nik}</span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">Jenis Kelamin</span>
                  <span className="text-foreground text-sm font-semibold">{userData.gender}</span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">Tanggal Lahir</span>
                  <span className="text-foreground text-sm font-semibold">{userData.birth_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Nomor Telepon</span>
                  <span className="text-foreground text-sm font-semibold">+62{userData.phone}</span>
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
                  <span className="text-muted-foreground text-sm">Nama Usaha</span>
                  <span className="text-foreground text-sm font-semibold">{userData.business_name}</span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">Kartu UMKM</span>
                  <span className="text-foreground text-sm font-semibold">{userData.kartu_type}</span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">Nomor Kartu</span>
                  <span className="text-foreground text-sm font-semibold">{userData.kartu_number}</span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">NIB</span>
                  <span className="text-foreground text-sm font-semibold">{userData.nib}</span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">NPWP</span>
                  <span className="text-foreground text-sm font-semibold">{userData.npwp}</span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-2">
                  <span className="text-muted-foreground text-sm">Catatan Omzet</span>
                  <span className="text-foreground text-sm font-semibold">{userData.revenue_record}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Izin Usaha</span>
                  <span className="text-foreground text-sm font-semibold">{userData.business_permit}</span>
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
                  <Label htmlFor="years_operating">Lama Usaha Berjalan (Tahun)</Label>
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
                  <Label htmlFor="monthly_revenue">Omzet Bulanan Saat Ini</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                    <Input
                      id="monthly_revenue"
                      name="monthly_revenue"
                      value={formatCurrency(formData.monthly_revenue)}
                      onChange={(e) => handleCurrencyChange(e, "monthly_revenue")}
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
                <h2 className="text-foreground font-bold">Pengajuan Pendanaan</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="requested_amount">
                    Jumlah Dana yang Diajukan <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                    <Input
                      id="requested_amount"
                      name="requested_amount"
                      value={formatCurrency(formData.requested_amount)}
                      onChange={(e) => handleCurrencyChange(e, "requested_amount")}
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
                    Tenor/Jangka Waktu (Bulan) <span className="text-red-500">*</span>
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
                    Tujuan Penggunaan Dana <span className="text-red-500">*</span>
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
                  <Label htmlFor="business_plan">Rencana Bisnis/Pengembangan</Label>
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
                  <Label htmlFor="revenue_projection">Proyeksi Omzet Setelah Pendanaan</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                    <Input
                      id="revenue_projection"
                      name="revenue_projection"
                      value={formatCurrency(formData.revenue_projection)}
                      onChange={(e) => handleCurrencyChange(e, "revenue_projection")}
                      placeholder="0"
                      className="pl-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collateral_description">Deskripsi Agunan/Jaminan (Opsional)</Label>
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

              <div className="space-y-4">
                {/* KTP */}
                <div className="space-y-2">
                  <Label>KTP <span className="text-red-500">*</span></Label>
                  <FileUploadBox
                    id="ktp"
                    file={documents.ktp}
                    onChange={(e) => handleFileChange(e, "ktp")}
                    label="Pilih file KTP"
                    color="blue"
                  />
                </div>

                {/* NIB */}
                <div className="space-y-2">
                  <Label>NIB <span className="text-red-500">*</span></Label>
                  <FileUploadBox
                    id="nib"
                    file={documents.nib}
                    onChange={(e) => handleFileChange(e, "nib")}
                    label="Pilih file NIB"
                    color="purple"
                  />
                </div>

                {/* NPWP */}
                <div className="space-y-2">
                  <Label>NPWP <span className="text-red-500">*</span></Label>
                  <FileUploadBox
                    id="npwp"
                    file={documents.npwp}
                    onChange={(e) => handleFileChange(e, "npwp")}
                    label="Pilih file NPWP"
                    color="indigo"
                  />
                </div>

                {/* Rekening Bank */}
                <div className="space-y-2">
                  <Label>Rekening Bank / Mutasi 3-6 Bulan <span className="text-red-500">*</span></Label>
                  <FileUploadBox
                    id="rekening"
                    file={documents.rekening}
                    onChange={(e) => handleFileChange(e, "rekening")}
                    label="Pilih file rekening"
                    color="cyan"
                  />
                </div>

                {/* Proposal Bisnis */}
                <div className="space-y-2">
                  <Label>Proposal Bisnis <span className="text-red-500">*</span></Label>
                  <FileUploadBox
                    id="proposal"
                    file={documents.proposal}
                    onChange={(e) => handleFileChange(e, "proposal")}
                    label="Pilih file proposal"
                    color="green"
                  />
                </div>

                {/* Laporan Keuangan */}
                <div className="space-y-2">
                  <Label>Laporan Keuangan / Catatan Omzet <span className="text-red-500">*</span></Label>
                  <FileUploadBox
                    id="laporan_keuangan"
                    file={documents.laporan_keuangan}
                    onChange={(e) => handleFileChange(e, "laporan_keuangan")}
                    label="Pilih file laporan keuangan"
                    color="amber"
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
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-foreground text-sm font-semibold">Perhatian</p>
                  <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-4 text-xs">
                    <li>Pastikan semua dokumen yang diunggah jelas dan dapat dibaca</li>
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
              Pastikan semua data dan dokumen yang Anda masukkan sudah benar
            </p>
          </div>
        </div>
      </div>
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
}

function FileUploadBox({ id, file, onChange, label, color }: FileUploadBoxProps) {
  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "bg-purple-100" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", icon: "bg-indigo-100" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-600", icon: "bg-cyan-100" },
    green: { bg: "bg-green-50", text: "text-green-600", icon: "bg-green-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "bg-amber-100" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", icon: "bg-orange-100" },
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
        className={`border-border hover:border-primary flex cursor-pointer items-center justify-between rounded-xl border-2 border-dashed ${colors.bg} p-4 transition-all hover:bg-opacity-70`}
      >
        <div className="flex items-center gap-3">
          <div className={`rounded-xl ${colors.icon} p-2`}>
            <Upload size={20} className={colors.text} />
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">
              {file ? file.name : label}
            </p>
            <p className="text-muted-foreground text-xs">
              Format: JPG, PNG, PDF (Max 5MB)
            </p>
          </div>
        </div>
        {file && (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        )}
      </label>
    </div>
  );
}