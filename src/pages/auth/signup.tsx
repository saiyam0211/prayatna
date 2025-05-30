"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Inputbox } from "@/components/ui/inputbox";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import {
  Calendar as CalendarIcon,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Shield,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { signupApi } from "@/api/useSignup";

type Step =
  | "name"
  | "gender"
  | "dob"
  | "phone"
  | "admission"
  | "password"
  | "otp"
  | "review";

interface StudentProfile {
  fullName: string;
  gender: "male" | "female" | "other" | "";
  dateOfBirth: Date | undefined;
  phone: string;
  alternatePhone: string;
  admissionNumber: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<Step>("name");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [profile, setProfile] = useState<StudentProfile>({
    fullName: "",
    gender: "",
    dateOfBirth: undefined,
    phone: "",
    alternatePhone: "",
    admissionNumber: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  // Password validation states
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation checks
  const passwordValidation = {
    minLength: profile.password.length >= 8,
    hasUppercase: /[A-Z]/.test(profile.password),
    hasLowercase: /[a-z]/.test(profile.password),
    hasNumber: /[0-9]/.test(profile.password),
    hasSpecial: /[^A-Za-z0-9]/.test(profile.password),
    matches: profile.password === profile.confirmPassword,
  };

  // Calculate overall password strength
  const passwordStrength =
    Object.values(passwordValidation).filter(Boolean).length;

  // Calculate progress percentage based on current step
  const steps: Step[] = [
    "name",
    "gender",
    "dob",
    "phone",
    "admission",
    "password",
    "otp",
    "review",
  ];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = Math.round((currentStepIndex / (steps.length - 1)) * 100);

  // OTP timer state
  const [otpTimer, setOtpTimer] = useState(0);

  // Start OTP timer when entering OTP step
  useEffect(() => {
    if (currentStep === "otp") {
      setOtpTimer(60); // 60 seconds for OTP resend
    }
  }, [currentStep]);

  // Countdown effect
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Function to send OTP
  const sendOtp = async () => {
    try {
      setIsSubmitting(true);
      // Simulate OTP sending API call
      // await sendOtpToPhone(profile.phone);

      setProfile({ ...profile, otp: "" }); // Clear previous OTP
      setError(null);
    } catch {
      // Handle error (already handled above)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to verify OTP
  const verifyOtp = async (otpCode: string) => {
    try {
      setIsSubmitting(true);
      // Simulate OTP verification API call
      // await verifyOtpCode(profile.phone, otpCode);

      // For demo purposes, accept any 6-digit OTP
      if (otpCode.length === 6) {
        return true;
      }
      throw new Error("Invalid OTP");
    } catch {
      // Handle error (already handled above)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    // Don't proceed if currently submitting
    if (isSubmitting) return;

    // Validate current step
    if (currentStep === "name") {
      if (!profile.fullName.trim()) {
        setError("Please enter your full name");
        return;
      }
      setCurrentStep("gender");
    } else if (currentStep === "gender") {
      if (!profile.gender) {
        setError("Please select your gender");
        return;
      }
      setCurrentStep("dob");
    } else if (currentStep === "dob") {
      if (!profile.dateOfBirth) {
        setError("Please select your date of birth");
        return;
      }
      setCurrentStep("phone");
    } else if (currentStep === "phone") {
      if (!profile.phone.trim()) {
        setError("Please enter your phone number");
        return;
      }
      // Basic phone validation
      if (!/^\d{10}$/.test(profile.phone.replace(/\D/g, ""))) {
        setError("Please enter a valid 10-digit phone number");
        return;
      }
      setCurrentStep("admission");
    } else if (currentStep === "admission") {
      if (!profile.admissionNumber.trim()) {
        setError("Please enter your admission number");
        return;
      }
      setCurrentStep("password");
    } else if (currentStep === "password") {
      // Check if we need to show confirm password screen
      if (!showConfirmPassword) {
        // Validate password requirements
        if (
          !passwordValidation.minLength ||
          !passwordValidation.hasSpecial ||
          !passwordValidation.hasUppercase ||
          !passwordValidation.hasNumber
        ) {
          setError("Please ensure your password meets all requirements");
          return;
        }

        setShowConfirmPassword(true);
        setError(null);
        return;
      } else {
        // Check if passwords match
        if (profile.password !== profile.confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        setCurrentStep("otp");
        // Send OTP when moving to OTP step
        sendOtp();
      }
    } else if (currentStep === "otp") {
      if (!profile.otp.trim()) {
        setError("Please enter the OTP");
        return;
      }
      if (profile.otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }

      // Verify OTP
      verifyOtp(profile.otp)
        .then(() => {
          setCurrentStep("review");
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
        });
      return;
    } else if (currentStep === "review") {
      handleSignup();
    }

    setError(null);
  };

  const handleBack = () => {
    if (showConfirmPassword) {
      setShowConfirmPassword(false);
      setError(null);
      return;
    }

    if (currentStep === "otp") {
      setCurrentStep("password");
      setShowConfirmPassword(true);
      setError(null);
      return;
    }

    const prevStepIndex = Math.max(0, currentStepIndex - 1);
    setCurrentStep(steps[prevStepIndex]);
    setError(null);
  };

  const handleSignup = async () => {
    setIsSubmitting(true);
    try {
      // Show success animation before redirecting
      setShowSuccess(true);

      // Call the signup API with proper parameters
      const response = await signupApi({
        fullName: profile.fullName,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth || new Date(),
        phone: profile.phone,
        admissionNumber: profile.admissionNumber,
        password: profile.password,
        confirmPassword: profile.confirmPassword,
      });

      // Save sanitized user details in localStorage (match backend schema, do NOT include confirmPassword)
      const sanitizedProfile = {
        name: profile.fullName,
        password: profile.password, // You may want to omit this in production for security
        dob: profile.dateOfBirth,
        gender: profile.gender,
        mobile: Number(profile.phone),
        admissionNumber: profile.admissionNumber,
      };
      localStorage.setItem("user", JSON.stringify(sanitizedProfile));
      localStorage.setItem("prayatna_currentUser", JSON.stringify(sanitizedProfile));
      setProfile((prev) => ({
        ...prev,
        ...((response.user || response.newUser || response) as Partial<StudentProfile>),
      }));

      // Wait for the animation to complete before redirecting
      setTimeout(() => {
        // Redirect to explore with success message
        window.location.href = "/explore?setup=complete";
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      setShowSuccess(false);
      setError("An error occurred during signup. Please try again.");
      console.log("Signup error:", err);
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
    [currentStep, profile, isSubmitting, showConfirmPassword],
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
      {/* Use the new LoadingAnimation component */}
      {showSuccess && (
        <LoadingAnimation
          title="Creating your student account"
          description="Setting up your PW Gurukulam dashboard..."
          variant="blue"
        />
      )}

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#4BA3C7] to-[#A484F3] rounded-full flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#2D2D2D]">
            {currentStep === "name" && "Welcome to PW Gurukulam"}
            {currentStep === "gender" && "Tell Us About Yourself"}
            {currentStep === "dob" && "Your Date of Birth"}
            {currentStep === "phone" && "Contact Information"}
            {currentStep === "admission" && "Academic Details"}
            {currentStep === "password" && "Secure Your Account"}
            {currentStep === "otp" && "OTP Verification"}
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

      <div
        className={`relative overflow-hidden ${
          currentStep === "review" ? "min-h-[300px]" : "min-h-[300px]"
        }`}
      >
        <AnimatePresence initial={false} custom={1}>
          {currentStep === "name" && (
            <motion.div
              key="name"
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
                    id="fullName"
                    type="text"
                    label="Your full name"
                    value={profile.fullName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="w-full"
                    autoFocus
                  />
                  <p className="text-sm text-[#6B7280]">
                    Enter your name as it appears on your school documents
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "gender" && (
            <motion.div
              key="gender"
              custom={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full"
            >
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="gender" className="text-[#2D2D2D]">
                    Select your gender
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            gender: option.value as "male" | "female" | "other",
                          })
                        }
                        className={`p-3 rounded-lg border-2 transition-all ${
                          profile.gender === option.value
                            ? "border-[#4BA3C7] bg-[#4BA3C7]/10 text-[#4BA3C7]"
                            : "border-[#E5E7EB] hover:border-[#4BA3C7]/50 text-[#6B7280]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "dob" && (
            <motion.div
              key="dob"
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
                  <Label htmlFor="dob" className="text-[#2D2D2D]">
                    Date of birth
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full flex justify-between text-left font-normal border-[#E5E7EB] hover:border-[#4BA3C7] h-12 px-4"
                      >
                        {profile.dateOfBirth ? (
                          format(profile.dateOfBirth, "PPP")
                        ) : (
                          <span className="text-[#6B7280]">
                            Select your date of birth
                          </span>
                        )}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto max-w-none max-h-none p-0 bg-white shadow-xl border border-[#E5E7EB] rounded-lg overflow-visible"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={profile.dateOfBirth}
                        onSelect={(date) =>
                          setProfile({ ...profile, dateOfBirth: date })
                        }
                        disabled={(date) => date > new Date()}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1990}
                        toYear={new Date().getFullYear()}
                        className="border-0 shadow-none"
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="text-sm text-[#6B7280] space-y-1">
                    <p>This will be verified with your Aadhaar card</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "phone" && (
            <motion.div
              key="phone"
              custom={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full"
            >
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Inputbox
                      id="phone"
                      type="tel"
                      label="Primary phone number"
                      value={profile.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Inputbox
                      id="alternatePhone"
                      type="tel"
                      label="Alternate phone number (optional)"
                      value={profile.alternatePhone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setProfile({
                          ...profile,
                          alternatePhone: e.target.value,
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <p className="text-sm text-[#6B7280]">
                    We'll use this for important notifications and account
                    recovery
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "admission" && (
            <motion.div
              key="admission"
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
                    id="admission"
                    type="text"
                    label="Admission number"
                    value={profile.admissionNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile({
                        ...profile,
                        admissionNumber: e.target.value,
                      })
                    }
                    className="w-full"
                    autoFocus
                  />
                  <p className="text-sm text-[#6B7280]">
                    Enter the admission number provided by PW Gurukulam
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "password" && (
            <motion.div
              key={showConfirmPassword ? "confirm-password" : "password"}
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
                  {!showConfirmPassword ? (
                    <>
                      <Inputbox
                        id="password"
                        type="password"
                        label="Create a strong password"
                        value={profile.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setProfile({ ...profile, password: e.target.value })
                        }
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() =>
                          setPasswordFocused(profile.password.length > 0)
                        }
                        className="w-full"
                        autoFocus
                      />

                      {/* Password strength indicator */}
                      {passwordFocused && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-3 mt-2 p-3 bg-[#F2F5F7] rounded-lg border border-[#E5E7EB]"
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-[#6B7280]">
                                Password strength
                              </span>
                              <span className="text-xs font-medium">
                                {passwordStrength <= 2 && (
                                  <span className="text-[#F76E6E]">Weak</span>
                                )}
                                {passwordStrength > 2 &&
                                  passwordStrength < 5 && (
                                    <span className="text-[#F59E0B]">
                                      Medium
                                    </span>
                                  )}
                                {passwordStrength >= 5 && (
                                  <span className="text-[#7DDE92]">Strong</span>
                                )}
                              </span>
                            </div>
                            <div className="w-full h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  passwordStrength <= 2
                                    ? "bg-[#F76E6E]"
                                    : passwordStrength < 5
                                    ? "bg-[#F59E0B]"
                                    : "bg-[#7DDE92]"
                                }`}
                                style={{
                                  width: `${(passwordStrength / 6) * 100}%`,
                                }}
                              />
                            </div>
                          </div>

                          <ul className="space-y-1 text-sm">
                            <li className="flex items-center gap-2">
                              <span
                                className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                  passwordValidation.minLength
                                    ? "bg-[#A2F0C1] text-[#2D2D2D]"
                                    : "bg-[#E5E7EB] text-[#6B7280]"
                                }`}
                              >
                                {passwordValidation.minLength ? "✓" : ""}
                              </span>
                              <span
                                className={
                                  passwordValidation.minLength
                                    ? "text-[#2D2D2D]"
                                    : "text-[#6B7280]"
                                }
                              >
                                At least 8 characters
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span
                                className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                  passwordValidation.hasUppercase
                                    ? "bg-[#A2F0C1] text-[#2D2D2D]"
                                    : "bg-[#E5E7EB] text-[#6B7280]"
                                }`}
                              >
                                {passwordValidation.hasUppercase ? "✓" : ""}
                              </span>
                              <span
                                className={
                                  passwordValidation.hasUppercase
                                    ? "text-[#2D2D2D]"
                                    : "text-[#6B7280]"
                                }
                              >
                                At least one uppercase letter
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span
                                className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                  passwordValidation.hasNumber
                                    ? "bg-[#A2F0C1] text-[#2D2D2D]"
                                    : "bg-[#E5E7EB] text-[#6B7280]"
                                }`}
                              >
                                {passwordValidation.hasNumber ? "✓" : ""}
                              </span>
                              <span
                                className={
                                  passwordValidation.hasNumber
                                    ? "text-[#2D2D2D]"
                                    : "text-[#6B7280]"
                                }
                              >
                                At least one number
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span
                                className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                  passwordValidation.hasSpecial
                                    ? "bg-[#A2F0C1] text-[#2D2D2D]"
                                    : "bg-[#E5E7EB] text-[#6B7280]"
                                }`}
                              >
                                {passwordValidation.hasSpecial ? "✓" : ""}
                              </span>
                              <span
                                className={
                                  passwordValidation.hasSpecial
                                    ? "text-[#2D2D2D]"
                                    : "text-[#6B7280]"
                                }
                              >
                                At least one special character
                              </span>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <>
                      <Inputbox
                        id="confirmPassword"
                        type="password"
                        label="Confirm your password"
                        value={profile.confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setProfile({
                            ...profile,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full"
                        autoFocus
                      />

                      {profile.confirmPassword && (
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                              passwordValidation.matches
                                ? "bg-[#A2F0C1] text-[#2D2D2D]"
                                : "bg-[#F76E6E]/20 text-[#F76E6E]"
                            }`}
                          >
                            {passwordValidation.matches ? "✓" : "×"}
                          </span>
                          <span
                            className={
                              passwordValidation.matches
                                ? "text-[#2D2D2D] text-sm"
                                : "text-[#F76E6E] text-sm"
                            }
                          >
                            {passwordValidation.matches
                              ? "Passwords match"
                              : "Passwords do not match"}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

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
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4BA3C7] to-[#A484F3] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2D2D2D]">
                    Verify Your Phone Number
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    We've sent a 6-digit verification code to
                  </p>
                  <p className="text-sm font-medium text-[#4BA3C7]">
                    +91 {profile.phone}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* OTP Input Boxes */}
                  <div className="flex justify-center gap-3">
                    {Array.from({ length: 6 }, (_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg font-bold border-2 border-[#E5E7EB] rounded-lg focus:border-[#4BA3C7] focus:outline-none transition-all duration-200 bg-white"
                        value={profile.otp[index] || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (!/^\d*$/.test(value)) return; // Only allow digits

                          const newOtp = profile.otp.split("");
                          newOtp[index] = value;
                          const updatedOtp = newOtp.join("");

                          setProfile({ ...profile, otp: updatedOtp });

                          // Auto-focus next input
                          if (value && index < 5) {
                            const nextInput = document.querySelector(
                              `input[data-index="${index + 1}"]`
                            ) as HTMLInputElement;
                            if (nextInput) nextInput.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          // Handle backspace
                          if (e.key === "Backspace" && !profile.otp[index] && index > 0) {
                            const prevInput = document.querySelector(
                              `input[data-index="${index - 1}"]`
                            ) as HTMLInputElement;
                            if (prevInput) prevInput.focus();
                          }
                        }}
                        data-index={index}
                      />
                    ))}
                  </div>

                  {/* Timer and Resend */}
                  <div className="text-center space-y-3">
                    {otpTimer > 0 ? (
                      <p className="text-sm text-[#6B7280]">
                        Resend OTP in{" "}
                        <span className="font-medium text-[#4BA3C7]">
                          {Math.floor(otpTimer / 60)}:
                          {(otpTimer % 60).toString().padStart(2, "0")}
                        </span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={isSubmitting}
                        className="text-sm font-medium text-[#4BA3C7] hover:text-[#3B82C7] transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? "Sending..." : "Resend OTP"}
                      </button>
                    )}

                    <p className="text-xs text-[#6B7280]">
                      Didn't receive the code? Check your spam folder or{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep("phone");
                          setError(null);
                        }}
                        className="text-[#4BA3C7] hover:underline font-medium"
                      >
                        edit phone number
                      </button>
                    </p>
                  </div>

                  {/* Success/Error State */}
                  {profile.otp.length === 6 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#7DDE92]/20 text-[#2D2D2D] rounded-full border border-[#7DDE92]/30">
                        <Check className="w-4 h-4 text-[#7DDE92]" />
                        <span className="text-sm font-medium">OTP Complete</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

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
                {/* Compact Profile Header */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-[#4BA3C7]/5 to-[#A484F3]/5 p-4 rounded-lg border border-[#E5E7EB]">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#4BA3C7] to-[#A484F3] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {profile.fullName.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#2D2D2D]">
                      {profile.fullName}
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      Student ID: {profile.admissionNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#7DDE92]/20 text-[#2D2D2D] rounded-full border border-[#7DDE92]/30">
                    <Check className="w-4 h-4 text-[#7DDE92]" />
                    <span className="text-sm font-medium">Ready</span>
                  </div>
                </div>

                {/* Compact Information Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Personal */}
                  <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
                    <div>
                      <div className="h-12 mb-4 bg-[#4BA3C7]/10 rounded-lg flex items-center justify-center">
                        <User className="w-8 h-8 text-[#4BA3C7]" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Gender</p>
                          <p className="text-sm font-medium text-[#2D2D2D] capitalize">
                            {profile.gender}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">
                            Date of Birth
                          </p>
                          <p className="text-sm font-medium text-[#2D2D2D]">
                            {profile.dateOfBirth
                              ? format(profile.dateOfBirth, "MMM dd, yyyy")
                              : "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
                    <div>
                      <div className="h-12 mb-4 bg-[#A484F3]/10 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-[#A484F3]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">
                            Primary Phone
                          </p>
                          <p className="text-sm font-medium text-[#2D2D2D] font-mono">
                            {profile.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Alternate</p>
                          <p className="text-sm font-medium text-[#2D2D2D] font-mono">
                            {profile.alternatePhone || (
                              <span className="text-[#6B7280] italic">None</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
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
          className="mt-2 text-sm text-[#F76E6E]"
        >
          {error}
        </motion.div>
      )}

      <div className="mt-8 flex justify-between items-center">
        {currentStepIndex > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#4BA3C7] hover:bg-[#4BA3C7]/5 px-4 py-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (window.location.href = "/auth")}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#4BA3C7] hover:bg-[#4BA3C7]/5 px-4 py-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Button>
        )}

        <Button
          onClick={handleNext}
          className={`flex items-center gap-2 px-6 py-2 font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
            currentStep === "review"
              ? "bg-gradient-to-r from-[#7DDE92] to-[#A2F0C1] hover:from-[#7DDE92]/90 hover:to-[#A2F0C1]/90 text-[#2D2D2D]"
              : "bg-gradient-to-r from-[#4BA3C7] to-[#A484F3] hover:from-[#4BA3C7]/90 hover:to-[#A484F3]/90 text-white"
          } border-0`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              />
              Processing...
            </span>
          ) : (
            <>
              {currentStep === "review" ? "Complete Registration" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {currentStep === "name" && (
        <>
          <div className="mt-6 text-center text-sm text-[#6B7280]">
            Already have an account?{" "}
            <a href="/login" className="text-[#4BA3C7] hover:underline">
              Log in
            </a>
          </div>
        </>
      )}
    </motion.div>
  );
}
