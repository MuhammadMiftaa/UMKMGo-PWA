import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { ArrowLeft, UserCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function CompleteRegisterData() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeProfile, fetchMetaData, metaData, getCitiesByProvince } =
    useAuth();

  const state = (location.state as { tempToken: string }) || {
    tempToken: "",
  };

  const [formData, setFormData] = useState({
    fullname: "",
    business_name: "",
    nik: "",
    gender: "male" as "male" | "female",
    birth_date: "",
    password: "",
    confirm_password: "",
    address: "",
    province_id: 0,
    city_id: 0,
    district: "",
    postal_code: "",
    kartu_type: "afirmatif" as "afirmatif" | "produktif",
    kartu_number: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableCities, setAvailableCities] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    fetchMetaData();
  }, []);

  useEffect(() => {
    if (!state.tempToken) {
      navigate("/signup");
      return;
    }
  }, [state.tempToken, navigate]);

  useEffect(() => {
    if (formData.province_id > 0) {
      const cities = getCitiesByProvince(formData.province_id);
      setAvailableCities(cities);
      setFormData((prev) => ({ ...prev, city_id: 0 }));
    }
  }, [formData.province_id, getCitiesByProvince]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "province_id" || name === "city_id" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (
        !formData.fullname ||
        !formData.business_name ||
        !formData.nik ||
        !formData.birth_date ||
        !formData.password ||
        !formData.confirm_password ||
        !formData.address ||
        !formData.district ||
        !formData.postal_code ||
        !formData.kartu_number ||
        formData.province_id === 0 ||
        formData.city_id === 0
      ) {
        setError("Semua field harus diisi");
        setLoading(false);
        return;
      }

      if (formData.nik.length !== 16) {
        setError("NIK harus 16 digit");
        setLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError("Password minimal 8 karakter");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirm_password) {
        setError("Password tidak cocok");
        setLoading(false);
        return;
      }

      const result = await completeProfile(
        {
          fullname: formData.fullname,
          business_name: formData.business_name,
          nik: formData.nik,
          gender: formData.gender,
          birth_date: formData.birth_date,
          password: formData.password,
          address: formData.address,
          province_id: formData.province_id,
          city_id: formData.city_id,
          district: formData.district,
          postal_code: formData.postal_code,
          kartu_type: formData.kartu_type,
          kartu_number: formData.kartu_number,
        },
        state.tempToken,
      );

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Gagal melengkapi profil");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
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
        <div>
          <h1 className="text-3xl font-bold text-white">
            Lengkapi Profil Anda
          </h1>
          <p className="mt-2 text-white/80">
            Isi data untuk menyelesaikan pendaftaran
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-1 flex-col px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-xl border px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Personal Data Section */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
            <h3 className="text-foreground mb-4 font-semibold">Data Pribadi</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">Nama Lengkap</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  name="nik"
                  type="text"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="16 digit NIK"
                  maxLength={16}
                  required
                />
                <p className="text-muted-foreground text-xs">
                  Sesuai KTP (16 digit)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="border-border focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border-2 bg-white px-4 text-sm transition-all focus:ring-4 focus:outline-none"
                  required
                >
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_date">Tanggal Lahir</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Data Section */}
          <div className="rounded-2xl border border-green-100 bg-green-50/50 p-6">
            <h3 className="text-foreground mb-4 font-semibold">Data Usaha</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Nama Usaha</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="Nama usaha/toko Anda"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kartu_type">Jenis Kartu</Label>
                <select
                  id="kartu_type"
                  name="kartu_type"
                  value={formData.kartu_type}
                  onChange={handleChange}
                  className="border-border focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border-2 bg-white px-4 text-sm transition-all focus:ring-4 focus:outline-none"
                  required
                >
                  <option value="afirmatif">Afirmatif</option>
                  <option value="produktif">Produktif</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kartu_number">Nomor Kartu</Label>
                <Input
                  id="kartu_number"
                  name="kartu_number"
                  type="text"
                  value={formData.kartu_number}
                  onChange={handleChange}
                  placeholder="Nomor kartu UMKM"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-6">
            <h3 className="text-foreground mb-4 font-semibold">Alamat</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Jalan, nomor rumah, RT/RW"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="province_id">Provinsi</Label>
                <select
                  id="province_id"
                  name="province_id"
                  value={formData.province_id}
                  onChange={handleChange}
                  className="border-border focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border-2 bg-white px-4 text-sm transition-all focus:ring-4 focus:outline-none"
                  required
                >
                  <option value="0">Pilih Provinsi</option>
                  {metaData?.provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city_id">Kota/Kabupaten</Label>
                <select
                  id="city_id"
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  className="border-border focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border-2 bg-white px-4 text-sm transition-all focus:ring-4 focus:outline-none"
                  required
                  disabled={formData.province_id === 0}
                >
                  <option value="0">Pilih Kota/Kabupaten</option>
                  {availableCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {formData.province_id === 0 && (
                  <p className="text-muted-foreground text-xs">
                    Pilih provinsi terlebih dahulu
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">Kecamatan</Label>
                <Input
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Nama kecamatan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Kode Pos</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  type="text"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="5 digit kode pos"
                  maxLength={5}
                  required
                />
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6">
            <h3 className="text-foreground mb-4 font-semibold">
              Keamanan Akun
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimal 8 karakter"
                    className="pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Konfirmasi Password</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  required
                />
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
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <UserCheck size={20} />
                <span>Selesaikan Pendaftaran</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
