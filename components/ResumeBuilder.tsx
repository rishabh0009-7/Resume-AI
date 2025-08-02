"use client";
import React, { useState, useEffect } from "react";
import { Plus, Wand2, Download, Eye, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ResumeSection from "./ResumeSection";
import AIPanel from "./AIPanel";
import ResumePreview from "./ResumePreview";

interface ResumeData {
  id?: string;
  title: string;
  description?: string;
  sections: {
    id?: string;
    type: string;
    title: string;
    content: any;
    order: number;
  }[];
}

const ResumeBuilder = () => {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData>({
    title: "",
    description: "",
    sections: [],
  });
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  const sectionTypes = [
    { type: "PERSONAL_INFO", title: "Personal Information", icon: "👤" },
    { type: "SUMMARY", title: "Professional Summary", icon: "📝" },
    { type: "EXPERIENCE", title: "Work Experience", icon: "💼" },
    { type: "EDUCATION", title: "Education", icon: "🎓" },
    { type: "SKILLS", title: "Skills", icon: "🛠️" },
    { type: "PROJECTS", title: "Projects", icon: "🚀" },
    { type: "CERTIFICATIONS", title: "Certifications", icon: "🏆" },
    { type: "LANGUAGES", title: "Languages", icon: "🌍" },
  ];

  const addSection = (type: string) => {
    const newSection = {
      type,
      title: sectionTypes.find((s) => s.type === type)?.title || type,
      content: getDefaultContent(type),
      order: resumeData.sections.length,
    };

    setResumeData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));

    setActiveSection(type);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "PERSONAL_INFO":
        return {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          website: "",
        };
      case "SUMMARY":
        return { text: "" };
      case "EXPERIENCE":
        return { items: [] };
      case "EDUCATION":
        return { items: [] };
      case "SKILLS":
        return { categories: [] };
      case "PROJECTS":
        return { items: [] };
      case "CERTIFICATIONS":
        return { items: [] };
      case "LANGUAGES":
        return { items: [] };
      default:
        return {};
    }
  };

  const updateSection = (sectionIndex: number, content: any) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, content } : section
      ),
    }));
  };

  const removeSection = (sectionIndex: number) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sectionIndex),
    }));
  };

  const saveResume = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resumeData.title,
          description: resumeData.description,
          sections: resumeData.sections,
        }),
      });

      if (response.ok) {
        const { resume } = await response.json();
        router.push(`/resume/${resume.id}`);
      }
    } catch (error) {
      console.error("Error saving resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Resume Builder
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <Wand2 className="w-4 h-4" />
                <span>AI Assistant</span>
              </button>

              <button
                onClick={saveResume}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Resume Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Title */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Resume Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Title
                  </label>
                  <input
                    type="text"
                    value={resumeData.title}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="e.g., Software Engineer Resume"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={resumeData.description}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description of this resume"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Target Job Description
              </h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to get AI-powered suggestions..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Sections */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resume Sections
                </h2>
                <div className="relative">
                  <select
                    onChange={(e) => addSection(e.target.value)}
                    className="appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-10"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Add Section
                    </option>
                    {sectionTypes.map((section) => (
                      <option key={section.type} value={section.type}>
                        {section.icon} {section.title}
                      </option>
                    ))}
                  </select>
                  <Plus className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-4">
                {resumeData.sections.map((section, index) => (
                  <ResumeSection
                    key={index}
                    section={section}
                    onUpdate={(content) => updateSection(index, content)}
                    onRemove={() => removeSection(index)}
                    isActive={activeSection === section.type}
                    onToggle={() =>
                      setActiveSection(
                        activeSection === section.type ? null : section.type
                      )
                    }
                    jobDescription={jobDescription}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Preview & AI */}
          <div className="space-y-6">
            {/* Resume Preview */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              </div>
              <div className="p-4">
                <ResumePreview resumeData={resumeData} />
              </div>
            </div>

            {/* AI Panel */}
            {showAIPanel && (
              <AIPanel
                resumeData={resumeData}
                jobDescription={jobDescription}
                onUpdate={(updatedData) => setResumeData(updatedData)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
