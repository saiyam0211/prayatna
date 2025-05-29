"use client";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Trophy, GraduationCap } from "lucide-react";

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
            <GraduationCap className="w-14 h-14" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2 tracking-tight">
          Teacher Portal
        </h1>
        <p className="text-[#6B7280] mb-2">
          Access your teaching dashboard and resources
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
          {/* Teacher illustration */}
          <div className="w-72 h-52 mx-auto bg-gradient-to-br from-[#F2F5F7] to-[#E5E7EB] rounded-2xl flex items-center justify-center border border-[#4BA3C7]/20">
            <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Blackboard */}
              <rect x="20" y="30" width="160" height="80" rx="4" fill="#2D2D2D"/>
              <rect x="25" y="35" width="150" height="70" rx="2" fill="#374151"/>
              
              {/* Writing on blackboard */}
              <path d="M40 50 Q60 45 80 50 T120 50" stroke="#7DDE92" strokeWidth="2" fill="none"/>
              <path d="M40 65 L160 65" stroke="#A484F3" strokeWidth="2"/>
              <circle cx="140" cy="75" r="8" stroke="#F76E6E" strokeWidth="2" fill="none"/>
              
              {/* Teacher figure */}
              <circle cx="60" cy="125" r="12" fill="#F76E6E"/>
              <rect x="48" y="135" width="24" height="20" rx="12" fill="#4BA3C7"/>
              
              {/* Pointer */}
              <line x1="72" y1="140" x2="85" y2="120" stroke="#A484F3" strokeWidth="3"/>
              
              {/* Desk */}
              <rect x="20" y="148" width="160" height="8" rx="4" fill="#4BA3C7"/>
              
              {/* Books and supplies */}
              <rect x="150" y="138" width="8" height="12" fill="#7DDE92"/>
              <rect x="148" y="136" width="8" height="12" fill="#A484F3"/>
              <rect x="146" y="134" width="8" height="12" fill="#F76E6E"/>
              
              {/* Coffee cup */}
              <ellipse cx="35" cy="143" rx="4" ry="6" fill="#4BA3C7"/>
              <ellipse cx="35" cy="140" rx="3" ry="2" fill="#7DDE92"/>
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
          <span className="text-xs text-[#6B7280]">Course Management</span>
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
          <span className="text-xs text-[#6B7280]">Student Progress</span>
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
          <span className="text-xs text-[#6B7280]">Analytics</span>
        </motion.div>
      </div>

      {/* School credentials notice */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-100">
        <p className="text-sm text-gray-700 font-medium">
          🔐 Teachers sign in using credentials provided by the school administration
        </p>
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
            onClick={() => navigate('/teacher/login')}
          >
            Sign In to Teacher Portal
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 text-sm text-[#6B7280] flex items-center justify-center gap-1"
      >
        <GraduationCap size={12} className="inline-block text-[#7DDE92]" />
        <span>Empowering educators to inspire excellence</span>
      </motion.p>
    </motion.div>
  );
} 