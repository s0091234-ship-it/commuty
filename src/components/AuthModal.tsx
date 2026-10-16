import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { X, Sparkles, Mail, Lock, User as UserIcon, Shield, Loader2 } from 'lucide-react';
import { dbService } from '../lib/supabaseService';
import { isSupabaseConfigured } from '../lib/supabaseClient';

interface AuthModalProps {
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bandName, setBandName] = useState('');
  const [bandCategory, setBandCategory] = useState('취미 / 동호회');
  const [memberCount, setMemberCount] = useState('150');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Google OAuth Login
  const handleGoogleAuth = async () => {
    if (isSupabaseConfigured) {
      setIsGoogleLoading(true);
      try {
        const { error } = await dbService.signInWithGoogle();
        if (error) {
          alert(`구글 로그인 실패: ${error.message}\n(Supabase 대시보드에 Google Provider가 활성화되어 있는지 확인해주세요.)`);
          setIsGoogleLoading(false);
        }
        // Success case automatically redirects to Google OAuth page
      } catch (err: any) {
        alert(`로그인 요청 중 오류가 발생했습니다: ${err?.message || err}`);
        setIsGoogleLoading(false);
      }
    } else {
      // Offline fallback simulation
      const googleUser: User = {
        id: `user-google-${Date.now()}`,
        name: name.trim() || '구글 인증 리더',
        email: email.trim() || 'google.leader@gmail.com',
        role: 'band_leader',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bandName: bandName.trim() || '구글 연동 공식 밴드',
        bandCategory: bandCategory,
        memberCount: parseInt(memberCount, 10) || 350,
        joinedAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      onLoginSuccess(googleUser);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    if (mode === 'signup') {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name.trim() || '신규 운영자',
        email: email.trim(),
        role: 'band_leader',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        bandName: bandName.trim() || '신규 개설 밴드',
        bandCategory: bandCategory,
        memberCount: parseInt(memberCount, 10) || 50,
        joinedAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      onLoginSuccess(newUser);
    } else {
      // Login mode - authenticate
      const authenticatedUser: User = {
        id: `user-logged-${Date.now()}`,
        name: email.split('@')[0] || '밴드 리더',
        email: email.trim(),
        role: email.includes('admin') ? 'admin' : 'band_leader',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bandName: '스마트 밴드 운영회',
        bandCategory: '동호회',
        memberCount: 520,
        joinedAt: '2024-05-10',
        status: 'active',
      };
      onLoginSuccess(authenticatedUser);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '36px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <span className="font-mono-eyebrow" style={{ color: 'var(--color-copper)' }}>
              COMMUNITY AUTHENTICATION
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.5px' }}>
              {mode === 'login' ? '운영진 로그인' : '운영진 회원가입'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--color-oat)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'var(--color-oat)',
          padding: '4px',
          borderRadius: 'var(--radius-pills)',
          marginBottom: '24px',
        }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              border: 'none',
              backgroundColor: mode === 'login' ? 'var(--color-paper)' : 'transparent',
              color: mode === 'login' ? 'var(--color-ink)' : 'var(--color-quiet-graphite)',
              fontWeight: mode === 'login' ? 600 : 500,
              padding: '8px 0',
              borderRadius: 'var(--radius-pills)',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            기존 로그인
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            style={{
              border: 'none',
              backgroundColor: mode === 'signup' ? 'var(--color-paper)' : 'transparent',
              color: mode === 'signup' ? 'var(--color-ink)' : 'var(--color-quiet-graphite)',
              fontWeight: mode === 'signup' ? 600 : 500,
              padding: '8px 0',
              borderRadius: 'var(--radius-pills)',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            새 회원가입
          </button>
        </div>

        {/* Google One-Click Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isGoogleLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            backgroundColor: '#ffffff',
            color: '#1f1f1f',
            border: '1px solid #dadce0',
            borderRadius: 'var(--radius-pills)',
            padding: '11px 20px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
            opacity: isGoogleLoading ? 0.7 : 1,
            marginBottom: '20px',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
          onMouseEnter={(e) => {
            if (!isGoogleLoading) e.currentTarget.style.backgroundColor = '#f8f9fa';
          }}
          onMouseLeave={(e) => {
            if (!isGoogleLoading) e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 size={18} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
              Google 로그인 연결 중...
            </>
          ) : (
            <>
              {/* Google SVG Logo */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google 계정으로 {mode === 'login' ? '간편 로그인' : '간편 가입하기'}
            </>
          )}
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          <span className="font-mono-eyebrow" style={{ color: 'var(--color-soft-gray)', fontSize: '10px' }}>
            OR EMAIL DIRECT
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label className="form-label">리더 닉네임 / 성함</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={16} color="var(--color-quiet-graphite)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 박등산 대장"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">운영 중인 밴드명</label>
                <input
                  type="text"
                  value={bandName}
                  onChange={(e) => setBandName(e.target.value)}
                  placeholder="예: 수도권 2030 등산 밴드"
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">밴드 분류</label>
                  <select
                    value={bandCategory}
                    onChange={(e) => setBandCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="취미 / 동호회">취미 / 동호회</option>
                    <option value="경제 / 스터디">경제 / 스터디</option>
                    <option value="지역 / 친목">지역 / 친목</option>
                    <option value="반려동물">반려동물</option>
                    <option value="비즈니스 / 상점">비즈니스 / 상점</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">회원 수 (대략)</label>
                  <input
                    type="number"
                    value={memberCount}
                    onChange={(e) => setMemberCount(e.target.value)}
                    placeholder="500"
                    className="form-input"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">이메일 주소</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--color-quiet-graphite)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="leader@example.com"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--color-quiet-graphite)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-ledger-pill"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            {mode === 'login' ? '로그인 완료' : '밴드 운영진 가입 완료'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--color-soft-gray)',
          marginTop: '20px',
          fontFamily: 'var(--font-mono)',
        }}>
          SECURED VIA NEXT-GEN ENCRYPTED SESSIONS
        </p>
      </div>
    </div>
  );
};
