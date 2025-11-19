// src/pages/CompleteProfileScreen.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { ArrowLeft, User, CheckCircle2 } from "lucide-react";

interface ProfileData {
  fullname: string;
  nik: string;
  gender: string;
  birthDate: string;
  businessName: string;
  kartuType: string;
  kartuNumber: string;
  address: string;
  provinceId: string;
  cityId: string;
  district: string;
  postalCode: string;
  password: string;
}

export default function CompleteProfileScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ProfileData>({
    fullname: "",
    nik: "",
    gender: "",
    birthDate: "",
    businessName: "",
    kartuType: "",
    kartuNumber: "",
    address: "",
    provinceId: "",
    cityId: "",
    district: "",
    postalCode: "",
    password: "",
  });

  const [provinces] = useState([
    { id: "32", name: "JAWA BARAT" },
    { id: "35", name: "JAWA TIMUR" },
    { id: "31", name: "DKI JAKARTA" },
  ]);

  const [cities] = useState([
    { id: "3273", name: "KOTA BANDUNG", province_id: "32" },
    { id: "3578", name: "KOTA SURABAYA", province_id: "35" },
    { id: "3172", name: "JAKARTA PUSAT", province_id: "31" },
  ]);

  const filteredCities = cities.filter(
    (city) => city.province_id === formData.provinceId,
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
      localStorage.setItem("authToken", mockToken);
      localStorage.setItem("userData", JSON.stringify(formData));
      localStorage.removeItem("tempToken");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error("Error completing profile:", err);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="from-primary via-accent to-secondary relative overflow-hidden bg-linear-to-br px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Kembali</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <User className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Lengkapi Profil</h1>
            <p className="mt-1 text-white/80">Satu langkah lagi</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info Section */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6">
            <h2 className="text-foreground mb-4 font-semibold">Data Pribadi</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">Nama Lengkap</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap sesuai KTP"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nik">NIK (16 digit)</Label>
                <Input
                  id="nik"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  placeholder="1234567890987654"
                  pattern="[0-9]{16}"
                  maxLength={16}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="border-border focus:border-primary focus:ring-primary/10 flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                    required
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
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Buat Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimal 8 karakter"
                  minLength={8}
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Info Section */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6">
            <h2 className="text-foreground mb-4 font-semibold">Data Usaha</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nama Usaha</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Nama usaha Anda"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kartuType">Jenis Kartu UMKM</Label>
                <select
                  id="kartuType"
                  name="kartuType"
                  value={formData.kartuType}
                  onChange={handleInputChange}
                  className="border-border focus:border-primary focus:ring-primary/10 flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                  required
                >
                  <option value="">Pilih Jenis Kartu</option>
                  <option value="produktif">Kartu Produktif</option>
                  <option value="afirmatif">Kartu Afirmatif</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kartuNumber">Nomor Kartu</Label>
                <Input
                  id="kartuNumber"
                  name="kartuNumber"
                  value={formData.kartuNumber}
                  onChange={handleInputChange}
                  placeholder="Nomor kartu UMKM"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6">
            <h2 className="text-foreground mb-4 font-semibold">Alamat</h2>
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
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provinceId">Provinsi</Label>
                  <select
                    id="provinceId"
                    name="provinceId"
                    value={formData.provinceId}
                    onChange={handleInputChange}
                    className="border-border focus:border-primary focus:ring-primary/10 flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-base transition-all focus:ring-4 focus:outline-none"
                    required
                  >
                    <option value="">Pilih</option>
                    {provinces.map((prov) => (
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
                    required
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">Kecamatan</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Kecamatan"
                    required
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
                    pattern="[0-9]{5}"
                    maxLength={5}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
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
                <CheckCircle2 size={20} />
                <span>Selesai & Mulai</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
