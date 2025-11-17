import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const state = (location.state as { tempToken: string }) || { tempToken: "" };

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
      // Simulasi API call
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

  const sections = [
    { id: "personal", label: "Data Pribadi" },
    { id: "business", label: "Data Usaha" },
    { id: "address", label: "Alamat" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24">
      {/* Header */}
      <div className="from-primary to-accent bg-linear-to-r p-6 text-white">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 opacity-80 hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl font-bold">Lengkapi Data Diri</h1>
      </div>

      {/* Section Tabs */}
      <div className="border-border flex gap-2 overflow-x-auto border-b px-6 py-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`rounded-lg px-4 py-2 font-semibold whitespace-nowrap transition-colors ${
              activeSection === section.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Data Section */}
          {activeSection === "personal" && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Nama Lengkap"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  NIK (16 digit)
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  placeholder="1234567890987654"
                  pattern="[0-9]{16}"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Jenis Kelamin
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
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
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Buat password baru"
                  className="input-field"
                  required
                />
              </div>
            </div>
          )}

          {/* Business Data Section */}
          {activeSection === "business" && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nama Usaha
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Nama Usaha"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Jenis Kartu
                </label>
                <select
                  name="kartuType"
                  value={formData.kartuType}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Pilih Jenis Kartu</option>
                  <option value="produktif">Kartu Produktif</option>
                  <option value="afirmatif">Kartu Afirmatif</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Nomor Kartu
                </label>
                <input
                  type="text"
                  name="kartuNumber"
                  value={formData.kartuNumber}
                  onChange={handleInputChange}
                  placeholder="Nomor Kartu"
                  className="input-field"
                  required
                />
              </div>
            </div>
          )}

          {/* Address Section */}
          {activeSection === "address" && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Alamat Lengkap
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Alamat Lengkap"
                  rows={3}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
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
                <label className="mb-2 block text-sm font-semibold">
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
                  <option value="">Pilih Kota/Kabupaten</option>
                  {filteredCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">
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
                <label className="mb-2 block text-sm font-semibold">
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
          )}

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary mt-8">
            {loading ? "Memproses..." : "Selesai"}
          </button>
        </form>
      </div>
    </div>
  );
}
