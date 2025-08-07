// app/resume/create/page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  User,
  Briefcase,
  BookOpen,
  Star,
  Loader2,
  Plus,
  Trash2,
  Save,
  ChevronRight,
  ChevronLeft,
  Check,
  Brain,
  FileText,
  Zap,
  ArrowLeft,
} from "lucide-react";
import ResumeTemplate from "@/components/ResumeTemplate";

const steps = [
  {
    label: "Personal Info",
    icon: User,
    description: "Basic contact information",
  },
  { label: "Summary", icon: Star, description: "Professional overview" },
  {
    label: "Experience",
    icon: Briefcase,
    description: "Work history & achievements",
  },
  { label: "Education", icon: BookOpen, description: "Academic background" },
  { label: "Skills", icon: Zap, description: "Technical & soft skills" },
];

const initialData = {
  title: "My Resume",
  personal: {
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
  },
  summary: "",
  experience: [
    {
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  ],
  education: [
    {
      institution: "",
      degree: "",
      field: "",
      graduationYear: "",
      gpa: "",
    },
  ],
  skills: [""],
};

export default function CreateResumePage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoadingIdx, setAiLoadingIdx] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(initialData);
  const router = useRouter();

  // AI Generation Handlers
  const generateSummaryAI = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "generate_summary",
          experience: data.experience,
          skills: data.skills.filter((s) => s.trim()),
          jobDescription: "",
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setData((d) => ({ ...d, summary: result.content }));
      } else {
        throw new Error("AI generation failed");
      }
    } catch (err) {
      alert("AI summary generation failed. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const enhanceExperienceAI = async (idx: number) => {
    setAiLoadingIdx(idx);
    try {
      const exp = data.experience[idx];
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "enhance_section",
          sectionType: "experience",
          content: exp.description,
          jobDescription: "",
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setData((d) => {
          const arr = [...d.experience];
          arr[idx].description = result.content;
          return { ...d, experience: arr };
        });
      } else {
        throw new Error("AI enhancement failed");
      }
    } catch (err) {
      alert("AI enhancement failed. Please try again.");
      console.error(err);
    }
    setAiLoadingIdx(-1);
  };

  const suggestSkillsAI = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "suggest_skills",
          content: data.skills.filter((s) => s.trim()).join(", "),
          jobDescription: "",
        }),
      });

      if (res.ok) {
        const result = await res.json();
        const skillsArray = result.content
          .split(",")
          .map((s: string) => s.trim())
          .filter((s: string) => s);
        setData((d) => ({ ...d, skills: skillsArray }));
      } else {
        throw new Error("AI skill suggestion failed");
      }
    } catch (err) {
      alert("AI skill suggestion failed. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  // Form handlers
  const handleChange = (
    section: string,
    field: string,
    value: string,
    idx = 0
  ) => {
    if (["experience", "education"].includes(section)) {
      setData((d) => {
        const arr = [...(d as any)[section]];
        arr[idx][field] = value;
        return { ...d, [section]: arr };
      });
    } else if (section === "skills") {
      setData((d) => {
        const arr = [...d.skills];
        arr[idx] = value;
        return { ...d, skills: arr };
      });
    } else if (section === "personal") {
      setData((d) => ({
        ...d,
        personal: { ...d.personal, [field]: value },
      }));
    } else {
      setData((d) => ({
        ...d,
        [section]: value,
      }));
    }
  };

  const addItem = (section: string) => {
    if (section === "experience") {
      setData((d) => ({
        ...d,
        experience: [
          ...d.experience,
          {
            company: "",
            title: "",
            startDate: "",
            endDate: "",
            description: "",
            current: false,
          },
        ],
      }));
    } else if (section === "education") {
      setData((d) => ({
        ...d,
        education: [
          ...d.education,
          {
            institution: "",
            degree: "",
            field: "",
            graduationYear: "",
            gpa: "",
          },
        ],
      }));
    } else if (section === "skills") {
      setData((d) => ({
        ...d,
        skills: [...d.skills, ""],
      }));
    }
  };

  const removeItem = (section: string, idx: number) => {
    if (section === "experience" && data.experience.length > 1) {
      setData((d) => ({
        ...d,
        experience: d.experience.filter((_, i) => i !== idx),
      }));
    } else if (section === "education" && data.education.length > 1) {
      setData((d) => ({
        ...d,
        education: d.education.filter((_, i) => i !== idx),
      }));
    } else if (section === "skills" && data.skills.length > 1) {
      setData((d) => ({
        ...d,
        skills: d.skills.filter((_, i) => i !== idx),
      }));
    }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      const sections = [
        {
          type: "PERSONAL_INFO",
          title: "Personal Information",
          content: data.personal,
        },
        {
          type: "SUMMARY",
          title: "Professional Summary",
          content: { text: data.summary },
        },
        {
          type: "EXPERIENCE",
          title: "Work Experience",
          content: { items: data.experience },
        },
        {
          type: "EDUCATION",
          title: "Education",
          content: { items: data.education },
        },
        {
          type: "SKILLS",
          title: "Skills",
          content: {
            categories: [
              { name: "Skills", skills: data.skills.filter((s) => s.trim()) },
            ],
          },
        },
      ];

      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: "Resume created with AI assistance",
          sections,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        router.push(`/resume/${result.resume.id}`);
      } else {
        throw new Error("Failed to save resume");
      }
    } catch (err) {
      alert("Failed to save resume. Please try again.");
      console.error(err);
    }
    setSaving(false);
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Resume Builder
                </h1>
                <p className="text-sm text-gray-600">
                  Create your professional resume with AI assistance
                </p>
              </div>
            </div>
            <button
              onClick={saveResume}
              disabled={saving}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:transform-none space-x-2"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>Save Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20 sticky top-[73px] z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center flex-1 relative"
              >
                {/* Connection Line */}
                {i < steps.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                      style={{ width: i < step ? "100%" : "0%" }}
                    />
                  </div>
                )}

                {/* Step Circle */}
                <div
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-3 border-2 transition-all duration-300 ${
                    i < step
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-lg"
                      : i === step
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-500 shadow-lg animate-pulse"
                      : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {i < step ? <Check size={20} /> : <s.icon size={20} />}
                </div>

                {/* Step Label */}
                <div className="text-center">
                  <span
                    className={`text-sm font-semibold ${
                      i === step
                        ? "text-blue-600"
                        : i < step
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {s.label}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 max-w-24">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto px-6 py-8 gap-8">
        {/* Left: Form */}
        <div className="w-1/2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {steps[step].label}
                </h2>
                <p className="text-gray-600">{steps[step].description}</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                <FileText size={16} />
                <span>
                  Step {step + 1} of {steps.length}
                </span>
              </div>
            </div>

            {/* Step Forms */}
            <div className="space-y-6">
              {step === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        First Name *
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="John"
                        value={data.personal.firstName}
                        onChange={(e) =>
                          handleChange("personal", "firstName", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Last Name *
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Doe"
                        value={data.personal.lastName}
                        onChange={(e) =>
                          handleChange("personal", "lastName", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Professional Title *
                    </label>
                    <input
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Senior Software Developer"
                      value={data.personal.title}
                      onChange={(e) =>
                        handleChange("personal", "title", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Email Address *
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="john.doe@email.com"
                        type="email"
                        value={data.personal.email}
                        onChange={(e) =>
                          handleChange("personal", "email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="+1 (555) 123-4567"
                        value={data.personal.phone}
                        onChange={(e) =>
                          handleChange("personal", "phone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Location *
                    </label>
                    <input
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="New York, NY"
                      value={data.personal.location}
                      onChange={(e) =>
                        handleChange("personal", "location", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Website
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="www.johndoe.com"
                        value={data.personal.website}
                        onChange={(e) =>
                          handleChange("personal", "website", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        LinkedIn
                      </label>
                      <input
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="linkedin.com/in/johndoe"
                        value={data.personal.linkedin}
                        onChange={(e) =>
                          handleChange("personal", "linkedin", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Professional Summary
                    </label>
                    <textarea
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      placeholder="Write a compelling professional summary that highlights your key achievements, skills, and what makes you unique..."
                      value={data.summary}
                      onChange={(e) =>
                        handleChange("summary", "", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      disabled={loading}
                      onClick={generateSummaryAI}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:transform-none space-x-2"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Brain className="w-5 h-5" />
                      )}
                      <span>Generate with AI</span>
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {data.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="border-2 border-gray-200 rounded-2xl p-6 space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-bold text-gray-800">
                          Experience #{idx + 1}
                        </h4>
                        {data.experience.length > 1 && (
                          <button
                            onClick={() => removeItem("experience", idx)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Company
                          </label>
                          <input
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) =>
                              handleChange(
                                "experience",
                                "company",
                                e.target.value,
                                idx
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Job Title
                          </label>
                          <input
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Job Title"
                            value={exp.title}
                            onChange={(e) =>
                              handleChange(
                                "experience",
                                "title",
                                e.target.value,
                                idx
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Start Date
                          </label>
                          <input
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Jan 2020"
                            value={exp.startDate}
                            onChange={(e) =>
                              handleChange(
                                "experience",
                                "startDate",
                                e.target.value,
                                idx
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            End Date
                          </label>
                          <input
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Present"
                            value={exp.endDate}
                            onChange={(e) =>
                              handleChange(
                                "experience",
                                "endDate",
                                e.target.value,
                                idx
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Description
                        </label>
                        <textarea
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                          placeholder="Describe your achievements, responsibilities, and impact using action verbs and quantifiable results..."
                          value={exp.description}
                          onChange={(e) =>
                            handleChange(
                              "experience",
                              "description",
                              e.target.value,
                              idx
                            )
                          }
                        />
                      </div>

                      <div className="flex justify-center">
                        <button
                          disabled={aiLoadingIdx === idx}
                          onClick={() => enhanceExperienceAI(idx)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:transform-none space-x-2"
                        >
                          {aiLoadingIdx === idx ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Brain className="w-4 h-4" />
                          )}
                          <span>Enhance with AI</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addItem("experience")}
                    className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-blue-300 rounded-2xl text-blue-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all space-x-2 w-full"
                  >
                    <Plus size={20} />
                    <span className="font-semibold">
                      Add Another Experience
                    </span>
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {data.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="border-2 border-gray-200 rounded-2xl p-6 space-y-4 bg-gradient-to-r from-green-50 to-emerald-50"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-bold text-gray-800">
                          Education #{idx + 1}
                        </h4>
                        {data.education.length > 1 && (
                          <button
                            onClick={() => removeItem("education", idx)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Institution
                        </label>
                        <input
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="University Name"
                          value={edu.institution}
                          onChange={(e) =>
                            handleChange(
                              "education",
                              "institution",
                              e.target.value,
                              idx
                            )
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Degree
                          </label>
                          <input
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Bachelor of Science"
                            value={edu.degree}
                            onChange={(e) =>
                              handleChange(
                                "education",
                                "degree",
                                e.target.value,
                                idx
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Field of Study
                          </label>
                          <input
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Computer Science"
                            value={edu.field}
                            onChange={(e) =>
                              handleChange(
                                "education",
                                "field",
                                e.target.value,
                                idx
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Graduation Year
                          </label>
                          <input
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="2023"
                            value={edu.graduationYear}
                            onChange={(e) =>
                              handleChange(
                                "education",
                                "graduationYear",
                                e.target.value,
                                idx
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            GPA (Optional)
                          </label>
                          <input
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="3.8"
                            value={edu.gpa}
                            onChange={(e) =>
                              handleChange(
                                "education",
                                "gpa",
                                e.target.value,
                                idx
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addItem("education")}
                    className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-green-300 rounded-2xl text-green-600 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all space-x-2 w-full"
                  >
                    <Plus size={20} />
                    <span className="font-semibold">Add Another Education</span>
                  </button>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {data.skills.map((skill, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="flex-1 space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Skill #{idx + 1}
                          </label>
                          <input
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="e.g., JavaScript, Project Management, Adobe Photoshop"
                            value={skill}
                            onChange={(e) =>
                              handleChange("skills", "", e.target.value, idx)
                            }
                          />
                        </div>
                        {data.skills.length > 1 && (
                          <button
                            onClick={() => removeItem("skills", idx)}
                            className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <button
                      onClick={() => addItem("skills")}
                      className="flex items-center px-6 py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all space-x-2"
                    >
                      <Plus size={18} />
                      <span className="font-semibold">Add Skill</span>
                    </button>
                    <button
                      disabled={loading}
                      onClick={suggestSkillsAI}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:transform-none space-x-2"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Brain className="w-5 h-5" />
                      )}
                      <span>Suggest with AI</span>
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-200">
              <button
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed space-x-2"
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>
                  Step {step + 1} of {steps.length}
                </span>
              </div>

              {step < steps.length - 1 ? (
                <button
                  onClick={() =>
                    setStep((s) => Math.min(steps.length - 1, s + 1))
                  }
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg space-x-2"
                >
                  <span>Next Step</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={saveResume}
                  disabled={saving}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:transform-none space-x-2"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check size={18} />
                  )}
                  <span>Finish & Save</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="w-1/2">
          <div className="sticky top-[200px]">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Live Preview
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  <FileText size={14} />
                  <span>Real-time</span>
                </div>
              </div>
              <div className="bg-white rounded-xl border-2 border-gray-100 shadow-inner overflow-hidden">
                <ResumeTemplate
                  data={data}
                  className="transform scale-75 origin-top-left"
                />
              </div>
            </div>

            {/* AI Tips Card */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white">
                  <Brain size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">AI Tips</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    {step === 0 && (
                      <p>
                        Use your professional email and ensure your phone number
                        is current. A LinkedIn profile can boost your
                        credibility.
                      </p>
                    )}
                    {step === 1 && (
                      <p>
                        A strong summary should be 2-3 sentences highlighting
                        your key achievements and what makes you unique. Let AI
                        help craft it!
                      </p>
                    )}
                    {step === 2 && (
                      <p>
                        Focus on achievements with numbers (increased sales by
                        30%) rather than just listing duties. Use action verbs
                        like "led," "improved," "created."
                      </p>
                    )}
                    {step === 3 && (
                      <p>
                        List your most recent and relevant education first.
                        Include honors, relevant coursework, or projects if
                        you're a recent graduate.
                      </p>
                    )}
                    {step === 4 && (
                      <p>
                        Mix technical skills (programming languages, software)
                        with soft skills (leadership, communication). Tailor to
                        your target job!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
