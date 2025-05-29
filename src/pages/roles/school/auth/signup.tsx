"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Inputbox } from "@/components/ui/inputbox";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import {
  ArrowRight,
  ArrowLeft,
  School,
} from "lucide-react";
import { authAPI } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface SchoolLoginData {
  schoolId: string;
  password: string;
}

export default function SchoolSignupPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [loginData, setLoginData] = useState<SchoolLoginData>({
    schoolId: "",
    password: "",
  });

  // Password validation states
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate inputs
      if (!loginData.schoolId.trim()) {
        setError("Please enter your School ID");
        setIsSubmitting(false);
        return;
      }
      if (!loginData.password) {
        setError("Please enter your password");
        setIsSubmitting(false);
        return;
      }

      setShowSuccess(true);
      
      // Use the backend API to login
      const response = await authAPI.schoolLogin({
        schoolId: loginData.schoolId,
        password: loginData.password,
      });

      if (response.success) {
        // Show success animation
        setTimeout(() => {
          navigate('/school/dashboard');
        }, 1500);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      setIsSubmitting(false);
      setShowSuccess(false);
      setError(err instanceof Error ? err.message : "Invalid School ID or password. Please check your credentials.");
    }
  };

  // Use the keyboard navigation hook
  useKeyboardNavigation(
    handleLogin,
    [loginData, isSubmitting],
    true
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {showSuccess && (
        <LoadingAnimation
          title="Logging into your school"
          description="Accessing school dashboard..."
          variant="blue"
        />
      )}

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#4BA3C7] to-[#A484F3] rounded-full flex items-center justify-center mr-3">
            <School className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#2D2D2D]">
            School Login
          </h1>
        </div>
        <p className="text-sm text-[#6B7280]">
          Access your school dashboard with provided credentials
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 mb-6">
          <p className="text-sm text-gray-700 font-medium">
            🔐 Use the School ID and password provided by the platform administrator
          </p>
          <div className="mt-2 text-xs text-gray-600">
            <p>Default credentials for testing:</p>
            <p><strong>School ID:</strong> PRAYATNA2024</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Inputbox
            id="schoolId"
            type="text"
            label="School ID"
            value={loginData.schoolId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLoginData({ ...loginData, schoolId: e.target.value })
            }
            className="w-full"
            autoFocus
            placeholder="Enter your School ID"
          />
          <p className="text-sm text-[#6B7280]">
            Enter the unique School ID provided by administration
          </p>
        </div>

        <div className="space-y-2">
          <Inputbox
            id="password"
            type="password"
            label="Password"
            value={loginData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            className="w-full"
            placeholder="Enter your password"
          />
          <p className="text-sm text-[#6B7280]">
            Password provided by platform administration
          </p>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-[#F76E6E] bg-red-50 border border-red-200 rounded-lg p-3"
        >
          {error}
        </motion.div>
      )}

      <div className="mt-8 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/school/auth')}
          className="flex items-center gap-1 text-[#6B7280] hover:text-[#4BA3C7] hover:bg-[#4BA3C7]/5"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <Button
          onClick={handleLogin}
          className="flex items-center gap-1 bg-gradient-to-r from-[#4BA3C7] to-[#A484F3] hover:from-[#4BA3C7]/90 hover:to-[#A484F3]/90 text-white border-0"
          disabled={isSubmitting || !loginData.schoolId.trim() || !loginData.password}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              />
              Logging in...
            </span>
          ) : (
            <>
              Login to Dashboard
              <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-[#6B7280]">
          Need help accessing your account?{" "}
          <span className="text-[#4BA3C7] cursor-pointer hover:underline">
            Contact Administration
          </span>
        </p>
      </div>
    </motion.div>
  );
}