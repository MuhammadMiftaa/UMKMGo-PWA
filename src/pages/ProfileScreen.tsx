// src/pages/ProfileScreen.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import {
  ArrowLeft,
  LogOut,
  Upload,
  Camera,
  User,
  MapPin,
  Briefcase,
  Edit,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useProfile, type DocumentType } from "../contexts/ProfileContext";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { profile, isLoading, error, fetchProfile, uploadDocument } =
    useProfile();
  const { logout } = useAuth();

  // Refs for file inputs
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // States for upload
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Clear success message after delay
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => setUploadSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  // Clear error message after delay
  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => setUploadError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file selection for document upload
  const handleFileSelect = async (docType: DocumentType, file: File) => {
    setUploadingDoc(docType);
    setUploadError(null);

    try {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error(
          "Format file tidak didukung. Gunakan JPG, PNG, atau PDF.",
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("Ukuran file maksimal 5MB.");
      }

      // Convert to base64
      const base64 = await fileToBase64(file);

      // Upload
      const result = await uploadDocument(docType, base64);

      if (result.success) {
        setUploadSuccess(docType);
      } else {
        setUploadError(result.message || "Gagal mengupload dokumen");
      }
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Gagal mengupload dokumen",
      );
    } finally {
      setUploadingDoc(null);
    }
  };

  // Trigger file input click
  const triggerFileInput = (docType: string) => {
    const input = fileInputRefs.current[docType];
    if (input) {
      input.click();
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between border-b border-blue-100 py-3 last:border-b-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-foreground text-sm font-semibold">
        {value || "-"}
      </span>
    </div>
  );

  // Helper functions for display
  const getGenderDisplay = (gender: string) => {
    return gender === "male" ? "Laki-laki" : "Perempuan";
  };

  const getKartuTypeDisplay = (kartuType: string) => {
    return kartuType === "afirmatif" ? "Kartu Afirmatif" : "Kartu Produktif";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Loading state
  if (isLoading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white pb-24">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
          <p className="text-muted-foreground mt-4">Memuat profil...</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-24">
      {/* Header */}
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8 pb-20">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <button
          onClick={() => navigate("/dashboard")}
          className="relative z-10 mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white">Profil Saya</h1>
          <p className="mt-2 text-white/80">Kelola informasi akun Anda</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="px-6 pt-6">
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Card */}
      <div className="relative z-20 -mt-12 px-6">
        <Card className="border-2 border-blue-100 bg-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                {profile?.photo ? (
                  <img
                    src={profile.photo}
                    alt="Profile"
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="from-primary via-accent to-secondary flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br text-3xl font-bold text-white">
                    {profile?.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <button className="absolute -right-2 -bottom-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-lg transition-transform hover:scale-110">
                  <Camera size={16} className="text-primary" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-foreground text-xl font-bold">
                  {profile?.user?.name || "-"}
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {profile?.business_name || "-"}
                </p>
                <div className="mt-3 flex gap-2">
                  <div className="rounded-lg bg-blue-100 px-3 py-1">
                    <p className="text-xs font-semibold text-blue-700">
                      {getKartuTypeDisplay(profile?.kartu_type || "")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections */}
      <div className="mt-6 space-y-4 px-6">
        {/* Personal Data */}
        <Card className="border-blue-100">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 border-b border-blue-100 p-4">
              <div className="rounded-xl bg-blue-100 p-2">
                <User className="text-primary h-5 w-5" />
              </div>
              <h3 className="text-foreground flex-1 font-bold">Data Pribadi</h3>
            </div>
            <div className="p-4">
              <InfoRow label="NIK" value={profile?.nik || ""} />
              <InfoRow
                label="Jenis Kelamin"
                value={getGenderDisplay(profile?.gender || "")}
              />
              <InfoRow
                label="Tanggal Lahir"
                value={formatDate(profile?.birth_date || "")}
              />
              <InfoRow label="Email" value={profile?.user?.email || ""} />
              <InfoRow
                label="Nomor WhatsApp"
                value={profile?.phone ? `+62${profile.phone}` : ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="border-blue-100">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 border-b border-blue-100 p-4">
              <div className="rounded-xl bg-green-100 p-2">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-foreground flex-1 font-bold">Alamat</h3>
            </div>
            <div className="p-4">
              <InfoRow label="Alamat" value={profile?.address || ""} />
              <InfoRow label="Kecamatan" value={profile?.district || ""} />
              <InfoRow label="Kota" value={profile?.city?.name || ""} />
              <InfoRow label="Provinsi" value={profile?.province?.name || ""} />
              <InfoRow label="Kode Pos" value={profile?.postal_code || ""} />
            </div>
          </CardContent>
        </Card>

        {/* UMKM Card */}
        <Card className="border-blue-100">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 border-b border-blue-100 p-4">
              <div className="rounded-xl bg-indigo-100 p-2">
                <Briefcase className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-foreground flex-1 font-bold">Kartu UMKM</h3>
            </div>
            <div className="p-4">
              <InfoRow
                label="Nama Usaha"
                value={profile?.business_name || ""}
              />
              <InfoRow
                label="Jenis Kartu"
                value={getKartuTypeDisplay(profile?.kartu_type || "")}
              />
              <InfoRow
                label="Nomor Kartu"
                value={profile?.kartu_number || ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents Upload */}
        <Card className="border-blue-100">
          <CardContent className="p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-2">
                <Upload className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-foreground flex-1 font-bold">
                Dokumen Tambahan
              </h3>
            </div>

            {/* Upload Success Message */}
            {uploadSuccess && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-green-100 p-3">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">
                  Dokumen berhasil diupload
                </span>
              </div>
            )}

            {/* Upload Error Message */}
            {uploadError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-100 p-3">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">{uploadError}</span>
              </div>
            )}

            <div className="space-y-2">
              {(
                [
                  {
                    key: "nib" as DocumentType,
                    label: "NIB",
                    value: profile?.nib,
                  },
                  {
                    key: "npwp" as DocumentType,
                    label: "NPWP",
                    value: profile?.npwp,
                  },
                  {
                    key: "revenue_record" as DocumentType,
                    label: "Catatan Pendapatan",
                    value: profile?.revenue_record,
                  },
                  {
                    key: "business_permit" as DocumentType,
                    label: "Surat Izin Usaha",
                    value: profile?.business_permit,
                  },
                ] as const
              ).map((doc, idx) => (
                <div key={idx}>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={(el) => {
                      fileInputRefs.current[doc.key] = el;
                    }}
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelect(doc.key, file);
                        e.target.value = ""; // Reset input
                      }
                    }}
                  />
                  <button
                    onClick={() => triggerFileInput(doc.key)}
                    disabled={uploadingDoc === doc.key}
                    className="hover:border-primary flex w-full items-center justify-between rounded-xl border-2 border-blue-100 bg-blue-50/30 p-3 transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-foreground text-sm font-semibold">
                        {doc.label}
                      </span>
                      {doc.value && (
                        <span className="text-xs text-green-600">
                          ✓ Sudah diupload
                        </span>
                      )}
                      {!doc.value && (
                        <span className="text-muted-foreground text-xs">
                          Belum diupload
                        </span>
                      )}
                    </div>
                    {uploadingDoc === doc.key ? (
                      <Loader2
                        size={18}
                        className="text-primary animate-spin"
                      />
                    ) : uploadSuccess === doc.key ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <Upload size={18} className="text-primary" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              Format yang didukung: JPG, PNG, PDF (maks. 5MB)
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-4">
          <Button
            variant="gradient"
            size="lg"
            className="w-full"
            onClick={() => navigate("/profile/edit")}
          >
            <Edit size={20} />
            <span>Edit Profile</span>
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="lg"
            className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
