import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Upload, Calendar, User, Target, Heart, GraduationCap } from 'lucide-react';
import { Button } from './button';
import { Inputbox } from './inputbox';

interface CompleteProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profileData: any) => Promise<void>;
  isSubmitting: boolean;
}

export const CompleteProfilePopup: React.FC<CompleteProfilePopupProps> = ({
  isOpen,
  onClose,
  onComplete,
  isSubmitting
}) => {
  const [profileData, setProfileData] = useState({
    class: '',
    section: '',
    rollNumber: '',
    dateOfBirth: '',
    gender: '',
    hobbies: [''],
    interests: [''],
    currentGoals: [''],
  });

  const [error, setError] = useState<string | null>(null);

  const handleArrayFieldChange = (field: 'hobbies' | 'interests' | 'currentGoals', index: number, value: string) => {
    const newArray = [...profileData[field]];
    newArray[index] = value;
    setProfileData({ ...profileData, [field]: newArray });
  };

  const addArrayField = (field: 'hobbies' | 'interests' | 'currentGoals') => {
    setProfileData({
      ...profileData,
      [field]: [...profileData[field], '']
    });
  };

  const removeArrayField = (field: 'hobbies' | 'interests' | 'currentGoals', index: number) => {
    if (profileData[field].length > 1) {
      const newArray = profileData[field].filter((_, i) => i !== index);
      setProfileData({ ...profileData, [field]: newArray });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!profileData.class.trim()) {
      setError('Class is required');
      return;
    }

    // Filter out empty values
    const cleanedData = {
      ...profileData,
      hobbies: profileData.hobbies.filter(h => h.trim() !== ''),
      interests: profileData.interests.filter(i => i.trim() !== ''),
      currentGoals: profileData.currentGoals.filter(g => g.trim() !== ''),
    };

    try {
      await onComplete(cleanedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete profile');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Complete Your Profile</h2>
                  <p className="text-blue-100">Tell us more about yourself to personalize your experience</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Academic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Inputbox
                    label="Class *"
                    value={profileData.class}
                    onChange={(e) => setProfileData({ ...profileData, class: e.target.value })}
                    placeholder="e.g., 8th, 9th, 10th"
                    required
                  />
                  <Inputbox
                    label="Section"
                    value={profileData.section}
                    onChange={(e) => setProfileData({ ...profileData, section: e.target.value })}
                    placeholder="e.g., A, B, C"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Inputbox
                    label="Roll Number"
                    value={profileData.rollNumber}
                    onChange={(e) => setProfileData({ ...profileData, rollNumber: e.target.value })}
                    placeholder="Your roll number"
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <Inputbox
                  label="Date of Birth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                />
              </div>

              {/* Hobbies */}
              <div className="bg-pink-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Hobbies & Interests</h3>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Hobbies</label>
                  {profileData.hobbies.map((hobby, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Inputbox
                        value={hobby}
                        onChange={(e) => handleArrayFieldChange('hobbies', index, e.target.value)}
                        placeholder="Enter a hobby"
                        className="flex-1"
                      />
                      {profileData.hobbies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('hobbies', index)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('hobbies')}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Hobby
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Interests</label>
                  {profileData.interests.map((interest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Inputbox
                        value={interest}
                        onChange={(e) => handleArrayFieldChange('interests', index, e.target.value)}
                        placeholder="Enter an interest"
                        className="flex-1"
                      />
                      {profileData.interests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('interests', index)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('interests')}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Interest
                  </button>
                </div>
              </div>

              {/* Goals */}
              <div className="bg-green-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Current Goals</h3>
                </div>
                
                <div className="space-y-3">
                  {profileData.currentGoals.map((goal, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Inputbox
                        value={goal}
                        onChange={(e) => handleArrayFieldChange('currentGoals', index, e.target.value)}
                        placeholder="Enter a goal"
                        className="flex-1"
                      />
                      {profileData.currentGoals.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayField('currentGoals', index)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField('currentGoals')}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Goal
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Skip for now
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isSubmitting ? 'Completing...' : 'Complete Profile'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}; 