"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Wand2, Plus, X } from "lucide-react";

interface SectionProps {
  section: {
    type: string;
    title: string;
    content: any;
    order: number;
  };
  onUpdate: (content: any) => void;
  onRemove: () => void;
  isActive: boolean;
  onToggle: () => void;
  jobDescription: string;
}

const ResumeSection: React.FC<SectionProps> = ({
  section,
  onUpdate,
  onRemove,
  isActive,
  onToggle,
  jobDescription,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const enhanceWithAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "enhance_section",
          content: JSON.stringify(section.content),
          jobDescription,
          context: section.type,
        }),
      });

      if (response.ok) {
        const { content } = await response.json();
        onUpdate(JSON.parse(content));
      }
    } catch (error) {
      console.error("Error enhancing section:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderSectionContent = () => {
    switch (section.type) {
      case "PERSONAL_INFO":
        return (
          <PersonalInfoSection content={section.content} onUpdate={onUpdate} />
        );
      case "SUMMARY":
        return <SummarySection content={section.content} onUpdate={onUpdate} />;
      case "EXPERIENCE":
        return (
          <ExperienceSection content={section.content} onUpdate={onUpdate} />
        );
      case "EDUCATION":
        return (
          <EducationSection content={section.content} onUpdate={onUpdate} />
        );
      case "SKILLS":
        return <SkillsSection content={section.content} onUpdate={onUpdate} />;
      case "PROJECTS":
        return (
          <ProjectsSection content={section.content} onUpdate={onUpdate} />
        );
      case "CERTIFICATIONS":
        return (
          <CertificationsSection
            content={section.content}
            onUpdate={onUpdate}
          />
        );
      case "LANGUAGES":
        return (
          <LanguagesSection content={section.content} onUpdate={onUpdate} />
        );
      default:
        return <div>Unknown section type</div>;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={onToggle}
          className="flex items-center space-x-3 text-left flex-1"
        >
          {isActive ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
          <span className="font-semibold text-gray-900">{section.title}</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={enhanceWithAI}
            disabled={isGenerating}
            className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
            title="Enhance with AI"
          >
            <Wand2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRemove}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Remove section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isActive && <div className="p-4">{renderSectionContent()}</div>}
    </div>
  );
};

