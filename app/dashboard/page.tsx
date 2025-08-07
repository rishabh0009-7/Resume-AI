// app/dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Edit,
  Trash2,
  Download,
  Loader2,
  Calendar,
  Eye,
  MoreVertical,
} from "lucide-react";

interface Resume {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  sections: any[];
}

const DashboardPage = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/resumes");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/sign-in");
          return;
        }
        throw new Error("Failed to fetch resumes");
      }
      const data = await res.json();
      setResumes(data.resumes || []);
    } catch (err) {
      setError("Could not load resumes. Please try again later.");
      console.error(err);
    }
    setLoading(false);
  };

  const deleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete resume");
      }

      setResumes(resumes.filter(resume => resume.id !== id));
    } catch (err) {
      alert("Failed to delete resume. Please try again.");
      console.error(err);
    }
    setDeletingId(null);
  };

  const exportResume = async (id: string, format: string = "pdf") => {
    try {
      const res = await fetch(`/api/resumes/${id}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });

      if (!res.ok) {
        throw new Error("Failed to export resume");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Failed to export resume. Please try again.");
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Resumes</h1>
              <p className="text-gray-600 mt-1">
                Manage and create professional resumes with AI assistance
              </p>
            </div>
            <Link href="/resume/create">
              <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create New Resume</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Resumes</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchResumes}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Resumes Yet</h3>
              <p className="text-gray-600 mb-8">
                Get started by creating your first professional resume with AI assistance.
              </p>
              <Link href="/resume/create">
                <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition space-x-2 mx-auto">
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Resume</span>
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recently Updated</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {resumes.filter(r => {
                        const daysSinceUpdate = (Date.now() - new Date(r.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
                        return daysSinceUpdate <= 7;
                      }).length}
                    </p>
                  </div>
                  <Calendar className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {resumes.filter(r => {
                        const resumeDate = new Date(r.createdAt);
                        const now = new Date();
                        return resumeDate.getMonth() === now.getMonth() && resumeDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <Plus className="w-12 h-12 text-purple-600 opacity-20" />
                </div>
              </div>
            </div>

            {/* Resume Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 overflow-hidden group"
                >
                  {/* Resume Preview */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 p-4 relative overflow-hidden">
                    <div className="w-full h-full bg-white rounded-lg shadow-sm p-3 transform group-hover:scale-105 transition-transform duration-200">
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-800 rounded w-3/4"></div>
                        <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                        <div className="mt-3 space-y-1">
                          <div className="h-1 bg-gray-200 rounded"></div>
                          <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                          <div className="h-1 bg-gray-200 rounded w-3/5"></div>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="h-1 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-1 bg-gray-200 rounded"></div>
                          <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-lg"></div>
                  </div>

                  {/* Resume Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 truncate flex-1 mr-2">
                        {resume.title}
                      </h3>
                      <div className="relative">
                        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {resume.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {resume.description}
                      </p>
                    )}

                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Updated {formatDate(resume.updatedAt)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Link href={`/resume/${resume.id}`} className="flex-1">
                        <button className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition space-x-1">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      </Link>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => exportResume(resume.id, "pdf")}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => deleteResume(resume.id)}
                          disabled={deletingId === resume.id}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                          title="Delete Resume"
                        >
                          {deletingId === resume.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create New Card */}
              <Link href="/resume/create">
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center min-h-[400px] group cursor-pointer">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <Plus className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Resume</h3>
                    <p className="text-gray-600 text-sm">
                      Start building your professional resume with AI assistance
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;