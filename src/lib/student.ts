import { api } from './api';

// Types
export interface StudentProfile {
  id: string;
  phoneNumber: string;
  enrollmentId: string;
  profile: {
    name?: string;
    class?: string;
    section?: string;
    rollNumber?: string;
    hobbies?: string[];
    interests?: string[];
    currentGoals?: string[];
    avatar?: string;
    isProfileComplete: boolean;
  };
  streak: {
    currentStreak: number;
    bestStreak: number;
    lastActiveDate: string;
  };
  skillMarks: {
    mathematics?: number;
    english?: number;
    science?: number;
  };
  achievements: Achievement[];
  education: EducationRecord[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  media?: string[];
  year: number;
  category: string;
  createdAt: string;
}

export interface EducationRecord {
  id: string;
  examType: string;
  subjects: {
    [subject: string]: {
      obtainedMarks: number;
      maxMarks: number;
      grade?: string;
    };
  };
  examDate: string;
  class: string;
  percentage: number;
  fileUrl: string;
}

export interface ProfileCompletionData {
  name: string;
  class: string;
  section?: string;
  rollNumber?: string;
  hobbies: string[];
  interests: string[];
  currentGoals: string[];
}

export interface AchievementData {
  title: string;
  description: string;
  emoji: string;
  category: string;
  year?: number;
  media?: File[];
}

// Student API functions
export const studentAPI = {
  // Profile Management
  async getProfile(): Promise<StudentProfile> {
    try {
      return await api.get<StudentProfile>('/student/profile');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get student profile');
    }
  },

  async completeProfile(profileData: ProfileCompletionData): Promise<{ success: boolean; message: string; profile: StudentProfile }> {
    try {
      return await api.put('/student/complete-profile', profileData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to complete profile');
    }
  },

  async updateProfile(profileData: Partial<ProfileCompletionData>): Promise<StudentProfile> {
    try {
      return await api.put<StudentProfile>('/student/profile', profileData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  },

  // Achievement Management
  async getAchievements(): Promise<Achievement[]> {
    try {
      const response = await api.get<{ achievements: Achievement[] }>('/student/achievements');
      return response.achievements;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get achievements');
    }
  },

  async createAchievement(achievementData: AchievementData): Promise<{ success: boolean; message: string; achievement: Achievement }> {
    try {
      const formData = new FormData();
      formData.append('title', achievementData.title);
      formData.append('description', achievementData.description);
      formData.append('emoji', achievementData.emoji);
      formData.append('category', achievementData.category);
      formData.append('year', String(achievementData.year || new Date().getFullYear()));

      if (achievementData.media && achievementData.media.length > 0) {
        achievementData.media.forEach((file, index) => {
          formData.append(`media`, file);
        });
      }

      return await api.uploadFile('/student/achievements', formData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create achievement');
    }
  },

  async deleteAchievement(achievementId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.delete(`/student/achievements/${achievementId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete achievement');
    }
  },

  // Education & Marksheets
  async uploadMarksheet(marksheetFile: File, examType: string, examDate: string, className: string): Promise<{ success: boolean; message: string; education: EducationRecord }> {
    try {
      const formData = new FormData();
      formData.append('marksheet', marksheetFile);
      formData.append('examType', examType);
      formData.append('examDate', examDate);
      formData.append('class', className);

      return await api.uploadFile('/student/education/marksheet', formData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to upload marksheet');
    }
  },

  async getEducationRecords(): Promise<EducationRecord[]> {
    try {
      const response = await api.get<{ records: EducationRecord[] }>('/student/education');
      return response.records;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get education records');
    }
  },

  async deleteEducationRecord(recordId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.delete(`/student/education/${recordId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete education record');
    }
  },

  // Skill Marks & Analysis
  async getSkillMarks(): Promise<{ mathematics: number; english: number; science: number }> {
    try {
      const response = await api.get<{ skillMarks: { mathematics: number; english: number; science: number } }>('/student/skill-marks');
      return response.skillMarks;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get skill marks');
    }
  },

  async requestSkillAnalysis(): Promise<{ success: boolean; message: string; skillMarks: any }> {
    try {
      return await api.post('/student/analyze-skills');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to request skill analysis');
    }
  },

  // Streak Management
  async updateStreak(): Promise<{ streak: StudentProfile['streak'] }> {
    try {
      return await api.post('/student/update-streak');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update streak');
    }
  },

  async getMotivationalQuote(): Promise<{ quote: string; author: string }> {
    try {
      return await api.get('/student/motivational-quote');
    } catch (error) {
      // Return a default quote if API fails
      return {
        quote: "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown.",
        author: "Robin Sharma"
      };
    }
  },

  // Dashboard Data
  async getDashboardData(): Promise<{
    profile: StudentProfile;
    recentPosts: any[];
    notifications: any[];
    streak: StudentProfile['streak'];
    motivationalQuote?: { quote: string; author: string };
  }> {
    try {
      return await api.get('/student/dashboard');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get dashboard data');
    }
  },

  // Avatar Upload
  async uploadAvatar(avatarFile: File): Promise<{ success: boolean; message: string; avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      return await api.uploadFile('/student/avatar', formData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to upload avatar');
    }
  },
};

export default studentAPI; 