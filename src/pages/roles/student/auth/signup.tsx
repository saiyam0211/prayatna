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
  User,
  Shield,
  Phone,
  GraduationCap,
  MessageSquare,
  Clock,
} from "lucide-react";
import { authAPI } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

type Step = "credentials" | "otp" | "password" | "review";

interface StudentSignupData {
  phoneNumber: string;
  enrollmentId: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("credentials");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const [signupData, setSignupData] = useState<StudentSignupData>({
    phoneNumber: "",
    enrollmentId: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // Password validation states
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Password validation checks
  const passwordValidation = {
    minLength: signupData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(signupData.password),
    hasLowercase: /[a-z]/.test(signupData.password),
    hasNumber: /[0-9]/.test(signupData.password),
    hasSpecial: /[^A-Za-z0-9]/.test(signupData.password),
    matches: signupData.password === signupData.confirmPassword && signupData.confirmPassword.length > 0,
  };

  // Calculate overall password strength
  const passwordStrength = Object.values(passwordValidation).filter(Boolean).length;

  // Calculate progress percentage based on current step
  const steps: Step[] = ["credentials", "otp", "password", "review"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = Math.round((currentStepIndex / (steps.length - 1)) * 100);

  // OTP Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const sendOTP = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/auth/student/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: signupData.phoneNumber,
          enrollmentId: signupData.enrollmentId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setOtpTimer(60); // 60 seconds timer
        setCurrentStep("otp");
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOTP = async () => {
    if (otpTimer > 0) return;
    await sendOTP();
  };

  const handleNext = () => {
    if (isSubmitting) return;

    // Validate current step
    if (currentStep === "credentials") {
      if (!signupData.phoneNumber.trim()) {
        setError("Please enter your phone number");
        return;
      }
      if (!/^\d{10}$/.test(signupData.phoneNumber.replace(/\D/g, ""))) {
        setError("Please enter a valid 10-digit phone number");
        return;
      }
      if (!signupData.enrollmentId.trim()) {
        setError("Please enter your enrollment ID");
        return;
      }
      // Send OTP instead of moving to next step
      sendOTP();
      return;
    } else if (currentStep === "otp") {
      if (!signupData.otp.trim()) {
        setError("Please enter the OTP");
        return;
      }
      if (!/^\d{4,6}$/.test(signupData.otp)) {
        setError("Please enter a valid OTP");
        return;
      }
      setCurrentStep("password");
    } else if (currentStep === "password") {
      if (!signupData.password) {
        setError("Please enter a password");
        return;
      }
      if (passwordStrength < 4) {
        setError("Password is too weak. Please include uppercase, lowercase, number and special character");
        return;
      }
      if (!passwordValidation.matches) {
        setError("Passwords do not match");
        return;
      }
      setCurrentStep("review");
    } else if (currentStep === "review") {
      handleSignup();
      return;
    }

    setError(null);
  };

  const handleBack = () => {
    if (currentStep === "otp") {
      setCurrentStep("credentials");
      setOtpSent(false);
      setOtpTimer(0);
    } else if (currentStep === "password") {
      setCurrentStep("otp");
    } else if (currentStep === "review") {
      setCurrentStep("password");
    }
    setError(null);
  };

  const handleSignup = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      setShowSuccess(true);
      
      // Use the backend API to signup with OTP verification
      const response = await fetch('http://localhost:3001/api/auth/student/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: signupData.phoneNumber,
          enrollmentId: signupData.enrollmentId,
          otp: signupData.otp,
          password: signupData.password,
          confirmPassword: signupData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store the token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Show success animation
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (err) {
      setIsSubmitting(false);
      setShowSuccess(false);
      setError(err instanceof Error ? err.message : "An error occurred during signup. Please check your credentials and try again.");
    }
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      };
    },
  };

  // Use the keyboard navigation hook
  useKeyboardNavigation(
    handleNext,
    [currentStep, signupData, isSubmitting],
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
          title="Creating your student account"
          description="Setting up your Prayatna dashboard..."
          variant="blue"
        />
      )}

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#4BA3C7] to-[#A484F3] rounded-full flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#2D2D2D]">
            {currentStep === "credentials" && "Student Registration"}
            {currentStep === "otp" && "Verify Your Phone"}
            {currentStep === "password" && "Create Your Password"}
            {currentStep === "review" && "Review Your Information"}
          </h1>
        </div>
        <p className="text-sm text-[#6B7280]">
          Step {currentStepIndex + 1} of {steps.length}
        </p>
        <div className="h-1.5 w-full bg-[#E5E7EB] mt-4 rounded-full">
          <div
            className="h-1.5 bg-gradient-to-r from-[#4BA3C7] to-[#7DDE92] transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="relative overflow-hidden min-h-[400px]">
        <AnimatePresence initial={false} custom={1}>
          {/* Credentials Step */}
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
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-gray-700 font-medium">
                      Use the credentials provided by your school
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Your school has already created an account for you. Use your phone number and enrollment ID to access it.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-[#4BA3C7]" />
                    <Label htmlFor="phoneNumber" className="text-[#2D2D2D]">Phone Number</Label>
                  </div>
                  <Inputbox
                    id="phoneNumber"
                    type="tel"
                    label=""
                    value={signupData.phoneNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSignupData({ 
                        ...signupData, 
                        phoneNumber: e.target.value.replace(/\D/g, '') 
                      })
                    }
                    className="w-full"
                    autoFocus
                    placeholder="Enter your 10-digit phone number"
                    maxLength={10}
                  />
                  <p className="text-sm text-[#6B7280]">
                    Use the phone number provided to your school
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-[#4BA3C7]" />
                    <Label htmlFor="enrollmentId" className="text-[#2D2D2D]">Enrollment ID</Label>
                  </div>
                  <Inputbox
                    id="enrollmentId"
                    type="text"
                    label=""
                    value={signupData.enrollmentId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSignupData({ ...signupData, enrollmentId: e.target.value })
                    }
                    className="w-full"
                    placeholder="Enter your enrollment ID"
                  />
                  <p className="text-sm text-[#6B7280]">
                    Use the enrollment ID created by your school
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* OTP Verification Step */}
          {currentStep === "otp" && (
            <motion.div
              key="otp"
              custom={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full"
            >
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-gray-700 font-medium">
                      OTP sent to your phone
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    We've sent a verification code to {signupData.phoneNumber}. Enter it below to continue.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-[#4BA3C7]" />
                    <Label htmlFor="otp" className="text-[#2D2D2D]">Verification Code</Label>
                  </div>
                  <Inputbox
                    id="otp"
                    type="text"
                    label=""
                    value={signupData.otp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSignupData({ 
                        ...signupData, 
                        otp: e.target.value.replace(/\D/g, '') 
                      })
                    }
                    className="w-full text-center text-2xl tracking-widest"
                    autoFocus
                    placeholder="Enter 4-6 digit code"
                    maxLength={6}
                  />
                  
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-[#6B7280]">
                      Didn't receive the code?
                    </p>
                    {otpTimer > 0 ? (
                      <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                        <Clock className="w-4 h-4" />
                        <span>Resend in {otpTimer}s</span>
                      </div>
                    ) : (
                      <button
                        onClick={resendOTP}
                        disabled={isSubmitting}
                        className="text-sm text-[#4BA3C7] hover:text-[#3A8DB0] font-medium disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Password Step */}
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
                    <Shield className="w-4 h-4 text-[#4BA3C7]" />
                    <Label htmlFor="password" className="text-[#2D2D2D]">Create Password</Label>
                  </div>
                  <Inputbox
                    id="password"
                    type="password"
                    label=""
                    value={signupData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="w-full"
                    autoFocus
                    placeholder="Create a strong password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#2D2D2D]">Confirm Password</Label>
                  <Inputbox
                    id="confirmPassword"
                    type="password"
                    label=""
                    value={signupData.confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSignupData({ ...signupData, confirmPassword: e.target.value })
                    }
                    className="w-full"
                    placeholder="Confirm your password"
                  />
                </div>

                {/* Password Strength Indicator */}
                {(passwordFocused || signupData.password) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3 p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#2D2D2D]">Password Strength</span>
                      <span className="text-sm text-[#6B7280]">{passwordStrength}/6</span>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { check: passwordValidation.minLength, text: "At least 8 characters" },
                        { check: passwordValidation.hasUppercase, text: "One uppercase letter" },
                        { check: passwordValidation.hasLowercase, text: "One lowercase letter" },
                        { check: passwordValidation.hasNumber, text: "One number" },
                        { check: passwordValidation.hasSpecial, text: "One special character" },
                        { check: passwordValidation.matches, text: "Passwords match" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            item.check ? 'bg-[#7DDE92] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
                          }`}>
                            {item.check ? '✓' : '•'}
                          </div>
                          <span className={`text-sm ${
                            item.check ? 'text-[#7DDE92]' : 'text-[#6B7280]'
                          }`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Review Step */}
          {currentStep === "review" && (
            <motion.div
              key="review"
              custom={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full"
            >
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-[#2D2D2D] mb-4">Review Your Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Phone Number:</span>
                      <span className="font-medium text-[#2D2D2D]">{signupData.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Enrollment ID:</span>
                      <span className="font-medium text-[#2D2D2D]">{signupData.enrollmentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Phone Verified:</span>
                      <span className="font-medium text-green-600">✓ Verified</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> By creating your account, you agree to follow your school's community guidelines and maintain respectful communication with peers and teachers.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === "credentials" || isSubmitting}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-gradient-to-r from-[#4BA3C7] to-[#7DDE92] hover:from-[#3A8DB0] hover:to-[#6BC77A] text-white"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {currentStep === "credentials" ? "Sending OTP..." : 
               currentStep === "review" ? "Creating Account..." : "Processing..."}
            </>
          ) : (
            <>
              {currentStep === "credentials" ? "Send OTP" :
               currentStep === "review" ? "Create Account" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
