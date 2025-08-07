// app/resume/[id]/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, Loader2, Download, ArrowLeft, Sparkles } from "lucide-react";
import ResumeTemplate from "@/components/ResumeTemplate";

interface Resume {
  id: string;
  title: string;
  description?: string;
  sections: Array<{
    id: string;
    type: string;
    title: string;
    content: any;
    order: number;
  }>;
}

interface FormData {
  title: string;
  personal: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
    current?: boolean;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    graduationYear: string;
    gpa?: string;
  }>;
  skills: string[];
}

const EditResumePage = () => {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [aiLoading, setAiLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
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
    experience: [],
    education: [],
    skills: [],
  });

  useEffect(() => {
    if (params.id) {
      fetchResume();
    }
  }, [params.id]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resumes/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Resume not found");
        } else if (response.status === 401) {
          router.push("/sign-in");
          return;
        } else {
          setError("Failed to load resume");
        }
        return;
      }

      const data = await response.json();
      setResume(data.resume);
      
      // Transform resume data to form format
      const transformedData: FormData = {
        title: data.resume.title,
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
        experience: [],
        education: [],
        skills: [],
      };

      // Parse sections
      data.resume.sections.forEach((section: any) => {
        switch (section.type) {
          case "PERSONAL_INFO":
            transformedData.personal = {
              firstName: section.content.firstName || "",
              lastName: section.content.lastName || "",
              title: section.content.title || "",
              email: section.content.email || "",
              phone: section.content.phone || "",
              location: section.content.location || "",
              website: section.content.website || "",
              linkedin: section.content.linkedin || "",
            };
            break;
          case "SUMMARY":
            transformedData.summary = section.content.text || "";
            break;
          case "EXPERIENCE":
            transformedData.experience = section.content.items || [];
            break;
          case "EDUCATION":
            transformedData.education = section.content.items || [];
            break;
          case "SKILLS":
            if (section.content.categories && section.content.categories[0]) {
              transformedData.skills = section.content.categories[0].skills || [];
            }
            break;
        }
      });

      setFormData(transformedData);
    } catch (error) {
      console.error("Error fetching resume:", error);
      setError("Failed to load resume");
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      // Transform form data back to sections format
      const sections = [
        {
          type: "PERSONAL_INFO",
          title: "Personal Information",
          content: formData.personal,
        },
        {
          type: "SUMMARY",
          title: "Professional Summary",
          content: { text: formData.summary },
        },
        {
          type: "EXPERIENCE",
          title: "Work Experience",
          content: { items: formData.experience },
        },
        {
          type: "EDUCATION",
          title: "Education",
          content: { items: formData.education },
        },
        {
          type: "SKILLS",
          title: "Skills",
          content: { 
            categories: [{ 
              name: "Skills", 
              skills: formData.skills.filter(s => s.trim()) 
            }] 
          },
        },
      ];

      const response = await fetch(`/api/resumes/${params.id}/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });

      if (!response.ok) {
        throw new Error("Failed to save resume");
      }

      // Update resume title if changed
      if (formData.title !== resume?.title) {
        await fetch(`/api/resumes/${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            title: formData.title,
            description: resume?.description 
          }),
        });
      }

      alert("Resume saved successfully!");
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const enhanceWithAI = async (section: string, index?: number) => {
    setAiLoading(true);
    try {
      let content = "";
      let type = "";

      if (section === "summary") {
        content = formData.summary;
        type = "generate_summary";
      } else if (section === "experience" && typeof index === "number") {
        content = formData.experience[index]?.description || "";
        type = "enhance_section";
      } else if (section === "skills") {
        content = formData.skills.join(", ");
        type = "suggest_skills";
      }

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          content,
          sectionType: section,
          experience: formData.experience,
          skills: formData.skills.filter(s => s.trim()),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (section === "summary") {
          setFormData(prev => ({ ...prev, summary: result.content }));
        } else if (section === "experience" && typeof index === "number") {
          setFormData(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) => 
              i === index ? { ...exp, description: result.content } : exp
            )
          }));
        } else if (section === "skills") {
          const skillsArray = result.content.split(",").map((s: string) => s.trim()).filter((s: string) => s);
          setFormData(prev => ({ ...prev, skills: skillsArray }));
        }
      } else {
        throw new Error("AI enhancement failed");
      }
    } catch (error) {
      console.error("AI enhancement error:", error);
      alert("AI enhancement failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const exportResume = async (format: string = "pdf") => {
    try {
      const response = await fetch(`/api/resumes/${params.id}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) {
        throw new Error("Failed to export resume");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.title || "resume"}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export resume. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || "Resume not found"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "summary", label: "Summary" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  placeholder="Resume Title"
                />
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(resume.updatedAt || resume.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => exportResume("pdf")}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={saveResume}
                disabled={saving}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition space-x-2 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Left: Editor */}
        <div className="w-1/2 bg-white rounded-xl shadow-lg">
          {/* Tabs */}
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "personal" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="First Name"
                    value={formData.personal.firstName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, firstName: e.target.value }
                    }))}
                  />
                  <input
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Last Name"
                    value={formData.personal.lastName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, lastName: e.target.value }
                    }))}
                  />
                </div>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Professional Title"
                  value={formData.personal.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, title: e.target.value }
                  }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email"
                    type="email"
                    value={formData.personal.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, email: e.target.value }
                    }))}
                  />
                  <input
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone"
                    value={formData.personal.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, phone: e.target.value }
                    }))}
                  />
                </div>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Location"
                  value={formData.personal.location}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personal: { ...prev.personal, location: e.target.value }
                  }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Website (optional)"
                    value={formData.personal.website || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, website: e.target.value }
                    }))}
                  />
                  <input
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="LinkedIn (optional)"
                    value={formData.personal.linkedin || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, linkedin: e.target.value }
                    }))}
                  />
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Professional Summary</h3>
                  <button
                    onClick={() => enhanceWithAI("summary")}
                    disabled={aiLoading}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition space-x-2 disabled:opacity-60"
                  >
                    {aiLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Enhance with AI</span>
                  </button>
                </div>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write a compelling professional summary..."
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                />
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Work Experience</h3>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <button
                        onClick={() => enhanceWithAI("experience", index)}
                        disabled={aiLoading}
                        className="flex items-center px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition space-x-1 disabled:opacity-60"
                      >
                        {aiLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        <span>AI</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index].company = e.target.value;
                          setFormData(prev => ({ ...prev, experience: newExp }));
                        }}
                      />
                      <input
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index].title = e.target.value;
                          setFormData(prev => ({ ...prev, experience: newExp }));
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index].startDate = e.target.value;
                          setFormData(prev => ({ ...prev, experience: newExp }));
                        }}
                      />
                      <input
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index].endDate = e.target.value;
                          setFormData(prev => ({ ...prev, experience: newExp }));
                        }}
                      />
                    </div>
                    <textarea
                      className="w-full border rounded px-3 py-2 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description of achievements and responsibilities..."
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index].description = e.target.value;
                        setFormData(prev => ({ ...prev, experience: newExp }));
                      }}
                    />
                  </div>
                ))}
                <button
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    experience: [...prev.experience, {
                      company: "",
                      title: "",
                      startDate: "",
                      endDate: "",
                      description: ""
                    }]
                  }))}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition"
                >
                  + Add Experience
                </button>
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Education</h3>
                {formData.education.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    <input
                      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].institution = e.target.value;
                        setFormData(prev => ({ ...prev, education: newEdu }));
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...formData.education];
                          newEdu[index].degree = e.target.value;
                          setFormData(prev => ({ ...prev, education: newEdu }));
                        }}
                      />
                      <input
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Field of Study"
                        value={edu.field || ""}
                        onChange={(e) => {
                          const newEdu = [...formData.education];
                          newEdu[index].field = e.target.value;
                          setFormData(prev => ({ ...prev, education: newEdu }));
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Graduation Year"
                        value={edu.graduationYear}
                        onChange={(e) => {
                          const newEdu = [...formData.education];
                          newEdu[index].graduationYear = e.target.value;
                          setFormData(prev => ({ ...prev, education: newEdu }));
                        }}
                      />
                      <input
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="GPA (optional)"
                        value={edu.gpa || ""}
                        onChange={(e) => {
                          const newEdu = [...formData.education];
                          newEdu[index].gpa = e.target.value;
                          setFormData(prev => ({ ...prev, education: newEdu }));
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    education: [...prev.education, {
                      institution: "",
                      degree: "",
                      field: "",
                      graduationYear: "",
                      gpa: ""
                    }]
                  }))}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition"
                >
                  + Add Education
                </button>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <button
                    onClick={() => enhanceWithAI("skills")}
                    disabled={aiLoading}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition space-x-2 disabled:opacity-60"
                  >
                    {aiLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Suggest with AI</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter a skill"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...formData.skills];
                          newSkills[index] = e.target.value;
                          setFormData(prev => ({ ...prev, skills: newSkills }));
                        }}
                      />
                      {formData.skills.length > 1 && (
                        <button
                          onClick={() => {
                            const newSkills = formData.skills.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    skills: [...prev.skills, ""]
                  }))}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition"
                >
                  + Add Skill
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-1/2">
          <div className="sticky top-32">
            <ResumeTemplate data={formData} className="transform scale-75 origin-top" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditResumePage;