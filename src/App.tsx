import React, { useState, useEffect } from 'react';
import { Post, Comment, User, PostCategory, CommunityStats, UserRole } from './types';
import { INITIAL_POSTS, INITIAL_COMMENTS, INITIAL_USERS } from './mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PostList } from './components/PostList';
import { PostDetailModal } from './components/PostDetailModal';
import { PostEditorModal } from './components/PostEditorModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { RoleSwitcher } from './components/RoleSwitcher';
import { dbService } from './lib/supabaseService';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

const STORAGE_KEY_POSTS = 'band_leaders_posts_v1';
const STORAGE_KEY_COMMENTS = 'band_leaders_comments_v1';
const STORAGE_KEY_USERS = 'band_leaders_users_v1';
const STORAGE_KEY_AUTH = 'band_leaders_current_user_v1';

export function App() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_POSTS);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COMMENTS);
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // 박등산 대장
  });

  const [activeCategory, setActiveCategory] = useState<PostCategory>('all');
  const [isAdminView, setIsAdminView] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSupabaseLive, setIsSupabaseLive] = useState(isSupabaseConfigured);

  // Initial Data Fetch & Supabase Auth Session Sync
  useEffect(() => {
    if (isSupabaseConfigured) {
      dbService.getPosts().then(remotePosts => {
        if (remotePosts && remotePosts.length > 0) {
          setPosts(remotePosts);
          setIsSupabaseLive(true);
        }
      });
      dbService.getComments().then(remoteComments => {
        if (remoteComments && remoteComments.length > 0) {
          setComments(remoteComments);
        }
      });
      dbService.getUsers().then(remoteUsers => {
        if (remoteUsers && remoteUsers.length > 0) {
          setUsers(remoteUsers);
        }
      });

      // Google OAuth Session Check & Listener
      if (supabase) {
        // 1. Initial Session Check
        supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (session?.user) {
            const syncedUser = await dbService.syncUserProfile(session.user);
            if (syncedUser) {
              setCurrentUser(syncedUser);
            }
          }
        });

        // 2. Auth State Change (e.g. redirect callback after Google Login)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const syncedUser = await dbService.syncUserProfile(session.user);
            if (syncedUser) {
              setCurrentUser(syncedUser);
              dbService.getUsers().then(remoteUsers => {
                if (remoteUsers) setUsers(remoteUsers);
              });
            }
          } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
            setIsAdminView(false);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    }
  }, []);

  // Sync to LocalStorage as fallback
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, [currentUser]);

  // Derived Stats
  const stats: CommunityStats = {
    totalMembers: users.length * 312,
    activeBands: 890,
    todayPosts: posts.length,
    pendingReports: posts.filter(p => p.isReported).length,
  };

  // Handlers for Post CRUD
  const handleCreatePost = async (postData: Partial<Post>) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    // Try Supabase first
    if (isSupabaseConfigured) {
      const created = await dbService.createPost(postData, currentUser);
      if (created) {
        setPosts([created, ...posts]);
        return;
      }
    }

    // LocalStorage fallback
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: postData.title || '',
      content: postData.content || '',
      category: postData.category || 'knowhow',
      categoryLabel: postData.categoryLabel || '운영 노하우',
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.role,
        bandName: currentUser.bandName,
      },
      tags: postData.tags || [],
      isPinned: postData.isPinned || false,
      likes: 1,
      likedBy: [currentUser.id],
      views: 1,
      commentsCount: 0,
      createdAt: '방금 전',
    };

    setPosts([newPost, ...posts]);
  };

  const handleUpdatePost = async (postData: Partial<Post>) => {
    if (!editingPost) return;

    if (isSupabaseConfigured) {
      await dbService.updatePost(editingPost.id, postData);
    }

    setPosts(posts.map(p => {
      if (p.id === editingPost.id) {
        return {
          ...p,
          ...postData,
          updatedAt: '방금 전',
        };
      }
      return p;
    }));

    if (selectedPost && selectedPost.id === editingPost.id) {
      setSelectedPost({
        ...selectedPost,
        ...postData,
      });
    }

    setEditingPost(null);
  };

  const handleDeletePost = async (postId: string) => {
    if (isSupabaseConfigured) {
      await dbService.deletePost(postId);
    }

    setPosts(posts.filter(p => p.id !== postId));
    setComments(comments.filter(c => c.postId !== postId));
    if (selectedPost?.id === postId) {
      setSelectedPost(null);
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    const alreadyLiked = targetPost.likedBy.includes(currentUser.id);
    const updatedLikedBy = alreadyLiked
      ? targetPost.likedBy.filter(id => id !== currentUser.id)
      : [...targetPost.likedBy, currentUser.id];

    if (isSupabaseConfigured) {
      await dbService.updatePost(postId, {
        likes: updatedLikedBy.length,
        likedBy: updatedLikedBy,
      });
    }

    setPosts(posts.map(p => {
      if (p.id === postId) {
        const updatedPost = {
          ...p,
          likes: updatedLikedBy.length,
          likedBy: updatedLikedBy,
        };
        if (selectedPost?.id === postId) setSelectedPost(updatedPost);
        return updatedPost;
      }
      return p;
    }));
  };

  const handleReportPost = async (postId: string, reason: string) => {
    if (isSupabaseConfigured) {
      await dbService.updatePost(postId, {
        isReported: true,
        reportReason: reason,
      });
    }

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isReported: true,
          reportReason: reason,
        };
      }
      return p;
    }));

    if (selectedPost?.id === postId) {
      setSelectedPost({
        ...selectedPost,
        isReported: true,
        reportReason: reason,
      });
    }

    alert('신고가 정상적으로 접수되었습니다. 관리자 센터로 전달되었습니다.');
  };

  const handleTogglePinPost = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (isSupabaseConfigured) {
      await dbService.updatePost(postId, { isPinned: !post.isPinned });
    }

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, isPinned: !p.isPinned };
      }
      return p;
    }));
  };

  const handleDismissReport = async (postId: string) => {
    if (isSupabaseConfigured) {
      await dbService.updatePost(postId, { isReported: false, reportReason: '' });
    }

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, isReported: false, reportReason: undefined };
      }
      return p;
    }));
  };

  // Handlers for Comments CRUD
  const handleAddComment = async (postId: string, content: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    if (isSupabaseConfigured) {
      const created = await dbService.addComment(postId, content, currentUser);
      if (created) {
        setComments([...comments, created]);
        setPosts(posts.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
        if (selectedPost?.id === postId) {
          setSelectedPost({ ...selectedPost, commentsCount: selectedPost.commentsCount + 1 });
        }
        return;
      }
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.role,
        bandName: currentUser.bandName,
      },
      content,
      createdAt: '방금 전',
    };

    setComments([...comments, newComment]);

    setPosts(posts.map(p => {
      if (p.id === postId) {
        const updated = { ...p, commentsCount: p.commentsCount + 1 };
        if (selectedPost?.id === postId) setSelectedPost(updated);
        return updated;
      }
      return p;
    }));
  };

  const handleDeleteComment = async (commentId: string) => {
    const commentToDelete = comments.find(c => c.id === commentId);
    if (!commentToDelete) return;

    if (isSupabaseConfigured) {
      await dbService.deleteComment(commentId);
    }

    setComments(comments.filter(c => c.id !== commentId));

    setPosts(posts.map(p => {
      if (p.id === commentToDelete.postId) {
        const updated = { ...p, commentsCount: Math.max(0, p.commentsCount - 1) };
        if (selectedPost?.id === p.id) setSelectedPost(updated);
        return updated;
      }
      return p;
    }));
  };

  // Admin User Handlers
  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    if (isSupabaseConfigured) {
      await dbService.updateUserRole(userId, newRole);
    }
    setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, role: newRole });
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';

    if (isSupabaseConfigured) {
      await dbService.toggleUserStatus(userId, nextStatus);
    }

    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Role Switcher for local testing
  const handleSwitchUserRole = (role: UserRole | 'guest') => {
    if (role === 'guest') {
      setCurrentUser(null);
      setIsAdminView(false);
      return;
    }
    const matched = users.find(u => u.role === role) || users[0];
    setCurrentUser(matched);
  };

  const handleResetData = () => {
    if (window.confirm('모든 로컬 데이터를 초기 상태로 리셋하시겠습니까?')) {
      localStorage.removeItem(STORAGE_KEY_POSTS);
      localStorage.removeItem(STORAGE_KEY_COMMENTS);
      localStorage.removeItem(STORAGE_KEY_USERS);
      localStorage.removeItem(STORAGE_KEY_AUTH);
      setPosts(INITIAL_POSTS);
      setComments(INITIAL_COMMENTS);
      setUsers(INITIAL_USERS);
      setCurrentUser(INITIAL_USERS[1]);
      setIsAdminView(false);
      setSelectedPost(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-paper)' }}>
      {/* Top Database Status Indicator Bar */}
      <div style={{
        backgroundColor: isSupabaseLive ? '#1e681d' : 'var(--color-espresso)',
        color: '#ffffff',
        padding: '5px 24px',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isSupabaseLive ? '#52b788' : '#e07122',
            display: 'inline-block',
          }} />
          <span>
            {isSupabaseLive 
              ? 'DATABASE: SUPABASE CLOUD POSTGRESQL CONNECTED' 
              : 'DATABASE: LOCAL MEMORY/STORAGE MODE (.env.local에 Supabase 키를 입력하면 즉시 클라우드 DB 연동)'}
          </span>
        </div>
        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          schema.sql 파일 준비됨
        </span>
      </div>

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => { setActiveCategory(cat); setIsAdminView(false); }}
        isAdminView={isAdminView}
        onToggleAdminView={(admin) => setIsAdminView(admin)}
        onOpenAuth={(mode) => { setAuthMode(mode); setIsAuthOpen(true); }}
        onLogout={async () => {
          if (isSupabaseConfigured) {
            await dbService.signOut();
          }
          setCurrentUser(null);
          setIsAdminView(false);
        }}
        onOpenCreatePost={() => { setEditingPost(null); setIsEditorOpen(true); }}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {isAdminView && currentUser?.role === 'admin' ? (
          <AdminDashboard
            stats={stats}
            users={users}
            posts={posts}
            currentUser={currentUser}
            onUpdateUserRole={handleUpdateUserRole}
            onToggleUserStatus={handleToggleUserStatus}
            onDeletePost={handleDeletePost}
            onTogglePinPost={handleTogglePinPost}
            onDismissReport={handleDismissReport}
          />
        ) : (
          <>
            <HeroSection
              stats={stats}
              currentUser={currentUser}
              onOpenCreatePost={() => { setEditingPost(null); setIsEditorOpen(true); }}
              onOpenAuth={(mode) => { setAuthMode(mode); setIsAuthOpen(true); }}
            />

            <PostList
              posts={posts}
              currentUser={currentUser}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onSelectPost={(post) => {
                setPosts(posts.map(p => p.id === post.id ? { ...p, views: p.views + 1 } : p));
                setSelectedPost({ ...post, views: post.views + 1 });
              }}
              onOpenCreatePost={() => { setEditingPost(null); setIsEditorOpen(true); }}
            />
          </>
        )}
      </main>

      {/* Editorial Footer */}
      <footer style={{
        backgroundColor: 'var(--color-oat)',
        borderTop: '1px solid var(--color-border)',
        padding: '56px 32px 40px 32px',
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          <div>
            <span className="font-mono-eyebrow" style={{ color: 'var(--color-copper)' }}>
              COMMUNITY FOR DIRECTORS
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '8px 0 12px 0', color: 'var(--color-ink)' }}>
              BAND LEADERS.
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-quiet-graphite)', lineHeight: 1.6 }}>
              네이버 밴드 및 온라인 동호회 리더들을 위한 실전 지식 공유, 분쟁 중재 서식 템플릿, 제휴 프로모션 네트워킹 플랫폼입니다.
            </p>
          </div>

          <div>
            <span className="font-mono-eyebrow" style={{ color: 'var(--color-quiet-graphite)', display: 'block', marginBottom: '12px' }}>
              카테고리 바로가기
            </span>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <li><a href="#knowhow" onClick={(e) => { e.preventDefault(); setActiveCategory('knowhow'); }} className="copper-link">운영 노하우 & 리더십</a></li>
              <li><a href="#member" onClick={(e) => { e.preventDefault(); setActiveCategory('member_management'); }} className="copper-link">멤버 관리 & 규칙 제정</a></li>
              <li><a href="#template" onClick={(e) => { e.preventDefault(); setActiveCategory('template'); }} className="copper-link">복붙 공지 템플릿</a></li>
              <li><a href="#qna" onClick={(e) => { e.preventDefault(); setActiveCategory('qna'); }} className="copper-link">실시간 Q&A 고민 상담</a></li>
            </ul>
          </div>

          <div>
            <span className="font-mono-eyebrow" style={{ color: 'var(--color-quiet-graphite)', display: 'block', marginBottom: '12px' }}>
              데이터베이스 연동 상태
            </span>
            <div style={{ fontSize: '12.5px', color: 'var(--color-quiet-graphite)', lineHeight: 1.6 }}>
              <div>• <strong>상태:</strong> {isSupabaseLive ? '🟢 Supabase PostgreSQL 연결됨' : '🟠 로컬 스토리지 모드'}</div>
              <div>• <strong>스키마:</strong> schema.sql (Profiles, Posts, Comments)</div>
              <div>• <strong>배포 준비:</strong> Vercel + Supabase 100% 호환 구조</div>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          borderTop: '1px solid var(--color-border)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <span className="font-mono-eyebrow" style={{ color: 'var(--color-soft-gray)' }}>
            © 2026 BAND LEADERS COMMUNITY. ALL RIGHTS RESERVED.
          </span>
          <span className="font-mono-eyebrow" style={{ color: 'var(--color-copper)' }}>
            DESIGNED WITH CASHMERE COUNTER, DARK LEDGER AESTHETICS
          </span>
        </div>
      </footer>

      {/* Modals */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          comments={comments}
          currentUser={currentUser}
          onClose={() => setSelectedPost(null)}
          onToggleLike={handleToggleLike}
          onDeletePost={handleDeletePost}
          onEditPost={(p) => {
            setEditingPost(p);
            setSelectedPost(null);
            setIsEditorOpen(true);
          }}
          onReportPost={handleReportPost}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onOpenAuth={(mode) => { setAuthMode(mode); setIsAuthOpen(true); }}
        />
      )}

      {isEditorOpen && (
        <PostEditorModal
          initialPost={editingPost}
          currentUser={currentUser || INITIAL_USERS[1]}
          onClose={() => { setIsEditorOpen(false); setEditingPost(null); }}
          onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            if (!users.some(u => u.email === user.email)) {
              setUsers([...users, user]);
            }
          }}
        />
      )}

      {/* Floating Role Switcher for Test Review */}
      <RoleSwitcher
        currentUser={currentUser}
        onSwitchUser={handleSwitchUserRole}
        onResetData={handleResetData}
      />
    </div>
  );
}

export default App;
