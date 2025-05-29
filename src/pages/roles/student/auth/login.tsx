"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Inputbox } from "@/components/ui/inputbox";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { ArrowRight, ArrowLeft, User, Phone, Lock } from "lucide-react";
import { authAPI } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

type Step = "credentials" | "password";

export default function LoginPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("credentials");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });
  
  const handleNext = async () => {
    if (isSubmitting) return;
    
    if (currentStep === "credentials") {
      if (!formData.phoneNumber.trim()) {
        setError("Please enter your phone number");
        return;
      }
      if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
        setError("Please enter a valid 10-digit phone number");
        return;
      }
      setCurrentStep("password");
    } 
    else if (currentStep === "password") {
      if (!formData.password) {
        setError("Please enter your password");
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        setShowSuccess(true);
        
        const response = await authAPI.studentLogin({
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        });

        if (response.success) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } catch (err) {
        setIsSubmitting(false);
        setShowSuccess(false);
        setError(err instanceof Error ? err.message : "Invalid phone number or password. Please try again.");
      }
    }
    
    setError(null);
  };
  
  const handleBack = () => {
    if (currentStep === "password") {
      setCurrentStep("credentials");
    }
    setError(null);
  };
  
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };
  
  useKeyboardNavigation(
    handleNext,
    [currentStep, formData, isSubmitting],
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
          title="Logging you in"
          description="Welcome back to Prayatna..."
          variant="blue"
        />
      )}
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#4BA3C7] to-[#A484F3] rounded-full flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#2D2D2D]">
            {currentStep === "credentials" && "Welcome Back"}
            {currentStep === "password" && "Enter Your Password"}
          </h1>
        </div>
        <p className="text-sm text-[#6B7280]">
          {currentStep === "credentials" && "Sign in to your Prayatna account"}
          {currentStep === "password" && "Enter your secure password"}
        </p>
      </div>
      
      <div className="relative overflow-hidden min-h-[200px]">
        <AnimatePresence initial={false} custom={1}>
          {currentStep === "credentials" && (
            <motion.div
              key="credentials"
              custom={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full"
            >
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-gray-700 font-medium">
                      Use your registered phone number
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Enter the phone number you used during registration.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-[#4BA3C7]" />
                    <label className="text-[#2D2D2D] font-medium">Phone Number</label>
                  </div>
                  <Inputbox
                    id="phoneNumber"
                    type="tel"
                    label=""
                    value={formData.phoneNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                    className="w-full"
                    autoFocus
                    placeholder="Enter your 10-digit phone number"
                    maxLength={10}
                  />
                  <p className="text-sm text-[#6B7280]">
                    Use the same phone number from your registration
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "password" && (
            <motion.div
              key="password"
              custom={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-[#4BA3C7]" />
                    <label className="text-[#2D2D2D] font-medium">Password</label>
                  </div>
                  <Inputbox
                    id="password"
                    type="password"
                    label=""
                    value={formData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setFormData({ ...formData, password: e.target.value })}
                    className="w-full"
                    autoFocus
                    placeholder="Enter your password"
                  />
                  <div className="text-right">
                    <button className="text-sm text-[#4BA3C7] hover:underline">
                      Forgot password?
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        {currentStep !== "credentials" ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center gap-1 text-[#6B7280]"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/auth')}
            className="flex items-center gap-1 text-[#6B7280] hover:text-[#4BA3C7] hover:bg-[#4BA3C7]/5"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Options
          </Button>
        )}
        
        <Button 
          onClick={handleNext}
          className="flex items-center gap-1 bg-gradient-to-r from-[#4BA3C7] to-[#A484F3] hover:from-[#4BA3C7]/90 hover:to-[#A484F3]/90 text-white border-0"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              />
              Signing in...
            </span>
          ) : (
            <>
              {currentStep === "password" ? "Sign In" : "Next"} 
              <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-[#6B7280]">
          Don't have an account?{" "}
          <button
            onClick={() => navigate('/signup')}
            className="text-[#4BA3C7] cursor-pointer hover:underline"
          >
            Create one here
          </button>
        </p>
      </div>
    </motion.div>
  );
}

