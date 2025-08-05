"use client";
import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  User,
  Briefcase,
  BookOpen,
  Star,
  Loader2,
} from "lucide-react";
import axios from "axios";

const steps = [
  { label: "Personal Info", icon: User },
  { label: "Summary", icon: Star },
  { label: "Experience", icon: Briefcase },
  { label: "Education", icon: BookOpen },
  { label: "Skills", icon: Star },
];

const initialData = {
  personal: { name: "", title: "", email: "", phone: "", location: "" },
  summary: "",
  experience: [{ company: "", title: "", start: "", end: "", description: "" }],
  education: [{ institution: "", degree: "", year: "" }],
  skills: [""],
};

export default function CreateResumePage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoadingIdx, setAiLoadingIdx] = useState(-1); // for experience enhance
  const [data, setData] = useState(initialData);

  // AI Generation Handlers
  const generateSummaryAI = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/generate", {
        type: "generate_summary",
        experience: data.experience,
        skills: data.skills,
        jobDescription: "", // Optionally add job description
      });
      setData((d) => ({ ...d, summary: res.data.content }));
    } catch (err) {
      alert("AI summary generation failed. Please try again.");
    }
    setLoading(false);
  };

  const enhanceExperienceAI = async (idx) => {
    setAiLoadingIdx(idx);
    try {
      const exp = data.experience[idx];
      const res = await axios.post("/api/ai/generate", {
        type: "enhance_section",
        sectionType: "EXPERIENCE",
        content: exp.description,
        jobDescription: "", // Optionally add job description
      });
      setData((d) => {
        const arr = [...d.experience];
        arr[idx].description = res.data.content;
        return { ...d, experience: arr };
      });
    } catch (err) {
      alert("AI enhancement failed. Please try again.");
    }
    setAiLoadingIdx(-1);
  };

  const suggestSkillsAI = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/generate", {
        type: "suggest_skills",
        content: data.skills.join(", "),
        jobDescription: "", // Optionally add job description
      });
      setData((d) => ({
        ...d,
        skills: res.data.content.split(",").map((s) => s.trim()),
      }));
    } catch (err) {
      alert("AI skill suggestion failed. Please try again.");
    }
    setLoading(false);
  };

  // Form handlers
  const handleChange = (section, field, value, idx = 0) => {
    if (["experience", "education"].includes(section)) {
      setData((d) => {
        const arr = [...d[section]];
        arr[idx][field] = value;
        return { ...d, [section]: arr };
      });
    } else if (section === "skills") {
      setData((d) => {
        const arr = [...d.skills];
        arr[idx] = value;
        return { ...d, skills: arr };
      });
    } else {
      setData((d) => ({
        ...d,
        [section]: field ? { ...d[section], [field]: value } : value,
      }));
    }
  };

  // Progress bar width
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              ResumeAi
            </span>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="sticky top-16 z-20 w-full bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between py-4 px-4">
          {steps.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center flex-1">
              <s.icon
                className={`w-6 h-6 mb-1 ${
                  i <= step ? "text-blue-600" : "text-gray-300"
                }`}
              />
              <span
                className={`text-xs font-semibold ${
                  i === step ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className="w-full h-1 bg-gray-200 mt-2" />
              )}
            </div>
          ))}
        </div>
        <div
          className="h-1 bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 py-12 gap-8">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-lg p-8 mb-8 md:mb-0">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {steps[step].label}
          </h2>
          {/* Section Form */}
          {step === 0 && (
            <div className="space-y-4">
              <input
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Full Name"
                value={data.personal.name}
                onChange={(e) =>
                  handleChange("personal", "name", e.target.value)
                }
              />
              <input
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Job Title"
                value={data.personal.title}
                onChange={(e) =>
                  handleChange("personal", "title", e.target.value)
                }
              />
              <input
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Email"
                value={data.personal.email}
                onChange={(e) =>
                  handleChange("personal", "email", e.target.value)
                }
              />
              <input
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Phone"
                value={data.personal.phone}
                onChange={(e) =>
                  handleChange("personal", "phone", e.target.value)
                }
              />
              <input
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Location"
                value={data.personal.location}
                onChange={(e) =>
                  handleChange("personal", "location", e.target.value)
                }
              />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <textarea
                className="w-full border rounded-lg px-4 py-3 min-h-[100px]"
                placeholder="Professional Summary"
                value={data.summary}
                onChange={(e) => handleChange("summary", null, e.target.value)}
              />
              <button
                disabled={loading}
                onClick={generateSummaryAI}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition space-x-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Generate with AI</span>
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-8">
              {data.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <input
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      handleChange("experience", "company", e.target.value, idx)
                    }
                  />
                  <input
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="Title"
                    value={exp.title}
                    onChange={(e) =>
                      handleChange("experience", "title", e.target.value, idx)
                    }
                  />
                  <input
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="Start Year"
                    value={exp.start}
                    onChange={(e) =>
                      handleChange("experience", "start", e.target.value, idx)
                    }
                  />
                  <input
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="End Year"
                    value={exp.end}
                    onChange={(e) =>
                      handleChange("experience", "end", e.target.value, idx)
                    }
                  />
                  <textarea
                    className="w-full border rounded-lg px-4 py-3 min-h-[60px]"
                    placeholder="Description"
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
                  <button
                    disabled={aiLoadingIdx === idx}
                    onClick={() => enhanceExperienceAI(idx)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition space-x-2 disabled:opacity-60 mt-2"
                  >
                    {aiLoadingIdx === idx ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Enhance with AI</span>
                  </button>
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx} className="space-y-2">
                  <input
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="Institution"
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
                  <input
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      handleChange("education", "degree", e.target.value, idx)
                    }
                  />
                  <input
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) =>
                      handleChange("education", "year", e.target.value, idx)
                    }
                  />
                </div>
              ))}
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              {data.skills.map((skill, idx) => (
                <input
                  key={idx}
                  className="w-full border rounded-lg px-4 py-3"
                  placeholder="Skill"
                  value={skill}
                  onChange={(e) =>
                    handleChange("skills", null, e.target.value, idx)
                  }
                />
              ))}
              <button
                disabled={loading}
                onClick={suggestSkillsAI}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition space-x-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Suggest with AI</span>
              </button>
            </div>
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              Back
            </button>
            {step < steps.length - 1 ? (
              <button
                onClick={() =>
                  setStep((s) => Math.min(steps.length - 1, s + 1))
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Next
              </button>
            ) : (
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                Finish
              </button>
            )}
          </div>
        </div>

        {/* Right: Live Preview - Professional CV Template */}
        <div className="w-full md:w-1/2 flex justify-center items-start">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-0 overflow-hidden mt-4 md:mt-0">
            {/* Header */}
            <div className="flex flex-col items-center bg-gradient-to-r from-blue-50 to-blue-100 py-8 px-6 border-b border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {data.personal.name || "Your Name"}
              </h2>
              <div className="text-blue-600 font-semibold text-lg mb-1">
                {data.personal.title || "Job Title"}
              </div>
              <div className="text-gray-500 text-sm">
                {data.personal.location || "Location"}
              </div>
              <div className="text-gray-400 text-xs mt-2">
                {data.personal.email || "your@email.com"} |{" "}
                {data.personal.phone || "Phone"}
              </div>
            </div>
            {/* Main Content */}
            <div className="px-8 py-8">
              {/* Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1 tracking-wide">
                  Professional Summary
                </h3>
                <div className="text-gray-700 text-base min-h-[48px]">
                  {data.summary || (
                    <span className="text-gray-300">
                      Your summary will appear here...
                    </span>
                  )}
                </div>
              </div>
              {/* Experience */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1 tracking-wide">
                  Work Experience
                </h3>
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        {exp.title || "Title"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {exp.start || "Start"} - {exp.end || "End"}
                      </span>
                    </div>
                    <div className="text-blue-700 font-medium text-sm">
                      {exp.company || "Company"}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {exp.description || (
                        <span className="text-gray-300">Description...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Education */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1 tracking-wide">
                  Education
                </h3>
                {data.education.map((edu, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        {edu.degree || "Degree"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {edu.year || "Year"}
                      </span>
                    </div>
                    <div className="text-blue-700 font-medium text-sm">
                      {edu.institution || "Institution"}
                    </div>
                  </div>
                ))}
              </div>
              {/* Skills */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1 tracking-wide">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                    >
                      {skill || <span className="text-gray-300">Skill</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
