"use client";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, School, Users, Award, Calendar } from "lucide-react";

export default function SchoolAuthPage() {
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
            <School className="w-14 h-14" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2 tracking-tight">
          School Registration Portal
        </h1>
        <p className="text-[#6B7280] mb-2">
          Join the Prayatna educational community
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
          {/* School illustration */}
          <div className="w-72 h-52 mx-auto bg-gradient-to-br from-[#F2F5F7] to-[#E5E7EB] rounded-2xl flex items-center justify-center border border-[#4BA3C7]/20">
            <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* School building */}
              <rect x="40" y="80" width="120" height="60" fill="#4BA3C7"/>
              <rect x="50" y="90" width="100" height="50" fill="#A484F3"/>
              
              {/* School roof */}
              <polygon points="30,80 100,40 170,80" fill="#2D2D2D"/>
              
              {/* Flag pole */}
              <line x1="100" y1="40" x2="100" y2="20" stroke="#7DDE92" strokeWidth="3"/>
              <rect x="100" y="20" width="15" height="8" fill="#F76E6E"/>
              
              {/* Windows */}
              <rect x="60" y="100" width="15" height="15" fill="#7DDE92"/>
              <rect x="85" y="100" width="15" height="15" fill="#7DDE92"/>
              <rect x="110" y="100" width="15" height="15" fill="#7DDE92"/>
              <rect x="135" y="100" width="15" height="15" fill="#7DDE92"/>
              
              {/* Door */}
              <rect x="90" y="115" width="20" height="25" fill="#2D2D2D"/>
              <circle cx="105" cy="127" r="2" fill="#7DDE92"/>
              
              {/* Students */}
              <circle cx="30" cy="130" r="8" fill="#F76E6E"/>
              <rect x="22" y="138" width="16" height="12" fill="#4BA3C7"/>
              
              <circle cx="170" cy="125" r="8" fill="#A484F3"/>
              <rect x="162" y="133" width="16" height="12" fill="#7DDE92"/>
              
              {/* Ground */}
              <rect x="0" y="140" width="200" height="20" fill="#7DDE92"/>
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
            <Users size={18} />
          </div>
          <span className="text-xs text-[#6B7280]">Student Management</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#A484F3]/10 flex items-center justify-center mb-2 text-[#A484F3]">
            <Award size={18} />
          </div>
          <span className="text-xs text-[#6B7280]">Academic Excellence</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#7DDE92]/10 flex items-center justify-center mb-2 text-[#7DDE92]">
            <Calendar size={18} />
          </div>
          <span className="text-xs text-[#6B7280]">Event Management</span>
        </motion.div>
      </div>

      {/* Admin credentials notice */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-100">
        <p className="text-sm text-gray-700 font-medium">
          🏫 Schools register using credentials provided by platform administration
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
            onClick={() => navigate('/school/signup')}
          >
            Register Your School
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
        <School size={12} className="inline-block text-[#7DDE92]" />
        <span>Building the future of education together</span>
      </motion.p>
    </motion.div>
  );
} 