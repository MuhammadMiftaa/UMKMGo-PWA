import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
  // const location = useLocation();
  const [loading, setLoading] = useState(false);
  // const state = (location.state as { tempToken: string }) || { tempToken: "" };

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
    <div className="flex min-h-screen flex-col bg-white pb-24">
      <div className="bg-linear-to-r from-[#0077B6] to-[#00B4D8] p-6 text-white">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Kembali</span>
        </button>
        <div>
          <h1 className="mb-1 text-3xl font-bold">Lengkapi Data Diri</h1>
          <p className="text-sm text-white/80">
            Semua data ada di satu halaman
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Data Section */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#0F172A]">
              Data Pribadi
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                    NIK (16 digit)
                  </label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                    placeholder="1234567890..."
                    pattern="[0-9]{16}"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                    Jenis Kelamin
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Pilih</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Buat password untuk keamanan"
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#F1F5F9]"></div>

          {/* Business Data Section */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#0F172A]">
              Data Usaha
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                  Nama Usaha
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama usaha"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                    Jenis Kartu
                  </label>
                  <select
                    name="kartuType"
                    value={formData.kartuType}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Pilih</option>
                    <option value="produktif">Kartu Produktif</option>
                    <option value="afirmatif">Kartu Afirmatif</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                    Nomor Kartu
                  </label>
                  <input
                    type="text"
                    name="kartuNumber"
                    value={formData.kartuNumber}
                    onChange={handleInputChange}
                    placeholder="Nomor kartu"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#F1F5F9]"></div>

          {/* Address Section */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#0F172A]">Alamat</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                  Alamat Lengkap
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Jl. / Desa / RT / RW"
                  rows={3}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                    Provinsi
                  </label>
                  <select
                    name="provinceId"
                    value={formData.provinceId}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                    Kota/Kabupaten
                  </label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={!formData.provinceId}
                  >
                    <option value="">Pilih Kota</option>
                    {filteredCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Kecamatan"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="60210"
                    pattern="[0-9]{5}"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary mt-8">
            {loading ? "Memproses..." : "Selesai & Lanjutkan"}
          </button>
        </form>
      </div>
    </div>
  );
}
