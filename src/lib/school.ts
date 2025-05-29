import { api } from './api';

// Types
export interface CreateStudentData {
  phoneNumber: string;
  enrollmentId: string;
}

export interface CreateTeacherData {
  email: string;
  password: string;
  name: string;
  department: string;
  experience: number;
}

export interface SchoolProfile {
  id: string;
  schoolId: string;
  profile: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
    website: string;
    establishedYear: number;
    logo: string;
    isProfileComplete: boolean;
  };
  settings: {
    allowStudentSignup: boolean;
    requireProfileCompletion: boolean;
    moderateAllPosts: boolean;
    allowPublicPosts: boolean;
  };
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalPosts: number;
    activeUsers: number;
  };
}

export interface SchoolAnalytics {
  totalUsers: number;
  activeUsers: number;
  engagementRate: number;
  totalPosts: number;
  approvedPosts: number;
  flaggedPosts: number;
  recentActivity: any[];
}

export interface FlaggedPost {
  id: string;
  content: string;
  author: {
    name: string;
    id: string;
    type: 'student' | 'teacher';
  };
  createdAt: string;
  moderationReason: string;
  safetyScore: number;
}

// School API functions
export const schoolAPI = {
  // Profile Management
  async getProfile(): Promise<SchoolProfile> {
    try {
      return await api.get<SchoolProfile>('/school/profile');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get school profile');
    }
  },

  async updateProfile(profileData: Partial<SchoolProfile['profile']>): Promise<SchoolProfile> {
    try {
      return await api.put<SchoolProfile>('/school/profile', profileData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update school profile');
    }
  },

  // Student Management
  async createStudent(studentData: CreateStudentData): Promise<{ success: boolean; message: string; student: any }> {
    try {
      return await api.post('/school/create-student', studentData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create student');
    }
  },

  async getStudents(): Promise<any[]> {
    try {
      const response = await api.get<{ students: any[] }>('/school/students');
      return response.students;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get students');
    }
  },

  async deleteStudent(studentId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.delete(`/school/students/${studentId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete student');
    }
  },

  // Teacher Management
  async createTeacher(teacherData: CreateTeacherData): Promise<{ success: boolean; message: string; teacher: any }> {
    try {
      return await api.post('/school/create-teacher', teacherData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create teacher');
    }
  },

  async getTeachers(): Promise<any[]> {
    try {
      const response = await api.get<{ teachers: any[] }>('/school/teachers');
      return response.teachers;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get teachers');
    }
  },

  async deleteTeacher(teacherId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.delete(`/school/teachers/${teacherId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete teacher');
    }
  },

  // Analytics & Dashboard
  async getAnalytics(): Promise<SchoolAnalytics> {
    try {
      return await api.get<SchoolAnalytics>('/school/analytics');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get school analytics');
    }
  },

  async getDashboardData(): Promise<{
    profile: SchoolProfile;
    analytics: SchoolAnalytics;
    recentPosts: any[];
    flaggedPosts: FlaggedPost[];
  }> {
    try {
      return await api.get('/school/dashboard');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get dashboard data');
    }
  },

  // Post Management
  async getFlaggedPosts(): Promise<FlaggedPost[]> {
    try {
      const response = await api.get<{ posts: FlaggedPost[] }>('/school/flagged-posts');
      return response.posts;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get flagged posts');
    }
  },

  async approvePost(postId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.post(`/school/posts/${postId}/approve`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to approve post');
    }
  },

  async rejectPost(postId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.post(`/school/posts/${postId}/reject`, { reason });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to reject post');
    }
  },

  async deletePost(postId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.delete(`/school/posts/${postId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete post');
    }
  },

  async getRecentPosts(): Promise<any[]> {
    try {
      const response = await api.get<{ posts: any[] }>('/school/recent-posts');
      return response.posts;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get recent posts');
    }
  },

  // School Posts (notices, announcements)
  async createSchoolPost(postData: {
    content: string;
    category: 'notice' | 'announcement' | 'event' | 'general';
    title?: string;
    attachments?: string[];
  }): Promise<{ success: boolean; message: string; post: any }> {
    try {
      return await api.post('/school/posts', postData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create school post');
    }
  },

  async getSchoolPosts(): Promise<any[]> {
    try {
      const response = await api.get<{ posts: any[] }>('/school/posts');
      return response.posts;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get school posts');
    }
  },

  // Settings
  async updateSettings(settings: Partial<SchoolProfile['settings']>): Promise<{ success: boolean; message: string }> {
    try {
      return await api.put('/school/settings', settings);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update school settings');
    }
  },
};

export default schoolAPI; 