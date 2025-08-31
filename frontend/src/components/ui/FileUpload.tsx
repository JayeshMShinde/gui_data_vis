"use client";

import { useRef, useState } from "react";
import { api, uploadData } from "@/lib/api";

interface FileUploadProps {
  onUpload: (data: Record<string, unknown>) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setLoading(true);
    setError(null);

    try {
        console.log("Selected file:", files[0]);
        const result = await uploadData(files[0]);

        // Ensure serializable object
        const serializedData = JSON.parse(JSON.stringify(result));
        onUpload(serializedData);
    } catch (err: any) {
        setError(err.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
        setLoading(false);
    }
    };


  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRetry = () => {
    setError(null);
    if (inputRef.current?.files) {
      handleFiles(inputRef.current.files);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      } ${loading ? "pointer-events-none opacity-50" : ""}`}
      onClick={() => !loading && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={loading}
      />

      <div className="space-y-2">
        <p className="mb-2">
          Drag & drop a CSV/XLSX file here, or{" "}
          <span className="underline text-blue-600">browse</span>
        </p>

        {loading && (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-blue-600">Uploading...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-600 text-sm mb-2">{error}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRetry();
              }}
              className="text-blue-600 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
