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
  Loader2,
} from "lucide-react";
import {
  useProgram,
  type ApplicationDetail,
  type ReviseDocumentInput,
} from "../contexts/ProgramContext";
import Loader from "@/components/ui/Loader";

export default function ReviseApplicationScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getApplicationDetail, reviseApplication } = useProgram();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null,
  );
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>(
    {},
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) {
        setError("ID pengajuan tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const data = await getApplicationDetail(parseInt(id));
        setApplication(data);

        // Initialize documents state based on application's existing documents
        if (data.documents) {
          const initialDocs: { [key: string]: File | null } = {};
          data.documents.forEach((doc) => {
            initialDocs[doc.type] = null;
          });
          setDocuments(initialDocs);
        }
      } catch (err) {
        setError("Gagal memuat data pengajuan");
        console.error("Error fetching application:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments((prev) => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    // Check if at least one document has been uploaded
    const uploadedDocs = Object.entries(documents).filter(
      ([, file]) => file !== null,
    );

    if (uploadedDocs.length === 0) {
      setError("Minimal satu dokumen harus diupload untuk melakukan revisi");
      setSubmitting(false);
      return;
    }

    try {
      // Convert files to base64 and prepare the documents array
      const reviseDocuments: ReviseDocumentInput[] = await Promise.all(
        uploadedDocs.map(async ([type, file]) => ({
          type: type.toLowerCase(),
          document: await fileToBase64(file!),
        })),
      );

      await reviseApplication(parseInt(id!), reviseDocuments);
      setSuccess(true);

      // Navigate back after success
      setTimeout(() => {
        navigate("/activity");
      }, 2000);
    } catch (err) {
      setError("Gagal mengirim revisi. Silakan coba lagi.");
      console.error("Error submitting revision:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Get revision notes from application histories
  const getRevisionNotes = () => {
    if (!application?.histories) return null;

    // Find the latest revision history
    const revisionHistory = application.histories.find(
      (h) => h.status === "revision" || h.status === "revise",
    );

    return revisionHistory?.notes || null;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader />
          <p className="text-muted-foreground mt-4">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="text-muted-foreground mt-4">
            {error || "Pengajuan tidak ditemukan"}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/activity")}
          >
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const revisionNotes = getRevisionNotes();

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
          {revisionNotes && (
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
                    {revisionNotes}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Message */}
          {success && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-600">
                    Revisi berhasil dikirim! Mengalihkan...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

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
                {application.documents.map((doc) => {
                  // Extract filename from URL or use type as fallback
                  const fileName = doc.file
                    ? doc.file.split("/").pop() || doc.type
                    : doc.type;

                  return (
                    <div key={doc.id} className="space-y-2">
                      <Label className="flex items-center gap-2">
                        {doc.type.toUpperCase()}
                        <span className="text-muted-foreground text-xs font-normal">
                          (File saat ini: {fileName})
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
                                  : `Upload ulang ${doc.type.toUpperCase()}`}
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
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={submitting || success}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
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
