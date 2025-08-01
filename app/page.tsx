'use client'
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Star, Zap, Shield, Clock, Users } from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    { name: 'Sarah Chen', role: 'Software Engineer at Google', rating: 5, text: 'Landed my dream job in just 2 weeks!' },
    { name: 'Mike Johnson', role: 'Product Manager at Microsoft', rating: 5, text: 'The AI suggestions were incredibly accurate.' },
    { name: 'Emily Davis', role: 'Designer at Apple', rating: 5, text: 'Beautiful templates that stand out.' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black/5 rounded-full">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">AI-Powered Resume Builder</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Land Your
                  <span className="relative inline-block ml-3">
                    <span className="relative z-10">Dream Job</span>
                    <div className="absolute inset-0 bg-yellow-200 transform -rotate-2 rounded-lg -z-10"></div>
                  </span>
                  <br />
                  with AI Magic
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Create stunning, ATS-optimized resumes in minutes using advanced AI technology. 
                  Join thousands who've landed their dream jobs.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative px-8 py-4 bg-black text-white rounded-xl font-semibold text-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Create My Resume</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </button>
                
                <button className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-black hover:text-black transition-all duration-300 hover:shadow-lg">
                  View Templates
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Resumes Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">User Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Animated Resume */}
            <div className="relative">
              <div className="relative mx-auto w-80 h-96 bg-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden">
                {/* Resume Animation */}
                <div className="absolute inset-4 space-y-3">
                  <div className="h-4 bg-gray-900 rounded animate-pulse"></div>
                  <div className="h-2 bg-gray-300 rounded w-3/4 animate-pulse delay-100"></div>
                  <div className="h-2 bg-gray-300 rounded w-1/2 animate-pulse delay-200"></div>
                  
                  <div className="pt-4 space-y-2">
                    <div className="h-3 bg-gray-700 rounded w-1/3 animate-pulse delay-300"></div>
                    <div className="h-2 bg-gray-300 rounded animate-pulse delay-400"></div>
                    <div className="h-2 bg-gray-300 rounded w-4/5 animate-pulse delay-500"></div>
                    <div className="h-2 bg-gray-300 rounded w-3/5 animate-pulse delay-600"></div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse delay-700"></div>
                    <div className="h-2 bg-gray-300 rounded animate-pulse delay-800"></div>
                    <div className="h-2 bg-gray-300 rounded w-2/3 animate-pulse delay-900"></div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-bounce delay-1500"></div>
              </div>
              
              {/* Background Decorations */}
              <div className="absolute top-10 -left-10 w-20 h-20 bg-purple-100 rounded-full opacity-60 animate-float"></div>
              <div className="absolute bottom-10 -right-10 w-16 h-16 bg-green-100 rounded-full opacity-60 animate-float delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Professionals Choose ResumeAI
            </h2>
            <p className="text-xl text-gray-700">
              The numbers speak for themselves
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { number: '50,000+', label: 'Resumes Created', icon: '📄' },
              { number: '95%', label: 'Interview Success Rate', icon: '🎯' },
              { number: '2 mins', label: 'Average Creation Time', icon: '⚡' },
              { number: '500+', label: 'Template Variations', icon: '✨' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl">
                    <span className="text-3xl">{stat.icon}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Process Steps */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h3>
              <p className="text-gray-600 text-lg">
                Get your professional resume ready in 3 simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  step: '01', 
                  title: 'Choose Template', 
                  desc: 'Select from our AI-optimized professional templates',
                  icon: '🎨'
                },
                { 
                  step: '02', 
                  title: 'AI Enhancement', 
                  desc: 'Our AI analyzes and enhances your content for maximum impact',
                  icon: '🤖'
                },
                { 
                  step: '03', 
                  title: 'Download & Apply', 
                  desc: 'Get your ATS-friendly resume and start applying immediately',
                  icon: '🚀'
                }
              ].map((process, index) => (
                <div key={index} className="relative text-center group">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300">
                      <span className="text-2xl">{process.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                      {process.step}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{process.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{process.desc}</p>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gray-200">
                      <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose ResumeAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by advanced AI technology to give you the competitive edge
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'AI-Powered', desc: 'Smart suggestions based on job descriptions' },
              { icon: Shield, title: 'ATS Optimized', desc: 'Pass applicant tracking systems easily' },
              { icon: Clock, title: 'Quick Creation', desc: 'Build professional resumes in minutes' },
              { icon: Users, title: 'Expert Approved', desc: 'Templates designed by hiring experts' }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-700">
              See how ResumeAI helped others land their dream jobs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-black rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-gray-600 to-black transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-900 mb-8 text-lg leading-relaxed font-medium">"{testimonial.text}"</p>
                    <div className="border-t border-gray-100 pt-6">
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-gray-700 text-sm font-medium mt-1">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-black/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-black/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-black/10 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-semibold text-gray-800">Ready to Get Started?</span>
            </div>
            
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Land Your Dream Job
              <br />
              <span className="relative">
                Starting Today
                <div className="absolute bottom-2 left-0 right-0 h-3 bg-yellow-200 -rotate-1 -z-10"></div>
              </span>
            </h2>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of successful job seekers who've transformed their careers with ResumeAI's 
              intelligent resume builder
            </p>
          </div>
          
          <div className="space-y-6">
            <button className="group relative px-16 py-5 bg-black text-white rounded-2xl font-bold text-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-black via-gray-800 to-black transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center space-x-3">
                <span>Start Building Now</span>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                  <Sparkles className="w-4 h-4 group-hover:animate-spin" />
                </div>
              </span>
            </button>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;