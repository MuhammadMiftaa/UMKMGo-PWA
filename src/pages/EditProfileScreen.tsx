import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent } from "../components/ui/Card";
import {
  ArrowLeft,
  User,
  MapPin,
  Briefcase,
  Save,
  AlertCircle,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { useProfile, type ProfileUpdateData } from "../contexts/ProfileContext";
import { useAuth } from "../contexts/AuthContext";
import Loader from "@/components/ui/Loader";

interface FormData {
  fullname: string;
  nik: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  businessName: string;
  kartuType: string;
  kartuNumber: string;
  address: string;
  provinceId: number;
  cityId: number;
  district: string;
  postalCode: string;
  photo: string;
}

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const {
    profile,
    isLoading: profileLoading,
    updateProfile,
    fetchProfile,
  } = useProfile();
  const { metaData, fetchMetaData, getCitiesByProvince } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    nik: "",
    gender: "",
    birthDate: "",
    email: "",
    phone: "",
    businessName: "",
    kartuType: "",
    kartuNumber: "",
    address: "",
    provinceId: 0,
    cityId: 0,
    district: "",
    postalCode: "",
    photo: "",
  });

  // Fetch meta data and profile on mount
  useEffect(() => {
    fetchMetaData();
    if (!profile) {
      fetchProfile();
    }
  }, []);

  // Populate form when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        fullname: profile.user?.name || "",
        nik: profile.nik || "",
        gender: profile.gender || "",
        birthDate: profile.birth_date || "",
        email: profile.user?.email || "",
        phone: profile.phone || "",
        businessName: profile.business_name || "",
        kartuType: profile.kartu_type || "",
        kartuNumber: profile.kartu_number || "",
        address: profile.address || "",
        provinceId: profile.province_id || 0,
        cityId: profile.city_id || 0,
        district: profile.district || "",
        postalCode: profile.postal_code || "",
        photo: profile.photo || "",
      });
    }
  }, [profile]);

  const filteredCities = formData.provinceId
    ? getCitiesByProvince(formData.provinceId)
    : [];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "provinceId") {
      setFormData((prev) => ({
        ...prev,
        provinceId: parseInt(value) || 0,
        cityId: 0, // Reset city when province changes
      }));
    } else if (name === "cityId") {
      setFormData((prev) => ({ ...prev, cityId: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.fullname.trim()) {
      setError("Nama lengkap harus diisi");
      setLoading(false);
      return;
    }

    if (!formData.businessName.trim()) {
      setError("Nama usaha harus diisi");
      setLoading(false);
      return;
    }

    if (!formData.address.trim()) {
      setError("Alamat harus diisi");
      setLoading(false);
      return;
    }

    if (!formData.postalCode || formData.postalCode.length !== 5) {
      setError("Kode pos harus 5 digit");
      setLoading(false);
      return;
    }

    // Prepare update data
    const updateData: ProfileUpdateData = {
      name: formData.fullname,
      business_name: formData.businessName,
      gender: formData.gender as "male" | "female",
      birth_date: formData.birthDate,
      address: formData.address,
      province_id: formData.provinceId,
      city_id: formData.cityId,
      district: formData.district,
      postal_code: formData.postalCode,
    };

    // Only include photo if it was changed
    if (formData.photo && formData.photo.startsWith("data:")) {
      updateData.photo = formData.photo;
    }

    const result = await updateProfile(updateData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } else {
      setError(result.message || "Gagal memperbarui profil");
    }

    setLoading(false);
  };

  // Loading state
  if (profileLoading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader />
          <p className="text-muted-foreground mt-4">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white pb-24">
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8 pb-20">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <button
          onClick={() => navigate("/profile")}
          className="relative z-10 mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white">Edit Profil</h1>
          <p className="mt-2 text-white/80">Perbarui informasi akun Anda</p>
        </div>
      </div>

      <div className="relative z-20 -mt-12 px-6">
        <Card className="border-2 border-blue-100 bg-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Profile"
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="from-primary via-accent to-secondary flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br text-4xl font-bold text-white">
                    {formData.fullname.charAt(0) || "U"}
                  </div>
                )}
                <label className="absolute -right-2 -bottom-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border-2 border-blue-100 bg-white shadow-lg transition-transform hover:scale-110">
                  <Camera size={18} className="text-primary" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-muted-foreground mt-3 text-sm">
                Klik untuk ubah foto profil
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 px-6">
        <div className="space-y-6">
          {success && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-600">
                    Profil berhasil diperbarui!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

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
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Nama Lengkap</Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="Nama lengkap sesuai KTP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nik">NIK (16 digit)</Label>
                  <Input
                    id="nik"
                    name="nik"
                    value={formData.nik}
                    maxLength={16}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="border-border focus:border-primary focus:ring-primary/10 flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  >
                    <option value="">Pilih</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Tanggal Lahir</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-muted-foreground text-xs">
                    Email tidak dapat diubah
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor WhatsApp</Label>
                  <div className="flex gap-2">
                    <div className="border-border bg-muted text-muted-foreground flex h-12 items-center rounded-xl border-2 px-4 font-semibold">
                      +62
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      disabled
                      className="bg-muted flex-1 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Nomor WhatsApp tidak dapat diubah
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-primary" />
                <h2 className="text-foreground font-bold">Data Usaha</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nama Usaha</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Nama usaha Anda"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kartuType">Jenis Kartu UMKM</Label>
                  <Input
                    id="kartuType"
                    name="kartuType"
                    value={formData.kartuType}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-muted-foreground text-xs">
                    Jenis kartu tidak dapat diubah
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kartuNumber">Nomor Kartu</Label>
                  <Input
                    id="kartuNumber"
                    name="kartuNumber"
                    value={formData.kartuNumber}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-muted-foreground text-xs">
                    Nomor kartu tidak dapat diubah
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                <h2 className="text-foreground font-bold">Alamat</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Jalan, RT/RW, Kelurahan"
                    rows={3}
                    className="border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary/10 flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provinceId">Provinsi</Label>
                  <select
                    id="provinceId"
                    name="provinceId"
                    value={formData.provinceId}
                    onChange={handleInputChange}
                    className="border-border focus:border-primary focus:ring-primary/10 flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  >
                    <option value="">Pilih</option>
                    {metaData?.provinces?.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cityId">Kota/Kab</Label>
                  <select
                    id="cityId"
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleInputChange}
                    className="border-border focus:border-primary focus:ring-primary/10 flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                    disabled={!formData.provinceId}
                  >
                    <option value="">Pilih</option>
                    {filteredCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">Kecamatan</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Kecamatan"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kode Pos</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="60210"
                    maxLength={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-foreground text-sm font-semibold">
                    Perhatian
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Email, nomor WhatsApp, jenis kartu, dan nomor kartu tidak
                    dapat diubah. Untuk mengubah data tersebut, silakan hubungi
                    customer service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 pb-4">
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
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </Button>

            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              size="lg"
              className="w-full border-2"
            >
              Batal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
