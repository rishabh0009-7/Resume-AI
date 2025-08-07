
// app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Clock,
  Users,
  FileText,
  Bot,
  Target,
} from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      rating: 5,
      text: "ResumeAI helped me land my dream job in just 2 weeks! The AI suggestions were incredibly accurate and made my resume stand out.",
      avatar: "SC",
    },
    {
      name: "Mike Johnson",
      role: "Product Manager at Microsoft",
      rating: 5,
      text: "The AI-powered optimization gave me a 300% increase in interview callbacks. Absolutely worth it!",
      avatar: "MJ",
    },
    {
      name: "Emily Davis",
      role: "Designer at Apple",
      rating: 5,
      text: "Beautiful templates combined with smart AI suggestions. My resume has never looked more professional.",
      avatar: "ED",
    },
  ];

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Enhancement",
      description: "Advanced AI analyzes your content and suggests improvements to maximize impact and ATS compatibility.",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Target,
      title: "ATS Optimization",
      description: "Automatically optimized for Applicant Tracking Systems to ensure your resume gets noticed by recruiters.",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Create professional resumes in minutes, not hours. Our streamlined process gets you job-ready quickly.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Industry Expertise",
      description: "Templates and suggestions based on industry best practices and hiring manager preferences.",
      color: "from-purple-500 to-pink-600"
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Redirect authenticated users
  useEffect(() => {
    if (isLoaded && user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/sign-up");
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-7 h-7 text-blue-600" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                ResumeAI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Reviews
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Pricing
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Link href="/sign-in">
                    <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/sign-up">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Get Started
                    </button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Dashboard
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm font-medium">Powered by Advanced AI</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Land Your
                  <span className="relative inline-block ml-3">
                    <span className="relative z-10 text-blue-600">Dream Job</span>
                    <div className="absolute inset-0 bg-yellow-200 transform -rotate-2 rounded-lg -z-10"></div>
                  </span>
                  <br />
                  with AI Magic
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Create stunning, ATS-optimized resumes in minutes using advanced AI technology. 
                  Join thousands of professionals who've transformed their careers with intelligent resume building.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="group relative px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg overflow-hidden hover:bg-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Create My Resume</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </button>

                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 hover:shadow-lg">
                  View Examples
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600 font-medium">Resumes Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600 font-medium">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600 font-medium">User Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Resume Preview */}
            <div className="relative">
              <div className="relative mx-auto w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform hover:scale-105 transition-all duration-500">
                {/* Resume Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="space-y-1">
                    <div className="h-4 bg-white/90 rounded animate-pulse"></div>
                    <div className="h-2 bg-white/70 rounded w-3/4 animate-pulse"></div>
                    <div className="h-2 bg-white/70 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>

                {/* Resume Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded w-1/3 animate-pulse"></div>
                    <div className="h-2 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-2 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    <div className="h-2 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-2 bg-gray-300 rounded w-3/5 animate-pulse"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded w-2/5 animate-pulse"></div>
                    <div className="flex space-x-2">
                      <div className="h-2 bg-blue-200 rounded w-16 animate-pulse"></div>
                      <div className="h-2 bg-green-200 rounded w-12 animate-pulse"></div>
                      <div className="h-2 bg-purple-200 rounded w-14 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* AI Badge */}
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-10 -left-10 w-20 h-20 bg-purple-100 rounded-full opacity-60 animate-float"></div>
              <div className="absolute bottom-10 -right-10 w-16 h-16 bg-green-100 rounded-full opacity-60 animate-float delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose ResumeAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by cutting-edge AI technology to give you the competitive edge in today's job market
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your professional resume ready in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Enter Your Information",
                desc: "Input your work experience, education, and skills using our intuitive form",
                icon: FileText,
                color: "from-blue-500 to-purple-600"
              },
              {
                step: "02",
                title: "AI Enhancement",
                desc: "Our advanced AI analyzes and optimizes your content for maximum impact",
                icon: Bot,
                color: "from-purple-500 to-pink-600"
              },
              {
                step: "03",
                title: "Download & Apply",
                desc: "Get your ATS-optimized resume and start applying to your dream jobs",
                icon: ArrowRight,
                color: "from-green-500 to-teal-600"
              },
            ].map((process, index) => (
              <div key={index} className="relative text-center group">
                <div className="relative mb-8">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${process.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <process.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 shadow-lg">
                    {process.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {process.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {process.desc}
                </p>

                {index < 2 && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gray-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how ResumeAI helped professionals land their dream jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                  
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed font-medium">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center text-white">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-semibold">Ready to Transform Your Career?</span>
            </div>

            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Join 50,000+ Professionals
              <br />
              Who Found Success
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed opacity-90">
              Don't let a poor resume hold you back. Create your AI-powered resume today and start landing interviews tomorrow.
            </p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleGetStarted}
              className="group relative px-16 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl overflow-hidden hover:bg-gray-100 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 shadow-2xl"
            >
              <span className="relative z-10 flex items-center justify-center space-x-3">
                <span>Start Building Now</span>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </span>
            </button>

            <div className="flex items-center justify-center space-x-8 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-xl">ResumeAI</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Empowering professionals worldwide with AI-powered resume building tools 
                that help land dream jobs faster.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ResumeAI. All rights reserved. Built with ❤️ for job seekers worldwide.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;