"use client";

import { useState, useMemo } from "react";
import FileUpload from "@/components/ui/FileUpload";
import DataTable from "@/components/data-table/DataTable";
import { ColumnDef } from "@tanstack/react-table";

// Define the structure of a row in your dataset
type RowData = Record<string, unknown>;

// Define the structure of your preview data
interface PreviewData {
  columns: string[];
  preview: RowData[];
}

// Helper function to safely render cell values
const renderCellValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "[Object]";
    }
  }
  return String(value);
};

export default function DataUploadPage() {
  const [preview, setPreview] = useState<PreviewData | null>(null);

  // Handler to transform the uploaded data to match PreviewData structure
  const handleUpload = (data: unknown) => {
    let normalizedData: RowData[] = [];

    // Case 1: If backend wrapped it as [[...]]
    if (Array.isArray(data) && Array.isArray(data[0])) {
      normalizedData = data[0] as RowData[];
    }
    // Case 2: Already an array of objects
    else if (Array.isArray(data) && typeof data[0] === "object" && data[0] !== null) {
      normalizedData = data as RowData[];
    }
    // Case 3: Single object
    else if (typeof data === "object" && data !== null) {
      normalizedData = [data as RowData];
    }

    // Extract columns from first row
    const columns =
      normalizedData.length > 0 ? Object.keys(normalizedData[0]) : [];

    setPreview({
      columns,
      preview: normalizedData,
    });
  };

  // Define table columns dynamically from preview data
  const columns = useMemo<ColumnDef<RowData, unknown>[]>(() => {
    if (!preview?.columns) return [];
    return preview.columns.map((col) => ({
      accessorKey: col,
      header: col,
      cell: (info) => renderCellValue(info.getValue()),
    }));
  }, [preview]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Upload Data File</h2>
      <FileUpload onUpload={handleUpload} />
      {preview && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Preview</h3>
          <DataTable columns={columns} data={preview.preview} />
        </div>
      )}
    </div>
  );
}
