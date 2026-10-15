import React from 'react';
import { CommunityStats, User } from '../types';
import { Users, FileText, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  stats: CommunityStats;
  currentUser: User | null;
  onOpenCreatePost: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  currentUser,
  onOpenCreatePost,
  onOpenAuth,
}) => {
  return (
    <section style={{
      padding: '48px 32px 36px 32px',
      maxWidth: '1240px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Decorative Terracotta Disc subtle punctuation */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '4%',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-terracotta)',
        opacity: 0.12,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '40px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Left Headline & Pitch */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span className="font-mono-eyebrow" style={{ color: 'var(--color-copper)' }}>
              VERIFIED BAND LEADERS ONLY
            </span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-soft-gray)' }} />
            <span className="font-mono-eyebrow" style={{ color: 'var(--color-quiet-graphite)' }}>
              OCTOBER 2026 EDITION
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5.2vw, 64px)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-2px',
            color: 'var(--color-ink)',
            marginBottom: '20px',
          }}>
            밴드 운영진을 위한<br />
            실전 지식과 솔루션.
          </h1>

          <p style={{
            fontSize: '16px',
            lineHeight: '1.5',
            letterSpacing: '-0.3px',
            color: 'var(--color-quiet-graphite)',
            maxWidth: '560px',
            marginBottom: '32px',
          }}>
            1,200+ 공인 밴드 리더들이 매일 공유하는 회원 활성화 전략, 분쟁 중재 가이드, 복사해 쓰는 공지 템플릿과 노하우를 지금 바로 만나보세요.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {currentUser ? (
              <button onClick={onOpenCreatePost} className="btn-ledger-pill">
                운영 노하우 공유하기
                <ArrowUpRight size={16} />
              </button>
            ) : (
              <>
                <button onClick={() => onOpenAuth('signup')} className="btn-ledger-pill">
                  구글 계정으로 3초 참여
                  <ArrowUpRight size={16} />
                </button>
                <button onClick={() => onOpenAuth('login')} className="btn-oat-pill">
                  기존 계정 로그인
                </button>
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
              <span className="status-pill active" style={{ fontSize: '11px' }}>
                실시간 운영 중
              </span>
            </div>
          </div>
        </div>

        {/* Right Espresso Panel Showcase Card */}
        <div className="card-espresso" style={{
          padding: '36px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          {/* Top Operational Eyebrow */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <span className="font-mono-eyebrow" style={{ color: 'var(--color-soft-gray)' }}>
              NETWORK METRICS & INTEL
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-copper)',
            }}>
              <Sparkles size={13} />
              VERIFIED DATA
            </span>
          </div>

          {/* Key Stat Blocks */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            marginBottom: '28px',
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <span className="font-mono-eyebrow" style={{ color: 'var(--color-soft-gray)', display: 'block', marginBottom: '6px' }}>
                등록된 밴드 리더
              </span>
              <div style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-1px', color: '#ffffff' }}>
                {stats.totalMembers.toLocaleString()}<span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--color-soft-gray)' }}>명</span>
              </div>
              <span style={{ fontSize: '11px', color: '#52b788', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                <CheckCircle2 size={12} /> 실명 및 권한 인증 완료
              </span>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <span className="font-mono-eyebrow" style={{ color: 'var(--color-soft-gray)', display: 'block', marginBottom: '6px' }}>
                누적 연계 밴드 수
              </span>
              <div style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-1px', color: '#ffffff' }}>
                {stats.activeBands.toLocaleString()}<span style={{ fontSize: '16px', fontWeight: 400, color: 'var(--color-soft-gray)' }}>개</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-soft-gray)', display: 'block', marginTop: '4px' }}>
                취미 / 스터디 / 동호회 / 상점
              </span>
            </div>
          </div>

          {/* Quote / Testimonial Treatment */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <p className="font-serif-quote" style={{ color: '#f0ece8', fontSize: '14.5px', fontStyle: 'italic' }}>
              “운영진 3명과 8천 명 밴드를 이끌며 막막할 때마다 여기서 템플릿과 조언을 얻어 큰 위기를 넘겼습니다.”
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#ffffff' }}>박등산 대장</span>
              <span style={{ fontSize: '11px', color: 'var(--color-soft-gray)' }}>· 주말 2030 수도권 명산 등산밴드 리더</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
