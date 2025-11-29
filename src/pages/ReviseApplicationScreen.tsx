import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { Card, CardContent } from "../components/ui/Card";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  FileText,
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

interface Document {
  id: number;
  type: string;
  file: string | File;
  fileName: string;
}

interface Application {
  id: number;
  status: string;
  program: {
    id: number;
    title: string;
    type: "training" | "certification" | "funding";
  };
  documents: Document[];
  revisionNote: string;
}

export default function ReviseApplicationScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>(
    {},
  );
  const [error, setError] = useState("");

  useEffect(() => {
    // Simulate fetching application data
    setTimeout(() => {
      const mockApplication: Application = {
        id: 1,
        status: "revise",
        program: {
          id: 1,
          title: "Pelatihan Digital Marketing",
          type: "training",
        },
        documents: [
          { id: 1, type: "KTP", file: "ktp.pdf", fileName: "ktp_john_doe.pdf" },
          { id: 2, type: "NIB", file: "nib.pdf", fileName: "nib_john_doe.pdf" },
          {
            id: 3,
            type: "NPWP",
            file: "npwp.pdf",
            fileName: "npwp_john_doe.pdf",
          },
          {
            id: 4,
            type: "Portfolio",
            file: "portfolio.pdf",
            fileName: "portfolio_bisnis.pdf",
          },
        ],
        revisionNote:
          "Mohon perbaiki dokumen KTP karena gambar kurang jelas dan tidak terbaca dengan baik. Dokumen portfolio juga perlu dilengkapi dengan foto produk yang lebih detail dan berkualitas tinggi.",
      };

      setApplication(mockApplication);

      // Initialize documents state
      const initialDocs: { [key: string]: File | null } = {};
      mockApplication.documents.forEach((doc) => {
        initialDocs[doc.type] = null;
      });
      setDocuments(initialDocs);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments((prev) => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setError("");

    // Check if at least one document has been uploaded
    const hasUploadedDoc = Object.values(documents).some((doc) => doc !== null);

    if (!hasUploadedDoc) {
      setError("Minimal satu dokumen harus diupload untuk melakukan revisi");
      setLoading(false);
      return;
    }

    // Simulate submission
    setTimeout(() => {
      alert("Revisi berhasil dikirim!");
      navigate("/activity");
    }, 1000);
  };

  if (loading || !application) {
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
      {/* Header */}
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
          <h1 className="text-3xl font-bold text-white">Revisi Pengajuan</h1>
          <p className="mt-2 text-white/80">{application.program.title}</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="space-y-6">
          {/* Error Alert */}
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

          {/* Revision Note Section */}
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h2 className="text-foreground font-bold">
                  Catatan Revisi dari Admin
                </h2>
              </div>
              <div className="rounded-lg border border-orange-200 bg-white p-4">
                <p className="text-foreground text-sm leading-relaxed">
                  {application.revisionNote}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div className="flex-1">
                  <p className="text-foreground text-sm font-semibold">
                    Petunjuk Revisi
                  </p>
                  <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-4 text-xs">
                    <li>
                      Baca dengan teliti catatan revisi dari admin di atas
                    </li>
                    <li>
                      Upload ulang dokumen yang perlu diperbaiki sesuai dengan
                      catatan revisi
                    </li>
                    <li>
                      Anda dapat mengupload ulang semua dokumen atau hanya
                      dokumen tertentu yang perlu direvisi
                    </li>
                    <li>
                      Pastikan dokumen yang diupload jelas, berkualitas baik,
                      dan mudah terbaca
                    </li>
                    <li>Format file: JPG, PNG, atau PDF (Max 5MB per file)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Upload Section */}
          <Card className="border-blue-100">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                <h2 className="text-foreground font-bold">Dokumen</h2>
              </div>

              <div className="space-y-4">
                {application.documents.map((doc) => (
                  <div key={doc.id} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {doc.type}
                      <span className="text-muted-foreground text-xs font-normal">
                        (File saat ini: {doc.fileName})
                      </span>
                    </Label>

                    <div className="relative">
                      <input
                        id={`doc-${doc.id}`}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, doc.type)}
                        className="hidden"
                      />
                      <label
                        htmlFor={`doc-${doc.id}`}
                        className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-blue-200 bg-blue-50/30 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-blue-100 p-2">
                            <Upload size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-foreground text-sm font-semibold">
                              {documents[doc.type]
                                ? documents[doc.type]!.name
                                : `Upload ulang ${doc.type}`}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {documents[doc.type]
                                ? "File baru dipilih"
                                : "Klik untuk upload file baru"}
                            </p>
                          </div>
                        </div>
                        {documents[doc.type] && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                      </label>
                    </div>
                  </div>
                ))}
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
                  <span>Kirim Revisi</span>
                </>
              )}
            </Button>
            <p className="text-muted-foreground text-center text-xs">
              Pastikan dokumen yang diupload sudah sesuai dengan catatan revisi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
