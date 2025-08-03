"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ResumeBuilder from "@/components/ResumeBuilder";

interface ResumeData {
  id: string;
  title: string;
  description?: string;
  sections: any[];
  template?: any;
}

const EditResumePage = () => {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResume();
  }, [params.id]);

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resumes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setResume(data.resume);
      } else {
        setError("Failed to load resume");
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      setError("Failed to load resume");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || "Resume not found"}</p>
          <button
            onClick={() => router.push("/resume")}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Resumes
          </button>
        </div>
      </div>
    );
  }

  return <ResumeBuilder initialData={resume} />;
};

export default EditResumePage;
