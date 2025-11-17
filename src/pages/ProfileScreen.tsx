import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Upload, Camera } from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [userData] = useState({
    fullname: "Akbar Chalay",
    businessName: "PT Semua Teman",
    nik: "1234567890987654",
    gender: "Laki-laki",
    birthDate: "2008-08-06",
    email: "akbar@email.com",
    phone: "81234567890",
    address: "Jl. Ketintang No. 123",
    district: "Ketintang",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60210",
    kartuType: "Kartu Afirmatif",
    kartuNumber: "1234567890",
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="border-border flex justify-between border-b py-3 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-semibold">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="from-primary to-accent bg-linear-to-r p-6 text-white">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center gap-2 opacity-80 hover:opacity-100"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl font-bold">Profile Saya</h1>
      </div>

      {/* Profile Header */}
      <div className="px-6 py-8">
        <div className="text-center">
          <div className="relative mb-6 inline-block">
            <div className="from-primary to-accent flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br text-3xl font-bold text-white">
              {userData.fullname.charAt(0)}
            </div>
            <button className="bg-primary hover:bg-primary/90 absolute right-0 bottom-0 rounded-full p-2 text-white transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-foreground text-2xl font-bold">
            {userData.fullname}
          </h2>
          <p className="text-muted-foreground mt-1">{userData.businessName}</p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6 px-6">
        {/* Personal Data */}
        <div>
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Data Pribadi
          </h3>
          <div className="border-border rounded-lg border bg-white p-4">
            <InfoRow label="NIK" value={userData.nik} />
            <InfoRow label="Jenis Kelamin" value={userData.gender} />
            <InfoRow label="Tanggal Lahir" value={userData.birthDate} />
            <InfoRow label="Email" value={userData.email} />
            <InfoRow label="Nomor WhatsApp" value={`+62${userData.phone}`} />
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-foreground mb-3 text-lg font-semibold">Alamat</h3>
          <div className="border-border rounded-lg border bg-white p-4">
            <InfoRow label="Alamat" value={userData.address} />
            <InfoRow label="Kecamatan" value={userData.district} />
            <InfoRow label="Kota" value={userData.city} />
            <InfoRow label="Provinsi" value={userData.province} />
            <InfoRow label="Kode Pos" value={userData.postalCode} />
          </div>
        </div>

        {/* UMKM Card */}
        <div>
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Kartu UMKM
          </h3>
          <div className="border-border rounded-lg border bg-white p-4">
            <InfoRow label="Jenis Kartu" value={userData.kartuType} />
            <InfoRow label="Nomor Kartu" value={userData.kartuNumber} />
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-foreground mb-3 text-lg font-semibold">
            Dokumen Tambahan
          </h3>
          <div className="space-y-3">
            {["NIB", "NPWP", "Catatan Pendapatan", "Surat Izin Usaha"].map(
              (doc, idx) => (
                <button
                  key={idx}
                  className="border-border hover:border-primary flex w-full items-center justify-between rounded-lg border bg-white p-4 transition-colors"
                >
                  <span className="text-foreground font-semibold">{doc}</span>
                  <Upload size={20} className="text-primary" />
                </button>
              ),
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-4">
          <button className="btn-primary">Edit Profile</button>
          <button
            onClick={handleLogout}
            className="text-destructive border-destructive hover:bg-destructive/5 flex w-full items-center justify-center gap-2 rounded-lg border-2 py-3 font-semibold transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <BottomNavigation unreadCount={0} />
    </div>
  );
}
