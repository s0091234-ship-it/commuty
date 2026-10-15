import React from 'react';
import { User, PostCategory } from '../types';
import { ShieldCheck, PlusCircle, LogIn, LogOut, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeCategory: PostCategory;
  onSelectCategory: (category: PostCategory) => void;
  isAdminView: boolean;
  onToggleAdminView: (isAdmin: boolean) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenCreatePost: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeCategory,
  onSelectCategory,
  isAdminView,
  onToggleAdminView,
  onOpenAuth,
  onLogout,
  onOpenCreatePost,
}) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--color-paper)',
      borderBottom: '1px solid var(--color-border)',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      justifyContent: 'space-between',
    }}>
      {/* Brand & Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div 
          onClick={() => { onToggleAdminView(false); onSelectCategory('all'); }}
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
        >
          <span className="font-mono-eyebrow" style={{ color: 'var(--color-copper)', letterSpacing: '0.12em' }}>
            BAND DIRECTORS NETWORK
          </span>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            fontSize: '20px',
            letterSpacing: '-0.8px',
            color: 'var(--color-ink)',
            lineHeight: 1.1,
          }}>
            BAND LEADERS<span style={{ color: 'var(--color-copper)' }}>.</span>
          </span>
        </div>

        {/* Navigation Categories */}
        {!isAdminView && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[
              { id: 'all', label: '전체 피드' },
              { id: 'knowhow', label: '운영 노하우' },
              { id: 'member_management', label: '멤버 관리' },
              { id: 'template', label: '공지 템플릿' },
              { id: 'qna', label: 'Q&A 질문' },
              { id: 'lounge', label: '자유 토론' },
            ].map(tab => {
              const isSelected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectCategory(tab.id as PostCategory)}
                  style={{
                    border: 'none',
                    background: isSelected ? 'var(--color-oat)' : 'transparent',
                    color: isSelected ? 'var(--color-ink)' : 'var(--color-quiet-graphite)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13.5px',
                    fontWeight: isSelected ? 600 : 500,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-pills)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Admin Center Button (Available if user is admin) */}
        {currentUser && currentUser.role === 'admin' && (
          <button
            onClick={() => onToggleAdminView(!isAdminView)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isAdminView ? 'var(--color-espresso)' : 'var(--color-oat)',
              color: isAdminView ? 'var(--color-paper)' : 'var(--color-near-black)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-pills)',
              padding: '8px 14px',
              fontSize: '12.5px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <ShieldCheck size={14} color={isAdminView ? 'var(--color-copper)' : 'var(--color-ink)'} />
            {isAdminView ? '커뮤니티 뷰로 복귀' : '관리자 센터'}
          </button>
        )}

        {currentUser ? (
          <>
            {/* New Post Button */}
            <button
              onClick={onOpenCreatePost}
              className="btn-ledger-pill"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              <PlusCircle size={15} />
              글쓰기
            </button>

            {/* User Profile Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 12px 4px 6px',
              borderRadius: 'var(--radius-pills)',
              backgroundColor: 'var(--color-oat)',
              border: '1px solid var(--color-border)',
            }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>
                    {currentUser.name}
                  </span>
                  <span className={`status-pill ${currentUser.role === 'admin' ? 'danger' : currentUser.role === 'band_leader' ? 'active' : 'pending'}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                    {currentUser.role === 'admin' ? '총괄관리자' : currentUser.role === 'band_leader' ? '밴드리더' : '회원'}
                  </span>
                </div>
                {currentUser.bandName && (
                  <span style={{ fontSize: '11px', color: 'var(--color-quiet-graphite)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.bandName}
                  </span>
                )}
              </div>

              <button
                onClick={onLogout}
                title="로그아웃"
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-quiet-graphite)',
                  padding: '4px',
                  marginLeft: '4px',
                  display: 'flex',
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => onOpenAuth('login')}
              className="btn-subtle"
            >
              <LogIn size={15} />
              로그인
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="btn-ledger-pill"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              <Sparkles size={14} />
              운영진 가입하기
            </button>
          </>
        )}
      </div>
    </header>
  );
};
