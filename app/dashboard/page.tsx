"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  FileText,
  Edit,
  Trash2,
  Download,
  Loader2,
} from "lucide-react";

const DashboardPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/resumes");
        if (!res.ok) throw new Error("Failed to fetch resumes");
        const data = await res.json();
        setResumes(data.resumes || []);
      } catch (err) {
        setError("Could not load resumes. Please try again later.");
      }
      setLoading(false);
    };
    fetchResumes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              ResumeAi
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/templates"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Your Resumes</h1>
          <Link href="/resume/create">
            <button className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Resume</span>
            </button>
          </Link>
        </div>

        {/* Loading/Error/Empty States */}
        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-32 text-red-500 text-xl">{error}</div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-32 text-gray-400 text-xl">
            <FileText className="mx-auto mb-4 w-12 h-12" />
            No resumes yet. Click "Create Resume" to get started!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-xl shadow p-6 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900 truncate">
                      {resume.title}
                    </h2>
                  </div>
                  <div className="text-gray-500 text-sm mb-4">
                    Last updated:{" "}
                    {resume.updatedAt
                      ? new Date(resume.updatedAt).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <Link href={`/resume/${resume.id}`}>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition space-x-1">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </Link>
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition space-x-1">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition space-x-1">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
