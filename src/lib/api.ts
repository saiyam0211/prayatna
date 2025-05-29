const API_BASE_URL = 'http://localhost:3001/api';

// Configure default request options
const defaultOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

// API helper function
export const api = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // GET request
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  // POST request
  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // PUT request
  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  // DELETE request
  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },

  // POST with file upload (multipart/form-data)
  uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const config = {
      ...defaultOptions,
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type header to let browser set it with boundary
        ...Object.fromEntries(
          Object.entries(defaultOptions.headers || {}).filter(
            ([key]) => key.toLowerCase() !== 'content-type'
          )
        ),
      },
    };

    return this.request<T>(endpoint, config);
  },
};

// Auth helper functions
export const authUtils = {
  setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
    // Update default headers for future requests
    (defaultOptions.headers as any).Authorization = `Bearer ${token}`;
  },

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  },

  removeAuthToken() {
    localStorage.removeItem('authToken');
    delete (defaultOptions.headers as any).Authorization;
  },

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  },

  getUserRole(): string | null {
    const token = this.getAuthToken();
    if (!token) return null;
    
    try {
      // Decode JWT payload (basic decode, not verification)
      const parts = token.split('.');
      if (parts.length !== 3 || !parts[1]) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  },

  getUserId(): string | null {
    const token = this.getAuthToken();
    if (!token) return null;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3 || !parts[1]) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.userId || payload.id || null;
    } catch {
      return null;
    }
  },
};

// Initialize auth token if it exists
const existingToken = authUtils.getAuthToken();
if (existingToken) {
  (defaultOptions.headers as any).Authorization = `Bearer ${existingToken}`;
}

export default api; 