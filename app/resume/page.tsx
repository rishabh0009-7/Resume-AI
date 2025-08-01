'use client'
import React, { useState } from 'react';
import { Plus, FileText, Calendar, Download, Edit3, Trash2, Eye } from 'lucide-react';
import { redirect } from 'next/navigation';

const ResumePage = () => {
  // Sample resume data - you can replace this with actual data
  const [resumes, setResumes] = useState([
    {
      id: 1,
      title: 'Software Engineer Resume',
      lastModified: '2025-01-25',
      template: 'Modern',
      status: 'Complete'
    },
    {
      id: 2,
      title: 'Product Manager Resume',
      lastModified: '2025-01-20',
      template: 'Professional',
      status: 'Draft'
    },
    {
      id: 3,
      title: 'Frontend Developer Resume',
      lastModified: '2025-01-15',
      template: 'Creative',
      status: 'Complete'
    }
  ]);

  const handleCreateResume = () => {
    // Navigate to create resume page
    redirect('/resume/create-resume')
  };

  const handleEditResume = (id) => {
    console.log('Edit resume:', id);
  };

  const handleDownloadResume = (id) => {
    console.log('Download resume:', id);
  };

  const handleDeleteResume = (id) => {
    setResumes(resumes.filter(resume => resume.id !== id));
  };

  const handleViewResume = (id) => {
    console.log('View resume:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">My Resumes</h1>
              <p className="text-xl text-gray-600">Create and manage your professional resumes</p>
            </div>
            <button
              onClick={handleCreateResume}
              className="group relative px-8 py-4 bg-black text-white rounded-xl font-semibold text-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 self-start"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create New Resume</span>
              </span>
            </button>
          </div>
        </div>

        {/* Resumes Grid */}
        {resumes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((resume) => (
              <div key={resume.id} className="group relative">
                <div className="absolute inset-0 bg-black rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-gray-600 to-black transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative z-10">
                    {/* Resume Preview */}
                    <div className="w-full h-48 bg-gray-100 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-gray-50 transition-colors duration-300">
                      <FileText className="w-16 h-16 text-gray-400 group-hover:text-gray-500 transition-colors duration-300" />
                    </div>

                    {/* Resume Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors duration-300">
                          {resume.title}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(resume.lastModified).toLocaleDateString()}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            resume.status === 'Complete' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {resume.status}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Template: {resume.template}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditResume(resume.id)}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Edit Resume"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadResume(resume.id)}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Download Resume"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteResume(resume.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete Resume"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleViewResume(resume.id)}
                          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4 inline mr-1" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Resumes Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your professional resume with our AI-powered tools and beautiful templates.
            </p>
            <button
              onClick={handleCreateResume}
              className="group relative px-8 py-4 bg-black text-white rounded-xl font-semibold text-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create Your First Resume</span>
              </span>
            </button>
          </div>
        )}

         
      </div>
    </div>
  );
};

export default ResumePage;