"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Droplets, Type, AlertTriangle } from "lucide-react";

interface DataInfo {
  shape: [number, number];
  columns: string[];
  dtypes: Record<string, string>;
  missing_values: Record<string, number>;
  numeric_columns: string[];
  categorical_columns: string[];
}

interface DataCleaningControlsProps {
  sessionId: string;
  dataInfo: DataInfo;
  onCleaningAction: (action: string, params: any) => void;
  isLoading?: boolean;
}

export default function DataCleaningControls({
  sessionId,
  dataInfo,
  onCleaningAction,
  isLoading = false
}: DataCleaningControlsProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [missingStrategy, setMissingStrategy] = useState<string>("");
  const [typeConversions, setTypeConversions] = useState<Record<string, string>>({});
  const [outlierMethod, setOutlierMethod] = useState<string>("iqr");

  const handleColumnSelection = (column: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, column]);
    } else {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    }
  };

  const handleTypeConversion = (column: string, type: string) => {
    setTypeConversions({ ...typeConversions, [column]: type });
  };

  const hasMissingValues = Object.values(dataInfo.missing_values).some(count => count > 0);
  const columnsWithMissing = Object.entries(dataInfo.missing_values)
    .filter(([_, count]) => count > 0)
    .map(([col, _]) => col);

  return (
    <div className="space-y-4">
      {/* Drop Duplicates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Trash2 className="h-4 w-4" />
            Remove Duplicates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => onCleaningAction("drop_duplicates", {})}
            disabled={isLoading}
            size="sm"
          >
            Remove Duplicate Rows
          </Button>
        </CardContent>
      </Card>

      {/* Drop Columns */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Trash2 className="h-4 w-4" />
            Drop Columns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {dataInfo.columns.map((column) => (
              <div key={column} className="flex items-center space-x-2">
                <Checkbox
                  id={`drop-${column}`}
                  checked={selectedColumns.includes(column)}
                  onCheckedChange={(checked) => 
                    handleColumnSelection(column, checked as boolean)
                  }
                />
                <Label htmlFor={`drop-${column}`} className="text-xs truncate">
                  {column}
                </Label>
              </div>
            ))}
          </div>
          <Button
            onClick={() => onCleaningAction("drop_columns", { columns: selectedColumns })}
            disabled={isLoading || selectedColumns.length === 0}
            size="sm"
            variant="destructive"
          >
            Drop Selected Columns
          </Button>
        </CardContent>
      </Card>

      {/* Handle Missing Values */}
      {hasMissingValues && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Droplets className="h-4 w-4" />
              Handle Missing Values
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Columns with missing values: {columnsWithMissing.join(", ")}
            </div>
            <Select value={missingStrategy} onValueChange={setMissingStrategy}>
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mean">Fill with Mean (numeric only)</SelectItem>
                <SelectItem value="median">Fill with Median (numeric only)</SelectItem>
                <SelectItem value="mode">Fill with Mode</SelectItem>
                <SelectItem value="zero">Fill with Zero</SelectItem>
                <SelectItem value="forward_fill">Forward Fill</SelectItem>
                <SelectItem value="backward_fill">Backward Fill</SelectItem>
                <SelectItem value="drop">Drop Rows with Missing</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => onCleaningAction("handle_missing", { 
                strategy: missingStrategy,
                columns: columnsWithMissing 
              })}
              disabled={isLoading || !missingStrategy}
              size="sm"
            >
              Apply Strategy
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Data Type Conversion */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Type className="h-4 w-4" />
            Convert Data Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {dataInfo.columns.slice(0, 5).map((column) => (
              <div key={column} className="flex items-center gap-2">
                <Label className="text-xs w-20 truncate">{column}</Label>
                <Select
                  value={typeConversions[column] || ""}
                  onValueChange={(value) => handleTypeConversion(column, value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="int">Integer</SelectItem>
                    <SelectItem value="float">Float</SelectItem>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="datetime">DateTime</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <Button
            onClick={() => onCleaningAction("convert_types", { 
              column_types: typeConversions 
            })}
            disabled={isLoading || Object.keys(typeConversions).length === 0}
            size="sm"
          >
            Convert Types
          </Button>
        </CardContent>
      </Card>

      {/* Detect Outliers */}
      {dataInfo.numeric_columns.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Detect Outliers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={outlierMethod} onValueChange={setOutlierMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iqr">IQR Method</SelectItem>
                <SelectItem value="zscore">Z-Score Method</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => onCleaningAction("detect_outliers", { 
                columns: dataInfo.numeric_columns,
                outlier_method: outlierMethod 
              })}
              disabled={isLoading}
              size="sm"
            >
              Detect Outliers
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}