"use client";
import React, { useState, useEffect } from "react";
import { Check, Star, Eye } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  isPremium: boolean;
  structure: any;
  styling: any;
}

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  selectedTemplate?: Template;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelect,
  selectedTemplate,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
          >
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Template
        </h2>
        <p className="text-gray-600">
          Select a professional template that matches your industry and
          experience level
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedTemplate?.id === template.id
                ? "border-black shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelect(template)}
          >
            {/* Premium Badge */}
            {template.isPremium && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Premium</span>
                </div>
              </div>
            )}

            {/* Template Preview */}
            <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              {template.thumbnail ? (
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-sm">Preview</span>
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>

            {/* Selection Indicator */}
            {selectedTemplate?.id === template.id && (
              <div className="absolute top-4 left-4">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Template Features */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Template Features
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">
                ATS-optimized formatting
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">
                Professional typography
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">
                Mobile-responsive design
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">
                Multiple export formats
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">
                Customizable sections
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">
                AI-powered suggestions
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
