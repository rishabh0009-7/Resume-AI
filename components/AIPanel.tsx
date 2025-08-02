"use client";
import React, { useState } from "react";
import { Wand2, Sparkles, Lightbulb, Target, Zap } from "lucide-react";

interface AIPanelProps {
  resumeData: any;
  jobDescription: string;
  onUpdate: (updatedData: any) => void;
}

const AIPanel: React.FC<AIPanelProps> = ({
  resumeData,
  jobDescription,
  onUpdate,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("suggestions");
  const [generatedContent, setGeneratedContent] = useState("");

  const generateSummary = async () => {
    if (!jobDescription) {
      alert("Please add a job description first");
      return;
    }

    setIsGenerating(true);
    try {
      const experience =
        resumeData.sections.find((s: any) => s.type === "EXPERIENCE")?.content
          ?.items || [];
      const skills =
        resumeData.sections.find((s: any) => s.type === "SKILLS")?.content
          ?.categories || [];

      const experienceText = experience.map((exp: any) => exp.title).join(", ");
      const skillsText = skills.flatMap((cat: any) => cat.skills).join(", ");

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "generate_summary",
          experience: [experienceText],
          skills: [skillsText],
          jobDescription,
        }),
      });

      if (response.ok) {
        const { content } = await response.json();
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestSkills = async () => {
    if (!jobDescription) {
      alert("Please add a job description first");
      return;
    }

    setIsGenerating(true);
    try {
      const currentSkills =
        resumeData.sections.find((s: any) => s.type === "SKILLS")?.content
          ?.categories || [];
      const skillsText = currentSkills
        .flatMap((cat: any) => cat.skills)
        .join(", ");

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "suggest_skills",
          content: skillsText,
          jobDescription,
        }),
      });

      if (response.ok) {
        const { content } = await response.json();
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error("Error suggesting skills:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeForATS = async () => {
    if (!jobDescription) {
      alert("Please add a job description first");
      return;
    }

    setIsGenerating(true);
    try {
      const resumeText = JSON.stringify(resumeData);

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "optimize_ats",
          content: resumeText,
          jobDescription,
        }),
      });

      if (response.ok) {
        const { content } = await response.json();
        setGeneratedContent(content);
      }
    } catch (error) {
      console.error("Error optimizing for ATS:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGeneratedContent = () => {
    if (activeTab === "summary" && generatedContent) {
      const summarySection = resumeData.sections.find(
        (s: any) => s.type === "SUMMARY"
      );
      if (summarySection) {
        const updatedSections = resumeData.sections.map((s: any) =>
          s.type === "SUMMARY"
            ? { ...s, content: { text: generatedContent } }
            : s
        );
        onUpdate({ ...resumeData, sections: updatedSections });
      }
    }
    setGeneratedContent("");
  };

  const tabs = [
    { id: "suggestions", label: "Suggestions", icon: Lightbulb },
    { id: "summary", label: "Summary", icon: Sparkles },
    { id: "skills", label: "Skills", icon: Target },
    { id: "ats", label: "ATS Optimize", icon: Zap },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Wand2 className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === "suggestions" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                💡 AI Suggestions
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Add a job description to get personalized suggestions</li>
                <li>• Use AI to enhance your professional summary</li>
                <li>• Get skill recommendations based on job requirements</li>
                <li>• Optimize your resume for ATS systems</li>
              </ul>
            </div>

            {jobDescription && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">
                  ✅ Job Description Added
                </h4>
                <p className="text-sm text-green-800">
                  AI can now provide personalized suggestions based on your
                  target role.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "summary" && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">
                ✨ Generate Professional Summary
              </h4>
              <p className="text-sm text-purple-800 mb-3">
                AI will analyze your experience and skills to create a
                compelling summary.
              </p>
              <button
                onClick={generateSummary}
                disabled={isGenerating || !jobDescription}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate Summary"}
              </button>
            </div>

            {generatedContent && (
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Generated Summary
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {generatedContent}
                  </p>
                </div>
                <button
                  onClick={applyGeneratedContent}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Apply to Resume
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                🎯 Skill Recommendations
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                Get AI-powered skill suggestions based on the job description.
              </p>
              <button
                onClick={suggestSkills}
                disabled={isGenerating || !jobDescription}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isGenerating ? "Analyzing..." : "Get Skill Suggestions"}
              </button>
            </div>

            {generatedContent && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Suggested Skills
                </h4>
                <p className="text-sm text-gray-700">{generatedContent}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "ats" && (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">
                📊 ATS Optimization
              </h4>
              <p className="text-sm text-orange-800 mb-3">
                Optimize your resume to pass Applicant Tracking Systems.
              </p>
              <button
                onClick={optimizeForATS}
                disabled={isGenerating || !jobDescription}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isGenerating ? "Optimizing..." : "Optimize for ATS"}
              </button>
            </div>

            {generatedContent && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  ATS Optimization Tips
                </h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {generatedContent}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;
