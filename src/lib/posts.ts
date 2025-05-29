import { api } from './api';

// Types
export interface Post {
  id: string;
  content: string;
  title?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: 'student' | 'teacher' | 'school';
  };
  type: 'general' | 'achievement' | 'study' | 'notice' | 'announcement' | 'event';
  category?: string;
  tags: string[];
  media: string[];
  likes: string[];
  comments: Comment[];
  shares: number;
  views: number;
  isApproved: boolean;
  moderation: {
    status: 'pending' | 'approved' | 'rejected';
    flagReason?: string;
    safetyScore?: number;
  };
  createdAt: string;
  updatedAt: string;
  uniqueAddress: string;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: 'student' | 'teacher' | 'school';
  };
  parentId?: string;
  replies: Comment[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  content: string;
  title?: string;
  type: Post['type'];
  category?: string;
  tags: string[];
  media?: File[];
}

export interface CreateCommentData {
  content: string;
  postId: string;
  parentId?: string;
}

export interface PostsResponse {
  posts: Post[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

// Posts API functions
export const postsAPI = {
  // Get Posts (with pagination and filtering)
  async getPosts(options: {
    page?: number;
    limit?: number;
    type?: Post['type'];
    authorRole?: 'student' | 'teacher' | 'school';
    tags?: string[];
    sortBy?: 'createdAt' | 'likes' | 'comments' | 'relevance';
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<PostsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (options.page) params.append('page', String(options.page));
      if (options.limit) params.append('limit', String(options.limit));
      if (options.type) params.append('type', options.type);
      if (options.authorRole) params.append('authorRole', options.authorRole);
      if (options.tags && options.tags.length > 0) params.append('tags', options.tags.join(','));
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);

      const queryString = params.toString();
      const endpoint = queryString ? `/posts?${queryString}` : '/posts';

      return await api.get<PostsResponse>(endpoint);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get posts');
    }
  },

  // Get Single Post
  async getPost(postId: string): Promise<Post> {
    try {
      return await api.get<Post>(`/posts/${postId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get post');
    }
  },

  // Create Post
  async createPost(postData: CreatePostData): Promise<{ success: boolean; message: string; post: Post }> {
    try {
      const formData = new FormData();
      formData.append('content', postData.content);
      if (postData.title) formData.append('title', postData.title);
      formData.append('type', postData.type);
      if (postData.category) formData.append('category', postData.category);
      formData.append('tags', JSON.stringify(postData.tags));

      if (postData.media && postData.media.length > 0) {
        postData.media.forEach((file) => {
          formData.append('media', file);
        });
      }

      return await api.uploadFile('/posts', formData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create post');
    }
  },

  // Update Post
  async updatePost(postId: string, updateData: Partial<CreatePostData>): Promise<{ success: boolean; message: string; post: Post }> {
    try {
      return await api.put(`/posts/${postId}`, updateData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update post');
    }
  },

  // Delete Post
  async deletePost(postId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.delete(`/posts/${postId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete post');
    }
  },

  // Like/Unlike Post
  async toggleLike(postId: string): Promise<{ success: boolean; message: string; isLiked: boolean; likesCount: number }> {
    try {
      return await api.post(`/posts/${postId}/like`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to toggle like');
    }
  },

  // Share Post
  async sharePost(postId: string): Promise<{ success: boolean; message: string; sharesCount: number }> {
    try {
      return await api.post(`/posts/${postId}/share`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to share post');
    }
  },

  // View Post (increment view count)
  async viewPost(postId: string): Promise<{ success: boolean; views: number }> {
    try {
      return await api.post(`/posts/${postId}/view`);
    } catch (error) {
      // Don't throw error for view tracking failures
      console.warn('Failed to track post view:', error);
      return { success: false, views: 0 };
    }
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const response = await api.get<{ comments: Comment[] }>(`/posts/${postId}/comments`);
      return response.comments;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get comments');
    }
  },

  async createComment(commentData: CreateCommentData): Promise<{ success: boolean; message: string; comment: Comment }> {
    try {
      return await api.post(`/posts/${commentData.postId}/comments`, {
        content: commentData.content,
        parentId: commentData.parentId,
      });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create comment');
    }
  },

  async updateComment(commentId: string, content: string): Promise<{ success: boolean; message: string; comment: Comment }> {
    try {
      return await api.put(`/posts/comments/${commentId}`, { content });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update comment');
    }
  },

  async deleteComment(commentId: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.delete(`/posts/comments/${commentId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete comment');
    }
  },

  async toggleCommentLike(commentId: string): Promise<{ success: boolean; message: string; isLiked: boolean; likesCount: number }> {
    try {
      return await api.post(`/posts/comments/${commentId}/like`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to toggle comment like');
    }
  },

  // Feed (personalized posts)
  async getFeed(page: number = 1, limit: number = 10): Promise<PostsResponse> {
    try {
      return await api.get<PostsResponse>(`/posts/feed?page=${page}&limit=${limit}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get feed');
    }
  },

  // Trending Posts
  async getTrendingPosts(limit: number = 10): Promise<Post[]> {
    try {
      const response = await api.get<{ posts: Post[] }>(`/posts/trending?limit=${limit}`);
      return response.posts;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get trending posts');
    }
  },

  // Search Posts
  async searchPosts(query: string, filters?: {
    type?: Post['type'];
    tags?: string[];
    dateRange?: { from: string; to: string };
  }): Promise<Post[]> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      if (filters?.type) params.append('type', filters.type);
      if (filters?.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));
      if (filters?.dateRange) {
        params.append('dateFrom', filters.dateRange.from);
        params.append('dateTo', filters.dateRange.to);
      }

      const response = await api.get<{ posts: Post[] }>(`/posts/search?${params.toString()}`);
      return response.posts;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to search posts');
    }
  },

  // Get user's posts
  async getUserPosts(userId: string, page: number = 1, limit: number = 10): Promise<PostsResponse> {
    try {
      return await api.get<PostsResponse>(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get user posts');
    }
  },

  // Report Post
  async reportPost(postId: string, reason: string, description?: string): Promise<{ success: boolean; message: string }> {
    try {
      return await api.post(`/posts/${postId}/report`, { reason, description });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to report post');
    }
  },

  // Get post tags (for suggestions)
  async getPopularTags(): Promise<string[]> {
    try {
      const response = await api.get<{ tags: string[] }>('/posts/tags/popular');
      return response.tags;
    } catch (error) {
      // Return empty array if fails
      return [];
    }
  },
};

export default postsAPI; 