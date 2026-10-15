export type UserRole = 'member' | 'band_leader' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bandName?: string;
  bandCategory?: string;
  memberCount?: number;
  joinedAt: string;
  status: 'active' | 'suspended';
}

export type PostCategory = 'all' | 'knowhow' | 'member_management' | 'template' | 'qna' | 'lounge';

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    bandName?: string;
  };
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  categoryLabel: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    bandName?: string;
  };
  tags: string[];
  isPinned: boolean;
  isReported?: boolean;
  reportReason?: string;
  likes: number;
  likedBy: string[]; // user IDs
  views: number;
  commentsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityStats {
  totalMembers: number;
  activeBands: number;
  todayPosts: number;
  pendingReports: number;
}
