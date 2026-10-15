import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Post, Comment, User, UserRole } from '../types';

export const dbService = {
  // 1. Posts Fetch
  async getPosts(): Promise<Post[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts from Supabase:', error);
      return null;
    }

    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      category: row.category,
      categoryLabel: row.category_label,
      author: {
        id: row.author_id,
        name: row.author_name,
        avatar: row.author_avatar || '',
        role: row.author_role || 'band_leader',
        bandName: row.author_band_name,
      },
      tags: row.tags || [],
      isPinned: Boolean(row.is_pinned),
      isReported: Boolean(row.is_reported),
      reportReason: row.report_reason,
      likes: row.likes || 0,
      likedBy: row.liked_by || [],
      views: row.views || 0,
      commentsCount: row.comments_count || 0,
      createdAt: new Date(row.created_at).toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
  },

  // 2. Post Create
  async createPost(post: Partial<Post>, currentUser: User): Promise<Post | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    const payload = {
      title: post.title,
      content: post.content,
      category: post.category,
      category_label: post.categoryLabel,
      author_id: currentUser.id.includes('-') && currentUser.id.length === 36 ? currentUser.id : null,
      author_name: currentUser.name,
      author_avatar: currentUser.avatar,
      author_role: currentUser.role,
      author_band_name: currentUser.bandName,
      tags: post.tags,
      is_pinned: post.isPinned || false,
      likes: 1,
      liked_by: [currentUser.id],
      views: 1,
      comments_count: 0,
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error inserting post to Supabase:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      categoryLabel: data.category_label,
      author: {
        id: currentUser.id,
        name: data.author_name,
        avatar: data.author_avatar,
        role: data.author_role,
        bandName: data.author_band_name,
      },
      tags: data.tags,
      isPinned: data.is_pinned,
      likes: data.likes,
      likedBy: data.liked_by,
      views: data.views,
      commentsCount: 0,
      createdAt: '방금 전',
    };
  },

  // 3. Post Update
  async updatePost(postId: string, postData: Partial<Post>): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (postData.title !== undefined) updatePayload.title = postData.title;
    if (postData.content !== undefined) updatePayload.content = postData.content;
    if (postData.category !== undefined) updatePayload.category = postData.category;
    if (postData.categoryLabel !== undefined) updatePayload.category_label = postData.categoryLabel;
    if (postData.tags !== undefined) updatePayload.tags = postData.tags;
    if (postData.isPinned !== undefined) updatePayload.is_pinned = postData.isPinned;
    if (postData.isReported !== undefined) updatePayload.is_reported = postData.isReported;
    if (postData.reportReason !== undefined) updatePayload.report_reason = postData.reportReason;
    if (postData.likes !== undefined) updatePayload.likes = postData.likes;
    if (postData.likedBy !== undefined) updatePayload.liked_by = postData.likedBy;
    if (postData.views !== undefined) updatePayload.views = postData.views;

    const { error } = await supabase
      .from('posts')
      .update(updatePayload)
      .eq('id', postId);

    return !error;
  },

  // 4. Post Delete
  async deletePost(postId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    return !error;
  },

  // 5. Comments Fetch
  async getComments(postId?: string): Promise<Comment[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    let query = supabase.from('comments').select('*').order('created_at', { ascending: true });
    if (postId) query = query.eq('post_id', postId);

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching comments from Supabase:', error);
      return null;
    }

    return (data || []).map(row => ({
      id: row.id,
      postId: row.post_id,
      author: {
        id: row.author_id,
        name: row.author_name,
        avatar: row.author_avatar || '',
        role: row.author_role || 'band_leader',
        bandName: row.author_band_name,
      },
      content: row.content,
      createdAt: new Date(row.created_at).toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
  },

  // 6. Comment Create
  async addComment(postId: string, content: string, currentUser: User): Promise<Comment | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    const payload = {
      post_id: postId,
      author_id: currentUser.id.includes('-') && currentUser.id.length === 36 ? currentUser.id : null,
      author_name: currentUser.name,
      author_avatar: currentUser.avatar,
      author_role: currentUser.role,
      author_band_name: currentUser.bandName,
      content,
    };

    const { data, error } = await supabase
      .from('comments')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error adding comment to Supabase:', error);
      return null;
    }

    // Increment comments_count in post
    try {
      await (supabase.rpc('increment_comments', { post_id: postId }) as any);
    } catch {
      // ignore if rpc not defined
    }

    return {
      id: data.id,
      postId: data.post_id,
      author: {
        id: currentUser.id,
        name: data.author_name,
        avatar: data.author_avatar,
        role: data.author_role,
        bandName: data.author_band_name,
      },
      content: data.content,
      createdAt: '방금 전',
    };
  },

  // 7. Comment Delete
  async deleteComment(commentId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    return !error;
  },

  // 8. Profiles (Users) Fetch
  async getUsers(): Promise<User[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles from Supabase:', error);
      return null;
    }

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role as UserRole,
      avatar: row.avatar_url,
      bandName: row.band_name,
      bandCategory: row.band_category,
      memberCount: row.member_count,
      joinedAt: new Date(row.created_at).toISOString().split('T')[0],
      status: row.status as 'active' | 'suspended',
    }));
  },

  // 9. Update User Role
  async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    return !error;
  },

  // 10. Toggle User Status
  async toggleUserStatus(userId: string, nextStatus: 'active' | 'suspended'): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;

    const { error } = await supabase
      .from('profiles')
      .update({ status: nextStatus })
      .eq('id', userId);

    return !error;
  },
};
