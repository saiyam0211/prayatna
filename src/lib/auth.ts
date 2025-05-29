import { api, authUtils } from './api';

// Types
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    role: 'school' | 'student' | 'teacher';
    profile: any;
  };
}

export interface StudentSignupData {
  phoneNumber: string;
  enrollmentId: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface StudentLoginData {
  phoneNumber: string;
  password: string;
}

export interface TeacherLoginData {
  email: string;
  password: string;
}

export interface SchoolLoginData {
  schoolId: string;
  password: string;
}

export interface OTPRequest {
  phoneNumber: string;
  enrollmentId: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
}

// Auth API functions
export const authAPI = {
  // OTP Functions
  async sendOTP(data: OTPRequest): Promise<OTPResponse> {
    try {
      const response = await api.post<OTPResponse>('/auth/student/send-otp', data);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to send OTP');
    }
  },

  // Student Authentication
  async studentSignup(data: StudentSignupData): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/student/signup', data);
      
      if (response.success && response.token) {
        authUtils.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Student signup failed');
    }
  },

  async studentLogin(data: StudentLoginData): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/student/login', data);
      
      if (response.success && response.token) {
        authUtils.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Student login failed');
    }
  },

  // Teacher Authentication
  async teacherLogin(data: TeacherLoginData): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/teacher/login', data);
      
      if (response.success && response.token) {
        authUtils.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Teacher login failed');
    }
  },

  // School Authentication
  async schoolLogin(data: SchoolLoginData): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/school/login', data);
      
      if (response.success && response.token) {
        authUtils.setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'School login failed');
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authUtils.removeAuthToken();
    }
  },

  // Get current user profile
  async getCurrentUser(): Promise<any> {
    try {
      const role = authUtils.getUserRole();
      if (!role) throw new Error('No user logged in');

      let endpoint = '';
      switch (role) {
        case 'student':
          endpoint = '/student/profile';
          break;
        case 'teacher':
          endpoint = '/teacher/profile';
          break;
        case 'school':
          endpoint = '/school/profile';
          break;
        default:
          throw new Error('Invalid user role');
      }

      return await api.get(endpoint);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get user profile');
    }
  },

  // Verify token validity
  async verifyToken(): Promise<boolean> {
    try {
      const token = authUtils.getAuthToken();
      if (!token) return false;

      await api.get('/auth/verify');
      return true;
    } catch (error) {
      authUtils.removeAuthToken();
      return false;
    }
  },
};

// Auth context helpers
export const useAuth = () => {
  const isAuthenticated = authUtils.isAuthenticated();
  const userRole = authUtils.getUserRole();
  const userId = authUtils.getUserId();

  return {
    isAuthenticated,
    userRole,
    userId,
    login: {
      student: authAPI.studentLogin,
      teacher: authAPI.teacherLogin,
      school: authAPI.schoolLogin,
    },
    signup: {
      student: authAPI.studentSignup,
    },
    otp: {
      send: authAPI.sendOTP,
    },
    student: {
      getDashboard: student.getDashboard,
      completeProfile: student.completeProfile,
      updateProfile: student.updateProfile,
      addAchievement: student.addAchievement,
      getAchievements: student.getAchievements,
      uploadMarksheet: student.uploadMarksheet,
      getFeed: student.getFeed,
      createPost: student.createPost,
      getNotifications: student.getNotifications,
    },
    school: {
      getDashboard: school.getDashboard,
      createStudent: school.createStudent,
      createTeacher: school.createTeacher,
      getStudents: school.getStudents,
      getTeachers: school.getTeachers,
    },
    logout: authAPI.logout,
    getCurrentUser: authAPI.getCurrentUser,
    verifyToken: authAPI.verifyToken,
  };
};

export default authAPI;

// School Dashboard APIs
export const school = {
  // Get dashboard data
  getDashboard: async () => {
    try {
      const response = await api.get('/school/dashboard');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get dashboard data');
    }
  },

  // Create student record
  createStudent: async (studentData: {
    enrollmentId: string;
    phoneNumber: string;
  }) => {
    try {
      const response = await api.post('/school/students', studentData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create student');
    }
  },

  // Create teacher account
  createTeacher: async (teacherData: {
    email: string;
    password: string;
    name: string;
    department: string;
    experience: number;
  }) => {
    try {
      const response = await api.post('/school/teachers', teacherData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create teacher');
    }
  },

  // Get all students
  getStudents: async () => {
    try {
      const response = await api.get('/school/students');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get students');
    }
  },

  // Get all teachers
  getTeachers: async () => {
    try {
      const response = await api.get('/school/teachers');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get teachers');
    }
  }
};

// Student Dashboard APIs
export const student = {
  // Get dashboard data
  getDashboard: async () => {
    try {
      const response = await api.get('/student/dashboard');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get dashboard data');
    }
  },

  // Complete profile after signup
  completeProfile: async (profileData: {
    class: string;
    hobbies: string[];
    interests: string[];
    currentGoals: string[];
    section?: string;
    rollNumber?: string;
    dateOfBirth?: string;
    gender?: string;
  }) => {
    try {
      const response = await api.post('/student/complete-profile', profileData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to complete profile');
    }
  },

  // Update profile
  updateProfile: async (profileData: {
    hobbies?: string[];
    interests?: string[];
    currentGoals?: string[];
    section?: string;
    rollNumber?: string;
    avatar?: string;
  }) => {
    try {
      const response = await api.put('/student/profile', profileData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  },

  // Add achievement
  addAchievement: async (achievementData: {
    title: string;
    description: string;
    emoji: string;
    year: number;
    category?: string;
    media?: string[];
  }) => {
    try {
      const response = await api.post('/student/achievements', achievementData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add achievement');
    }
  },

  // Get achievements
  getAchievements: async () => {
    try {
      const response = await api.get('/student/achievements');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get achievements');
    }
  },

  // Upload marksheet for skill calculation
  uploadMarksheet: async (marksheetData: {
    images: string[];
    classInfo: string;
  }) => {
    try {
      const response = await api.post('/student/education/marksheet', marksheetData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to upload marksheet');
    }
  },

  // Get posts/feed
  getFeed: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/student/feed?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get feed');
    }
  },

  // Create post
  createPost: async (postData: {
    content: string;
    media?: string[];
    tags?: string[];
    type?: string;
    isAchievement?: boolean;
  }) => {
    try {
      const response = await api.post('/student/posts', postData);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create post');
    }
  },

  // Get notifications
  getNotifications: async () => {
    try {
      const response = await api.get('/student/notifications');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get notifications');
    }
  }
}; 