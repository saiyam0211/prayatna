"use client";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Trophy } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl p-8 text-center"
    >
      <div className="mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-[#4BA3C7] to-[#A484F3] rounded-full flex items-center justify-center shadow-lg"
        >
          <div className="w-14 h-14 text-white">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2 tracking-tight">
          PW Gurukulam
        </h1>
        <p className="text-[#6B7280] mb-2">
          Your gateway to academic excellence
        </p>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#4BA3C7]"></span>
          <span className="w-2 h-2 rounded-full bg-[#A484F3]"></span>
          <span className="w-2 h-2 rounded-full bg-[#7DDE92]"></span>
        </div>
      </div>

      <div className="mb-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          {/* Student learning illustration */}
          <div className="w-72 h-52 mx-auto bg-gradient-to-br from-[#F2F5F7] to-[#E5E7EB] rounded-2xl flex items-center justify-center border border-[#4BA3C7]/20">
            <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Student desk */}
              <rect x="40" y="100" width="120" height="8" rx="4" fill="#4BA3C7"/>
              <rect x="42" y="108" width="4" height="20" fill="#4BA3C7"/>
              <rect x="154" y="108" width="4" height="20" fill="#4BA3C7"/>
              
              {/* Laptop/Book */}
              <rect x="60" y="85" width="80" height="12" rx="2" fill="#A484F3"/>
              <rect x="65" y="80" width="70" height="8" rx="1" fill="#7DDE92"/>
              
              {/* Student figure (simplified) */}
              <circle cx="100" cy="45" r="12" fill="#F76E6E"/>
              <rect x="88" y="55" width="24" height="30" rx="12" fill="#4BA3C7"/>
              
              {/* Books on desk */}
              <rect x="150" y="90" width="8" height="12" fill="#7DDE92"/>
              <rect x="148" y="88" width="8" height="12" fill="#A484F3"/>
              <rect x="146" y="86" width="8" height="12" fill="#F76E6E"/>
              
              {/* Pencil holder */}
              <ellipse cx="45" cy="95" rx="6" ry="8" fill="#4BA3C7"/>
              <rect x="42" y="88" width="2" height="10" fill="#F76E6E"/>
              <rect x="45" y="85" width="2" height="13" fill="#7DDE92"/>
              <rect x="48" y="87" width="2" height="11" fill="#A484F3"/>
              
              {/* Achievement stars */}
              <path d="M30 30L32 36L38 36L33 40L35 46L30 42L25 46L27 40L22 36L28 36Z" fill="#7DDE92"/>
              <path d="M170 25L172 31L178 31L173 35L175 41L170 37L165 41L167 35L162 31L168 31Z" fill="#A484F3"/>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#4BA3C7]/10 flex items-center justify-center mb-2 text-[#4BA3C7]">
            <BookOpen size={18} />
          </div>
          <span className="text-xs text-[#6B7280]">Study Materials</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#A484F3]/10 flex items-center justify-center mb-2 text-[#A484F3]">
            <Users size={18} />
          </div>
          <span className="text-xs text-[#6B7280]">Community</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#7DDE92]/10 flex items-center justify-center mb-2 text-[#7DDE92]">
            <Trophy size={18} />
          </div>
          <span className="text-xs text-[#6B7280]">Achievements</span>
        </motion.div>
      </div>

      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <Button 
            variant="default" 
            size="lg" 
            className="w-full bg-gradient-to-r from-[#4BA3C7] to-[#A484F3] hover:from-[#4BA3C7]/90 hover:to-[#A484F3]/90 font-medium h-12 text-base shadow-lg text-white border-0"
            onClick={() => navigate('/login')}
          >
            Login 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full border-[#4BA3C7] text-[#4BA3C7] hover:bg-[#4BA3C7]/5 hover:border-[#4BA3C7]/80 font-medium h-12 text-base"
            onClick={() => navigate('/signup')}
          >
            Create Account
          </Button>
        </motion.div>
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 text-sm text-[#6B7280] flex items-center justify-center gap-1"
      >
        <BookOpen size={12} className="inline-block text-[#7DDE92]" />
        <span>Join thousands of students achieving success</span>
      </motion.p>
    </motion.div>
  );
} 