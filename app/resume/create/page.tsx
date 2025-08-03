"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Sparkles, FileText } from "lucide-react";
import Link from "next/link";

export default function CreateResume() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Please enter a resume title");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/resume/${data.resume.id}`);
      } else {
        throw new Error("Failed to create resume");
      }
    } catch (error) {
      console.error("Error creating resume:", error);
      alert("Failed to create resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  AI Resume Builder
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Resume
          </h1>
          <p className="text-gray-600">
            Start building your professional resume with AI assistance
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Resume Details</span>
              </CardTitle>
              <CardDescription>
                Enter the basic information for your new resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Resume Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Software Engineer Resume"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description (Optional)
                </label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this resume..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleCreate}
                disabled={loading || !title.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? "Creating..." : "Create Resume"}
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Features</CardTitle>
                <CardDescription>
                  Your resume will include these AI capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Smart Content Generation
                    </h4>
                    <p className="text-sm text-gray-600">
                      AI helps you write compelling descriptions and
                      achievements
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      ATS Optimization
                    </h4>
                    <p className="text-sm text-gray-600">
                      Automatically optimized for Applicant Tracking Systems
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Job-Specific Tailoring
                    </h4>
                    <p className="text-sm text-gray-600">
                      Customize content based on target job descriptions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <span className="text-sm text-gray-700">
                    Add your personal information
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span className="text-sm text-gray-700">
                    Fill in your experience and education
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <span className="text-sm text-gray-700">
                    Use AI to enhance your content
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <span className="text-sm text-gray-700">
                    Export and apply to jobs
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
