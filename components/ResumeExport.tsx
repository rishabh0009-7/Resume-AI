"use client";
import React, { useState } from "react";
import { Download, FileText, FileImage, File } from "lucide-react";

interface ResumeExportProps {
  resumeId: string;
  resumeTitle: string;
}

const ResumeExport: React.FC<ResumeExportProps> = ({
  resumeId,
  resumeTitle,
}) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const exportFormats = [
    {
      id: "pdf",
      name: "PDF",
      description: "Professional format for printing and sharing",
      icon: FileText,
      color: "bg-red-500",
    },
    {
      id: "docx",
      name: "Word Document",
      description: "Editable format for further customization",
      icon: File,
      color: "bg-blue-500",
    },
    {
      id: "txt",
      name: "Plain Text",
      description: "Simple text format for ATS systems",
      icon: FileText,
      color: "bg-gray-500",
    },
  ];

  const handleExport = async (format: string) => {
    setExporting(format);
    try {
      const response = await fetch(`/api/resumes/${resumeId}/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ format }),
      });

      if (response.ok) {
        const data = await response.json();

        // Create and download file
        const blob = new Blob([data.content], {
          type: getMimeType(format),
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export resume. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  const getMimeType = (format: string) => {
    switch (format) {
      case "pdf":
        return "application/pdf";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "txt":
        return "text/plain";
      default:
        return "text/plain";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Export Resume</h3>
          <p className="text-sm text-gray-600">
            Download your resume in your preferred format
          </p>
        </div>
        <Download className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {exportFormats.map((format) => (
          <div
            key={format.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${format.color}`}
              >
                <format.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{format.name}</h4>
                <p className="text-sm text-gray-600">{format.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleExport(format.id)}
              disabled={exporting === format.id}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === format.id ? "Exporting..." : "Export"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Export Tips</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• PDF is best for printing and professional sharing</li>
          <li>• Word format allows for further editing</li>
          <li>• Plain text is optimized for ATS systems</li>
          <li>• All formats are ATS-friendly</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeExport;