// Section Components
const PersonalInfoSection: React.FC<{
  content: any;
  onUpdate: (content: any) => void;
}> = ({ content, onUpdate }) => {
  const updateField = (field: string, value: string) => {
    onUpdate({ ...content, [field]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <input
          type="text"
          value={content.firstName || ""}
          onChange={(e) => updateField("firstName", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <input
          type="text"
          value={content.lastName || ""}
          onChange={(e) => updateField("lastName", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={content.email || ""}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          value={content.phone || ""}
          onChange={(e) => updateField("phone", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={content.location || ""}
          onChange={(e) => updateField("location", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn
        </label>
        <input
          type="url"
          value={content.linkedin || ""}
          onChange={(e) => updateField("linkedin", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>
    </div>
  );
};

const SummarySection: React.FC<{
  content: any;
  onUpdate: (content: any) => void;
}> = ({ content, onUpdate }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Professional Summary
      </label>
      <textarea
        value={content.text || ""}
        onChange={(e) => onUpdate({ ...content, text: e.target.value })}
        rows={4}
        placeholder="Write a compelling professional summary..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
      />
    </div>
  );
};

const ExperienceSection: React.FC<{
  content: any;
  onUpdate: (content: any) => void;
}> = ({ content, onUpdate }) => {
  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onUpdate({ ...content, items: [...(content.items || []), newExperience] });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updatedItems = [...(content.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onUpdate({ ...content, items: updatedItems });
  };

  const removeExperience = (index: number) => {
    const updatedItems = (content.items || []).filter(
      (_: any, i: number) => i !== index
    );
    onUpdate({ ...content, items: updatedItems });
  };

  return (
    <div className="space-y-4">
      {(content.items || []).map((exp: any, index: number) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">
              Experience {index + 1}
            </h4>
            <button
              onClick={() => removeExperience(index)}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={exp.title || ""}
                onChange={(e) =>
                  updateExperience(index, "title", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                value={exp.company || ""}
                onChange={(e) =>
                  updateExperience(index, "company", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={exp.location || ""}
                onChange={(e) =>
                  updateExperience(index, "location", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="month"
                value={exp.startDate || ""}
                onChange={(e) =>
                  updateExperience(index, "startDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="month"
                value={exp.endDate || ""}
                onChange={(e) =>
                  updateExperience(index, "endDate", e.target.value)
                }
                disabled={exp.current}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={exp.current || false}
              onChange={(e) =>
                updateExperience(index, "current", e.target.checked)
              }
              className="mr-2"
            />
            <label className="text-sm text-gray-700">Current Position</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={exp.description || ""}
              onChange={(e) =>
                updateExperience(index, "description", e.target.value)
              }
              rows={3}
              placeholder="Describe your responsibilities and achievements..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-black hover:text-black transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        <span>Add Experience</span>
      </button>
    </div>
  );
};

const EducationSection: React.FC<{
  content: any;
  onUpdate: (content: any) => void;
}> = ({ content, onUpdate }) => {
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
    };
    onUpdate({ ...content, items: [...(content.items || []), newEducation] });
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updatedItems = [...(content.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onUpdate({ ...content, items: updatedItems });
  };

  const removeEducation = (index: number) => {
    const updatedItems = (content.items || []).filter(
      (_: any, i: number) => i !== index
    );
    onUpdate({ ...content, items: updatedItems });
  };

  return (
    <div className="space-y-4">
      {(content.items || []).map((edu: any, index: number) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
            <button
              onClick={() => removeEducation(index)}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
              </label>
              <input
                type="text"
                value={edu.degree || ""}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution
              </label>
              <input
                type="text"
                value={edu.institution || ""}
                onChange={(e) =>
                  updateEducation(index, "institution", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={edu.location || ""}
                onChange={(e) =>
                  updateEducation(index, "location", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="month"
                value={edu.startDate || ""}
                onChange={(e) =>
                  updateEducation(index, "startDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="month"
                value={edu.endDate || ""}
                onChange={(e) =>
                  updateEducation(index, "endDate", e.target.value)
                }
                disabled={edu.current}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={edu.current || false}
                onChange={(e) =>
                  updateEducation(index, "current", e.target.checked)
                }
                className="mr-2"
              />
              <label className="text-sm text-gray-700">
                Currently Studying
              </label>
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA
              </label>
              <input
                type="text"
                value={edu.gpa || ""}
                onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                placeholder="3.8"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-black hover:text-black transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        <span>Add Education</span>
      </button>
    </div>
  );
};

const SkillsSection: React.FC<{
  content: any;
  onUpdate: (content: any) => void;
}> = ({ content, onUpdate }) => {
  const addCategory = () => {
    const newCategory = {
      id: Date.now(),
      name: "",
      skills: [],
    };
    onUpdate({
      ...content,
      categories: [...(content.categories || []), newCategory],
    });
  };

  const updateCategory = (index: number, field: string, value: any) => {
    const updatedCategories = [...(content.categories || [])];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    onUpdate({ ...content, categories: updatedCategories });
  };

  const removeCategory = (index: number) => {
    const updatedCategories = (content.categories || []).filter(
      (_: any, i: number) => i !== index
    );
    onUpdate({ ...content, categories: updatedCategories });
  };

  const addSkill = (categoryIndex: number) => {
    const updatedCategories = [...(content.categories || [])];
    updatedCategories[categoryIndex].skills.push("");
    onUpdate({ ...content, categories: updatedCategories });
  };

  const updateSkill = (
    categoryIndex: number,
    skillIndex: number,
    value: string
  ) => {
    const updatedCategories = [...(content.categories || [])];
    updatedCategories[categoryIndex].skills[skillIndex] = value;
    onUpdate({ ...content, categories: updatedCategories });
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updatedCategories = [...(content.categories || [])];
    updatedCategories[categoryIndex].skills.splice(skillIndex, 1);
    onUpdate({ ...content, categories: updatedCategories });
  };

  return (
    <div className="space-y-4">
      {(content.categories || []).map(
        (category: any, categoryIndex: number) => (
          <div
            key={category.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={category.name || ""}
                onChange={(e) =>
                  updateCategory(categoryIndex, "name", e.target.value)
                }
                placeholder="Category name (e.g., Programming Languages)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mr-3"
              />
              <button
                onClick={() => removeCategory(categoryIndex)}
                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {category.skills.map((skill: string, skillIndex: number) => (
                <div key={skillIndex} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) =>
                      updateSkill(categoryIndex, skillIndex, e.target.value)
                    }
                    placeholder="Skill name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button
                    onClick={() => removeSkill(categoryIndex, skillIndex)}
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addSkill(categoryIndex)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-black hover:text-black transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>
        )
      )}

      <button
        onClick={addCategory}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-black hover:text-black transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        <span>Add Category</span>
      </button>
    </div>
  );
};

const ProjectsSection: React.FC<{
  content: any;
  onUpdate: (content: any) => void;
}> = ({ content, onUpdate }) => {
  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: "",
      description: "",
      technologies: "",
      url: "",
      startDate: "",
      endDate: "",
    };
    onUpdate({ ...content, items: [...(content.items || []), newProject] });
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updatedItems = [...(content.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onUpdate({ ...content, items: updatedItems });
  };

  const removeProject = (index: number) => {
    const updatedItems = (content.items || []).filter(
      (_: any, i: number) => i !== index
    );
    onUpdate({ ...content, items: updatedItems });
  };

  return (
    <div className="space-y-4">
      {(content.items || []).map((project: any, index: number) => (
        <div key={project.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
            <button
              onClick={() => removeProject(index)}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={project.name || ""}
                onChange={(e) => updateProject(index, "name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={project.description || ""}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                rows={3}
                placeholder="Describe the project, your role, and key achievements..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies
                </label>
                <input
                  type="text"
                  value={project.technologies || ""}
                  onChange={(e) =>
                    updateProject(index, "technologies", e.target.value)
                  }
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project URL
                </label>
                <input
                  type="url"
                  value={project.url || ""}
                  onChange={(e) => updateProject(index, "url", e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-black hover:text-black transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        <span>Add Project</span>
      </button>
    </div>
  );
};

const CertificationsSection: React.FC<{
  content: any;
  onUpdate: (content: any) => void;
}> = ({ content, onUpdate }) => {
  const addCertification = () => {
    const newCertification = {
      id: Date.now(),
      name: "",
      issuer: "",
      date: "",
      url: "",
    };
    onUpdate({
      ...content,
      items: [...(content.items || []), newCertification],
    });
  };

  const updateCertification = (index: number, field: string, value: any) => {
    const updatedItems = [...(content.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onUpdate({ ...content, items: updatedItems });
  };

  const removeCertification = (index: number) => {
    const updatedItems = (content.items || []).filter(
      (_: any, i: number) => i !== index
    );
    onUpdate({ ...content, items: updatedItems });
  };

  return (
    <div className="space-y-4">
      {(content.items || []).map((cert: any, index: number) => (
        <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">
              Certification {index + 1}
            </h4>
            <button
              onClick={() => removeCertification(index)}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certification Name
              </label>
              <input
                type="text"
                value={cert.name || ""}
                onChange={(e) =>
                  updateCertification(index, "name", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  value={cert.issuer || ""}
                  onChange={(e) =>
                    updateCertification(index, "issuer", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Obtained
                </label>
                <input
                  type="month"
                  value={cert.date || ""}
                  onChange={(e) =>
                    updateCertification(index, "date", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate URL
              </label>
              <input
                type="url"
                value={cert.url || ""}
                onChange={(e) =>
                  updateCertification(index, "url", e.target.value)
                }
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addCertification}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-black hover:text-black transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        <span>Add Certification</span>
      </button>
    </div>
  );
};

const LanguagesSection: React.FC<{
  content: any;
  onUpdate: (content: any) => void;
}> = ({ content, onUpdate }) => {
  const addLanguage = () => {
    const newLanguage = {
      id: Date.now(),
      language: "",
      proficiency: "Intermediate",
    };
    onUpdate({ ...content, items: [...(content.items || []), newLanguage] });
  };

  const updateLanguage = (index: number, field: string, value: any) => {
    const updatedItems = [...(content.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onUpdate({ ...content, items: updatedItems });
  };

  const removeLanguage = (index: number) => {
    const updatedItems = (content.items || []).filter(
      (_: any, i: number) => i !== index
    );
    onUpdate({ ...content, items: updatedItems });
  };

  return (
    <div className="space-y-4">
      {(content.items || []).map((lang: any, index: number) => (
        <div key={lang.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Language {index + 1}</h4>
            <button
              onClick={() => removeLanguage(index)}
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <input
                type="text"
                value={lang.language || ""}
                onChange={(e) =>
                  updateLanguage(index, "language", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proficiency
              </label>
              <select
                value={lang.proficiency || "Intermediate"}
                onChange={(e) =>
                  updateLanguage(index, "proficiency", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Native">Native</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addLanguage}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-black hover:text-black transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        <span>Add Language</span>
      </button>
    </div>
  );
};

export default ResumeSection;
