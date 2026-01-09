// src/pages/ProfileScreen.tsx
import { useEffect } from "react";
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
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { useProfile } from "../contexts/ProfileContext";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { profile, isLoading, error, fetchProfile } = useProfile();
  const { logout } = useAuth();

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
              <ChevronRight className="text-muted-foreground h-5 w-5" />
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
              <ChevronRight className="text-muted-foreground h-5 w-5" />
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
              <ChevronRight className="text-muted-foreground h-5 w-5" />
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
            <div className="space-y-2">
              {[
                { key: "nib", label: "NIB", value: profile?.nib },
                { key: "npwp", label: "NPWP", value: profile?.npwp },
                {
                  key: "revenue_record",
                  label: "Catatan Pendapatan",
                  value: profile?.revenue_record,
                },
                {
                  key: "business_permit",
                  label: "Surat Izin Usaha",
                  value: profile?.business_permit,
                },
              ].map((doc, idx) => (
                <button
                  key={idx}
                  className="hover:border-primary flex w-full items-center justify-between rounded-xl border-2 border-blue-100 bg-blue-50/30 p-3 transition-all hover:bg-blue-50"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-foreground text-sm font-semibold">
                      {doc.label}
                    </span>
                    {doc.value && (
                      <span className="text-muted-foreground text-xs">
                        Sudah diupload
                      </span>
                    )}
                  </div>
                  <Upload size={18} className="text-primary" />
                </button>
              ))}
            </div>
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
