"use client";

import { useEffect, useState } from "react";

type FileItem = {
  id: number;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE;

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const statusText = uploading
    ? "Uploading..."
    : isLoading
    ? "Refreshing list..."
    : null;

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setFiles(data);
    } catch (err: any) {
      setError(err.message || "Could not load files");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    if (!fileInput?.files?.length) {
      setError("Please choose a PDF file");
      return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${apiBase}/files`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Upload failed");
      }
      await fetchFiles();
      setSuccess("Upload successful");
      form.reset();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${apiBase}/files/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Delete failed");
      }
      setFiles((prev) => prev.filter((f) => f.id !== id));
      setSuccess("File deleted");
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  const prettySize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-white text-stone-900">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">PDF shelf</p>
          <h1 className="text-2xl font-semibold">Keep and fetch your PDFs</h1>
          <p className="text-sm text-stone-500">Upload a PDF, see what’s there, download or delete. That’s it.</p>
          {statusText && (
            <p className="text-xs text-stone-500">Status: {statusText}</p>
          )}
        </header>

        <section className="space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Upload</h2>
              <p className="text-sm text-stone-500">PDF only.</p>
            </div>
            <button
              onClick={fetchFiles}
              className="text-sm font-semibold text-stone-700 underline-offset-4 hover:underline"
            >
              Refresh list
            </button>
          </div>
          <form onSubmit={handleUpload} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="file"
              name="file"
              accept="application/pdf"
              className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
          {(error || success) && (
            <div
              className={`rounded-lg px-3 py-2 text-sm ${
                error
                  ? "border border-rose-200 bg-rose-50 text-rose-800"
                  : "border border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {error || success}
            </div>
          )}
        </section>

        <section className="space-y-3 rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Files</h2>
              <p className="text-sm text-stone-500">Download or delete.</p>
            </div>
            {isLoading && <span className="text-xs text-stone-500">Loading...</span>}
          </div>
          {files.length === 0 ? (
            <p className="text-sm text-stone-500">Nothing here yet.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-stone-200">
              <table className="min-w-full divide-y divide-stone-200 text-sm">
                <thead className="bg-stone-50 text-stone-600">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Size</th>
                    <th className="px-3 py-2 text-left font-medium">Uploaded</th>
                    <th className="px-3 py-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {files.map((file) => (
                    <tr key={file.id}>
                      <td className="px-3 py-2 font-medium text-stone-900">{file.originalName}</td>
                      <td className="px-3 py-2 text-stone-600">{prettySize(file.size)}</td>
                      <td className="px-3 py-2 text-stone-500">
                        {new Date(file.uploadedAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`${apiBase}/files/${file.id}/download`}
                            className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-800 hover:border-stone-300"
                          >
                            Download
                          </a>
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:border-rose-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
