// components/ResumeTemplate.tsx
"use client";
import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface ResumeData {
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

interface ResumeTemplateProps {
  data: ResumeData;
  className?: string;
}

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ data, className = "" }) => {
  return (
    <div className={`bg-white shadow-2xl rounded-lg overflow-hidden max-w-4xl mx-auto ${className}`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold mb-2">
              {data.personal.firstName || "John"} {data.personal.lastName || "Doe"}
            </h1>
            <p className="text-xl text-slate-300 mb-4 font-medium">
              {data.personal.title || "Professional Title"}
            </p>
          </div>
          <div className="text-right space-y-2">
            {data.personal.email && (
              <div className="flex items-center justify-end space-x-2 text-slate-300">
                <Mail size={16} />
                <span className="text-sm">{data.personal.email}</span>
              </div>
            )}
            {data.personal.phone && (
              <div className="flex items-center justify-end space-x-2 text-slate-300">
                <Phone size={16} />
                <span className="text-sm">{data.personal.phone}</span>
              </div>
            )}
            {data.personal.location && (
              <div className="flex items-center justify-end space-x-2 text-slate-300">
                <MapPin size={16} />
                <span className="text-sm">{data.personal.location}</span>
              </div>
            )}
            {data.personal.linkedin && (
              <div className="flex items-center justify-end space-x-2 text-slate-300">
                <Linkedin size={16} />
                <span className="text-sm">{data.personal.linkedin}</span>
              </div>
            )}
            {data.personal.website && (
              <div className="flex items-center justify-end space-x-2 text-slate-300">
                <Globe size={16} />
                <span className="text-sm">{data.personal.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Professional Summary */}
        {data.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200">
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-base">
              {data.summary}
            </p>
          </section>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Experience */}
            {data.experience.length > 0 && data.experience[0].company && (
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-slate-200">
                  Professional Experience
                </h2>
                <div className="space-y-6">
                  {data.experience.map((exp, index) => (
                    <div key={index} className="relative pl-4 border-l-2 border-slate-200">
                      <div className="absolute w-3 h-3 bg-slate-800 rounded-full -left-2 top-1"></div>
                      <div className="mb-2">
                        <h3 className="text-xl font-bold text-slate-800">{exp.title}</h3>
                        <p className="text-lg font-semibold text-slate-600">{exp.company}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                      </div>
                      {exp.description && (
                        <div className="text-slate-700 leading-relaxed text-sm">
                          {exp.description.split('\n').map((line, i) => (
                            <p key={i} className="mb-2">{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {data.education.length > 0 && data.education[0].institution && (
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-slate-200">
                  Education
                </h2>
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div key={index} className="relative pl-4 border-l-2 border-slate-200">
                      <div className="absolute w-3 h-3 bg-slate-600 rounded-full -left-2 top-1"></div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </h3>
                        <p className="text-base font-semibold text-slate-600">{edu.institution}</p>
                        <p className="text-sm text-slate-500">
                          {edu.graduationYear} {edu.gpa && `• GPA: ${edu.gpa}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Skills */}
            {data.skills.length > 0 && data.skills[0] && (
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-200">
                  Core Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    skill && (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium border border-slate-200 hover:bg-slate-200 transition-colors"
                      >
                        {skill}
                      </span>
                    )
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate;