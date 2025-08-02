"use client";
import React from "react";

interface ResumePreviewProps {
  resumeData: {
    title: string;
    description?: string;
    sections: {
      type: string;
      title: string;
      content: any;
      order: number;
    }[];
  };
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const renderSection = (section: any) => {
    switch (section.type) {
      case "PERSONAL_INFO":
        return (
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {section.content.firstName} {section.content.lastName}
            </h1>
            <div className="text-sm text-gray-600 space-y-1">
              {section.content.email && <div>{section.content.email}</div>}
              {section.content.phone && <div>{section.content.phone}</div>}
              {section.content.location && (
                <div>{section.content.location}</div>
              )}
              {section.content.linkedin && (
                <div>LinkedIn: {section.content.linkedin}</div>
              )}
              {section.content.website && (
                <div>Website: {section.content.website}</div>
              )}
            </div>
          </div>
        );

      case "SUMMARY":
        return (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-300 pb-1">
              Professional Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {section.content.text || "Add your professional summary here..."}
            </p>
          </div>
        );

      case "EXPERIENCE":
        return (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Work Experience
            </h2>
            <div className="space-y-4">
              {(section.content.items || []).map((exp: any, index: number) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {exp.title || "Job Title"}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate && formatDate(exp.startDate)}
                      {exp.startDate && exp.endDate && " - "}
                      {exp.current
                        ? "Present"
                        : exp.endDate && formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    {exp.company && (
                      <span className="font-medium">{exp.company}</span>
                    )}
                    {exp.company && exp.location && " • "}
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {exp.description || "Add job description..."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "EDUCATION":
        return (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {(section.content.items || []).map((edu: any, index: number) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree || "Degree"}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {edu.startDate && formatDate(edu.startDate)}
                      {edu.startDate && edu.endDate && " - "}
                      {edu.current
                        ? "Present"
                        : edu.endDate && formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    {edu.institution && (
                      <span className="font-medium">{edu.institution}</span>
                    )}
                    {edu.institution && edu.location && " • "}
                    {edu.location && <span>{edu.location}</span>}
                  </div>
                  {edu.gpa && (
                    <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "SKILLS":
        return (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Skills
            </h2>
            <div className="space-y-3">
              {(section.content.categories || []).map(
                (category: any, index: number) => (
                  <div key={index}>
                    {category.name && (
                      <h3 className="font-medium text-gray-900 mb-1">
                        {category.name}
                      </h3>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(category.skills || []).map(
                        (skill: string, skillIndex: number) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        );

      case "PROJECTS":
        return (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Projects
            </h2>
            <div className="space-y-4">
              {(section.content.items || []).map(
                (project: any, index: number) => (
                  <div key={index} className="border-l-2 border-gray-300 pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {project.name || "Project Name"}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {project.startDate && formatDate(project.startDate)}
                        {project.startDate && project.endDate && " - "}
                        {project.endDate && formatDate(project.endDate)}
                      </span>
                    </div>
                    {project.technologies && (
                      <div className="text-sm text-gray-600 mb-2">
                        Technologies: {project.technologies}
                      </div>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {project.description || "Add project description..."}
                    </p>
                    {project.url && (
                      <div className="text-sm text-blue-600 mt-1">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Project →
                        </a>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        );

      case "CERTIFICATIONS":
        return (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Certifications
            </h2>
            <div className="space-y-3">
              {(section.content.items || []).map((cert: any, index: number) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {cert.name || "Certification Name"}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {cert.date && formatDate(cert.date)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    {cert.issuer && <span>Issued by: {cert.issuer}</span>}
                  </div>
                  {cert.url && (
                    <div className="text-sm text-blue-600">
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Certificate →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "LANGUAGES":
        return (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
              Languages
            </h2>
            <div className="flex flex-wrap gap-3">
              {(section.content.items || []).map((lang: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {lang.language}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({lang.proficiency})
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Resume Preview</h2>
        {resumeData.title && (
          <p className="text-sm text-gray-600">{resumeData.title}</p>
        )}
      </div>

      <div className="space-y-4">
        {resumeData.sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <div key={index}>{renderSection(section)}</div>
          ))}
      </div>

      {resumeData.sections.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>Add sections to see your resume preview</p>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
