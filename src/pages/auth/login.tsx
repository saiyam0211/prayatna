"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Inputbox } from "@/components/ui/inputbox";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { ArrowRight, ArrowLeft, User } from "lucide-react";
import { loginApi } from "@/api/useLogin";

type Step = "email" | "password";

export default function LoginPage() {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const handleNext = async () => {
    // Don't proceed if currently submitting
    if (isSubmitting) return;
    
    // Validate current step
    if (currentStep === "email") {
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid admission number or email address");
        return;
      }
      setCurrentStep("password");
    } 
    else if (currentStep === "password") {
      if (!formData.password) {
        setError("Please enter your password");
        return;
      }
      
      // Attempt login
      setIsSubmitting(true);
      
      try {
        setShowSuccess(true);
        
        // Prepare payload for loginApi
        const isEmail = formData.email.includes("@");
        const payload = {
          admissionNumber: isEmail ? "" : formData.email,
          email: isEmail ? formData.email : "",
          password: formData.password,
        };
        console.log("Submitting login data:", payload);
        const response = await loginApi(payload);
        if (response.message === "login success") {
          const userData = response.user || response.data?.user || response.data || {};
          localStorage.setItem("prayatna_currentUser", JSON.stringify(userData));
          setTimeout(() => {
            window.location.href = "/explore";
          }, 1500);
        } else {
          throw new Error(response.message || "Login failed");
        }
      } catch (err) {
        setIsSubmitting(false);
        setShowSuccess(false);
        setError("Invalid admission number or password. Please try again.");
      }
    }
    
    setError(null);
  };
  
  const handleBack = () => {
    if (currentStep === "password") {
      setCurrentStep("email");
    }
    setError(null);
  };


  
  const validateEmail = (email: string) => {
    // Allow admission numbers (alphanumeric) or email addresses
    return /^[a-zA-Z0-9]+$/.test(email) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  
  // Use the keyboard navigation hook
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
      {/* Success loading animation */}
      {showSuccess && (
        <LoadingAnimation
          title="Logging you in"
          description="Welcome back to PW Gurukulam..."
          variant="blue"
        />
      )}
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#4BA3C7] to-[#A484F3] rounded-full flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#2D2D2D]">
            {currentStep === "email" && "Welcome Back"}
            {currentStep === "password" && "Enter Your Password"}
          </h1>
        </div>
        <p className="text-sm text-[#6B7280]">
          {currentStep === "email" && "Sign in to your PW Gurukulam account"}
          {currentStep === "password" && "Enter your secure password"}
        </p>
      </div>
      
      <div className="relative overflow-hidden min-h-[200px]">
        <AnimatePresence initial={false} custom={1}>
          {currentStep === "email" && (
            <motion.div
              key="email"
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
                  <Inputbox
                    id="email"
                    type="text"
                    label="Admission number or email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setFormData({ ...formData, email: e.target.value })}
                    className="w-full"
                    autoFocus
                  />
                  <p className="text-sm text-[#6B7280]">
                    Enter your admission number or email address
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
                  <Inputbox
                    id="password"
                    type="password"
                    label="Password"
                    value={formData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setFormData({ ...formData, password: e.target.value })}
                    className="w-full"
                    autoFocus
                  />
                  <div className="text-right">
                    <a href="#" className="text-sm text-[#4BA3C7] hover:underline">
                      Forgot password?
                    </a>
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
          className="mt-4 text-sm text-[#F76E6E]"
        >
          {error}
        </motion.div>
      )}
      
      <div className="mt-8 flex justify-between">
        {currentStep !== "email" ? (
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
            onClick={() => window.location.href = '/auth'}
            className="flex items-center gap-1 text-[#6B7280] hover:text-[#4BA3C7] hover:bg-[#4BA3C7]/5"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" /> Home
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
              {currentStep === "password" ? "Signing in..." : "Next"}
            </span>
          ) : (
            <>
              {currentStep === "password" ? "Sign In" : "Next"} 
              <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
      
      {currentStep === "email" && (
        <>
          <div className="mt-6 text-center text-sm text-[#6B7280]">
            Don't have an account? <a href="/signup" className="text-[#4BA3C7] hover:underline">Create one</a>
          </div>
        </>
      )}
    </motion.div>
  );
}

