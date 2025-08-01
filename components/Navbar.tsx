"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, Sparkles, FileText, User, LogOut } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="relative">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-black rounded-lg opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-200"></div>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              ResumeAI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-black font-medium transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#templates"
              className="text-gray-700 hover:text-black font-medium transition-colors duration-200"
            >
              Templates
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-black font-medium transition-colors duration-200"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-black font-medium transition-colors duration-200"
            >
              About
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="relative px-6 py-2 bg-black text-white rounded-lg font-medium overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700"></div>
                    <span className="relative z-10">Get Started</span>
                  </button>
                </SignUpButton>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName ||
                      user?.emailAddresses[0]?.emailAddress ||
                      "User"}
                  </span>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 space-y-4">
            <a
              href="#features"
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              Features
            </a>
            <a
              href="#templates"
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              Templates
            </a>
            <a
              href="#pricing"
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              About
            </a>
            <div className="px-4 pt-4 border-t border-gray-100 space-y-2">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full px-4 py-2 bg-black text-white rounded-lg font-medium hover:shadow-xl transition-all duration-300">
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName ||
                        user?.emailAddresses[0]?.emailAddress ||
                        "User"}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
