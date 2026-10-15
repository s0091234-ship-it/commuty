import React from 'react';
import { User, UserRole } from '../types';
import { UserCheck, RefreshCw, Eye } from 'lucide-react';

interface RoleSwitcherProps {
  currentUser: User | null;
  onSwitchUser: (role: UserRole | 'guest') => void;
  onResetData: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentUser,
  onSwitchUser,
  onResetData,
}) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 999,
      backgroundColor: 'var(--color-espresso)',
      color: 'var(--color-paper)',
      padding: '10px 16px',
      borderRadius: 'var(--radius-pills)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: 'var(--font-sans)',
      fontSize: '12.5px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Eye size={14} color="var(--color-copper)" />
        <span className="font-mono-eyebrow" style={{ color: 'var(--color-soft-gray)', fontSize: '10px' }}>
          TEST ROLE:
        </span>
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => onSwitchUser('guest')}
          style={{
            border: 'none',
            backgroundColor: !currentUser ? 'var(--color-copper)' : 'rgba(255,255,255,0.1)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pills)',
            cursor: 'pointer',
            fontSize: '11.5px',
            fontWeight: 500,
          }}
        >
          비로그인
        </button>

        <button
          onClick={() => onSwitchUser('member')}
          style={{
            border: 'none',
            backgroundColor: currentUser?.role === 'member' ? 'var(--color-copper)' : 'rgba(255,255,255,0.1)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pills)',
            cursor: 'pointer',
            fontSize: '11.5px',
            fontWeight: 500,
          }}
        >
          일반회원
        </button>

        <button
          onClick={() => onSwitchUser('band_leader')}
          style={{
            border: 'none',
            backgroundColor: currentUser?.role === 'band_leader' ? 'var(--color-copper)' : 'rgba(255,255,255,0.1)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pills)',
            cursor: 'pointer',
            fontSize: '11.5px',
            fontWeight: 500,
          }}
        >
          밴드리더
        </button>

        <button
          onClick={() => onSwitchUser('admin')}
          style={{
            border: 'none',
            backgroundColor: currentUser?.role === 'admin' ? 'var(--color-copper)' : 'rgba(255,255,255,0.1)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pills)',
            cursor: 'pointer',
            fontSize: '11.5px',
            fontWeight: 500,
          }}
        >
          관리자
        </button>
      </div>

      <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

      <button
        onClick={onResetData}
        title="목업 데이터 초기화"
        style={{
          border: 'none',
          background: 'none',
          color: 'var(--color-soft-gray)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <RefreshCw size={12} />
        리셋
      </button>
    </div>
  );
};
