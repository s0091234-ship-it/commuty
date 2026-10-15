import React, { useState } from 'react';
import { User, Post, CommunityStats, UserRole } from '../types';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Trash2, 
  Pin, 
  UserX, 
  UserCheck, 
  Database,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  stats: CommunityStats;
  users: User[];
  posts: Post[];
  currentUser: User;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onToggleUserStatus: (userId: string) => void;
  onDeletePost: (postId: string) => void;
  onTogglePinPost: (postId: string) => void;
  onDismissReport: (postId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  users,
  posts,
  currentUser,
  onUpdateUserRole,
  onToggleUserStatus,
  onDeletePost,
  onTogglePinPost,
  onDismissReport,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'reports' | 'posts' | 'database'>('users');

  const reportedPosts = posts.filter(p => p.isReported);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 32px 80px 32px' }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px',
        backgroundColor: 'var(--color-espresso)',
        color: 'var(--color-paper)',
        borderRadius: 'var(--radius-cards)',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="font-mono-eyebrow" style={{ color: 'var(--color-copper)' }}>
              SUPER ADMIN CONSOLE
            </span>
            <span style={{ fontSize: '11px', color: '#52b788', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● LIVE SESSION
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-0.5px' }}>
            커뮤니티 총괄 관리자 제어 센터
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--color-soft-gray)', marginTop: '4px' }}>
            운영진 권한 인증, 분쟁 신고 처리, 상단 고정 공지 관리 및 데이터베이스 연결 상태를 모니터링합니다.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pills)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-paper)',
          }}>
            ADMIN: {currentUser.name}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '36px',
      }}>
        <div className="card-paper" style={{ padding: '20px 24px' }}>
          <span className="font-mono-eyebrow" style={{ color: 'var(--color-quiet-graphite)', display: 'block', marginBottom: '8px' }}>
            전체 등록 회원
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--color-ink)' }}>
            {users.length}명
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-active-green)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <CheckCircle size={12} /> {users.filter(u => u.status === 'active').length}명 활동 정상
          </span>
        </div>

        <div className="card-paper" style={{ padding: '20px 24px' }}>
          <span className="font-mono-eyebrow" style={{ color: 'var(--color-quiet-graphite)', display: 'block', marginBottom: '8px' }}>
            인증 밴드 리더
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--color-ink)' }}>
            {users.filter(u => u.role === 'band_leader').length}명
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-quiet-graphite)', marginTop: '4px', display: 'block' }}>
            전체 회원의 {Math.round((users.filter(u => u.role === 'band_leader').length / users.length) * 100)}%
          </span>
        </div>

        <div className="card-paper" style={{ padding: '20px 24px' }}>
          <span className="font-mono-eyebrow" style={{ color: 'var(--color-quiet-graphite)', display: 'block', marginBottom: '8px' }}>
            누적 등록 게시글
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', color: 'var(--color-ink)' }}>
            {posts.length}건
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-copper)', marginTop: '4px', display: 'block' }}>
            {posts.filter(p => p.isPinned).length}건 상단 고정 중
          </span>
        </div>

        <div className="card-paper" style={{ padding: '20px 24px', borderColor: reportedPosts.length > 0 ? '#f0b2a8' : 'var(--color-border)' }}>
          <span className="font-mono-eyebrow" style={{ color: reportedPosts.length > 0 ? 'var(--color-expiry-red)' : 'var(--color-quiet-graphite)', display: 'block', marginBottom: '8px' }}>
            처리 대기 신고
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-1px', color: reportedPosts.length > 0 ? 'var(--color-expiry-red)' : 'var(--color-ink)' }}>
            {reportedPosts.length}건
          </div>
          <span style={{ fontSize: '12px', color: reportedPosts.length > 0 ? 'var(--color-expiry-red)' : 'var(--color-quiet-graphite)', marginTop: '4px', display: 'block' }}>
            {reportedPosts.length > 0 ? '즉시 검토 필요' : '모든 신고 해결됨'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '28px',
      }}>
        {[
          { id: 'users', label: `회원 및 권한 관리 (${users.length})` },
          { id: 'reports', label: `신고 접수함 (${reportedPosts.length})` },
          { id: 'posts', label: `전체 글 및 공지 고정 (${posts.length})` },
          { id: 'database', label: `DB 및 Supabase 연결 준비` },
        ].map(tab => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                border: 'none',
                background: 'none',
                padding: '12px 18px',
                fontSize: '14px',
                fontWeight: isSelected ? 600 : 500,
                color: isSelected ? 'var(--color-ink)' : 'var(--color-quiet-graphite)',
                borderBottom: isSelected ? '2px solid var(--color-ink)' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: User Management */}
      {activeTab === 'users' && (
        <div className="card-paper" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>회원 명단 및 역할(Role) 배정</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--color-quiet-graphite)', marginTop: '2px' }}>
                일반회원, 인증 밴드리더, 총괄 관리자 간 권한 변경 및 이용 제재를 실시간 적용합니다.
              </p>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-oat)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '14px 24px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-quiet-graphite)' }}>회원 정보</th>
                <th style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-quiet-graphite)' }}>소속 밴드</th>
                <th style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-quiet-graphite)' }}>현재 역할</th>
                <th style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-quiet-graphite)' }}>상태</th>
                <th style={{ padding: '14px 24px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-quiet-graphite)', textAlign: 'right' }}>관리 액션</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={u.avatar} alt={u.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{u.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-quiet-graphite)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    <div style={{ fontWeight: 500 }}>{u.bandName || '미등록'}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-quiet-graphite)' }}>
                      {u.bandCategory || '-'} {u.memberCount ? `· ${u.memberCount.toLocaleString()}명` : ''}
                    </div>
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    <select
                      value={u.role}
                      onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-pills)',
                        fontSize: '12px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-oat)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      <option value="member">일반 회원</option>
                      <option value="band_leader">인증 밴드리더</option>
                      <option value="admin">총괄 관리자</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px 18px' }}>
                    <span className={`status-pill ${u.status === 'active' ? 'active' : 'danger'}`}>
                      {u.status === 'active' ? '정상 활동' : '이용 정지'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      onClick={() => onToggleUserStatus(u.id)}
                      className="btn-subtle"
                      style={{
                        fontSize: '12px',
                        padding: '6px 12px',
                        color: u.status === 'active' ? 'var(--color-expiry-red)' : 'var(--color-active-green)',
                      }}
                    >
                      {u.status === 'active' ? (
                        <>
                          <UserX size={13} />
                          계정 정지
                        </>
                      ) : (
                        <>
                          <UserCheck size={13} />
                          정지 해제
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: Reports */}
      {activeTab === 'reports' && (
        <div className="card-paper" style={{ padding: '24px 28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>신고 접수된 게시물 목록</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-quiet-graphite)', marginBottom: '24px' }}>
            커뮤니티 회원들이 제보한 스팸, 욕설, 불법 리딩방 유도 게시글을 검토하고 즉각 제재합니다.
          </p>

          {reportedPosts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--color-oat)', borderRadius: '12px' }}>
              <CheckCircle size={32} color="var(--color-active-green)" style={{ margin: '0 auto 12px auto' }} />
              <p style={{ fontSize: '14.5px', fontWeight: 600 }}>현재 대기 중인 신고 건이 없습니다.</p>
              <p style={{ fontSize: '12.5px', color: 'var(--color-quiet-graphite)', marginTop: '4px' }}>모든 신고가 원만하게 해결되었습니다.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reportedPosts.map(p => (
                <div key={p.id} style={{
                  padding: '20px 24px',
                  border: '1px solid #f0c3bc',
                  borderRadius: '12px',
                  backgroundColor: '#fffcfb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}>
                  <div style={{ maxWidth: '650px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="status-pill danger" style={{ fontSize: '10.5px' }}>
                        신고 사유: {p.reportReason || '규정 위반'}
                      </span>
                      <span className="font-mono-eyebrow" style={{ color: 'var(--color-quiet-graphite)' }}>
                        작성자: {p.author.name}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '4px' }}>
                      {p.title}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--color-quiet-graphite)' }}>
                      {p.content.slice(0, 100)}...
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => onDismissReport(p.id)}
                      className="btn-oat-pill"
                      style={{ fontSize: '12.5px', padding: '6px 14px' }}
                    >
                      오인 신고 (해제)
                    </button>
                    <button
                      onClick={() => onDeletePost(p.id)}
                      className="btn-ledger-pill"
                      style={{ backgroundColor: 'var(--color-expiry-red)', fontSize: '12.5px', padding: '6px 14px' }}
                    >
                      <Trash2 size={13} />
                      게시글 강제 삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Posts & Pin Management */}
      {activeTab === 'posts' && (
        <div className="card-paper" style={{ padding: '24px 28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>전체 게시글 관리 및 공지 핀(PIN) 고정</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-quiet-graphite)', marginBottom: '20px' }}>
            공지사항으로 지정할 글을 핀으로 고정하거나, 부적절한 글을 정리합니다.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {posts.map(p => (
              <div key={p.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                backgroundColor: p.isPinned ? 'var(--color-oat)' : 'var(--color-paper)',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {p.isPinned && (
                      <span className="font-mono-eyebrow" style={{ color: 'var(--color-copper)' }}>
                        [PINNED]
                      </span>
                    )}
                    <span style={{ fontWeight: 600, fontSize: '14.5px' }}>{p.title}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-quiet-graphite)', marginTop: '4px' }}>
                    카테고리: {p.categoryLabel} · 작성자: {p.author.name} · 조회: {p.views} · 추천: {p.likes}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => onTogglePinPost(p.id)}
                    className="btn-oat-pill"
                    style={{
                      fontSize: '12px',
                      padding: '6px 12px',
                      backgroundColor: p.isPinned ? 'var(--color-ledger-brown)' : 'var(--color-oat)',
                      color: p.isPinned ? '#ffffff' : 'var(--color-ink)',
                    }}
                  >
                    <Pin size={12} />
                    {p.isPinned ? '고정 해제' : '상단 고정'}
                  </button>

                  <button
                    onClick={() => onDeletePost(p.id)}
                    className="btn-subtle"
                    style={{ fontSize: '12px', padding: '6px 12px', color: 'var(--color-expiry-red)' }}
                  >
                    <Trash2 size={13} />
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Database & Deployment Prep */}
      {activeTab === 'database' && (
        <div className="card-paper" style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Database size={24} color="var(--color-copper)" />
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>로컬 DB 테스트 & Supabase 마이그레이션 안내</h3>
          </div>

          <p style={{ fontSize: '14.5px', color: 'var(--color-near-black)', lineHeight: 1.6, marginBottom: '24px' }}>
            현재는 <strong>1단계(프런트엔드 화면 구현 및 사용자 검증)</strong> 단계로, 브라우저 로컬 저장소 및 메모리 스테이트를 활용하여 실시간 CRUD와 관리자 모드가 완벽히 동작하도록 구축되어 있습니다.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '28px',
          }}>
            <div style={{ backgroundColor: 'var(--color-oat)', padding: '20px', borderRadius: '12px' }}>
              <span className="font-mono-eyebrow" style={{ color: 'var(--color-copper)' }}>STEP 2: LOCAL DATABASE</span>
              <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '8px 0' }}>로컬 데이터베이스 연동</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-quiet-graphite)', lineHeight: 1.5 }}>
                SQLite 또는 로컬 Node.js/PostgreSQL 백엔드를 붙여 실제 브라우저 새로고침 및 다중 세션에서도 데이터가 영구 보존되는 백엔드 API 연동을 구축합니다.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-oat)', padding: '20px', borderRadius: '12px' }}>
              <span className="font-mono-eyebrow" style={{ color: 'var(--color-active-green)' }}>STEP 3: CLOUD DEPLOYMENT</span>
              <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '8px 0' }}>Vercel & Supabase 클라우드 이사</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-quiet-graphite)', lineHeight: 1.5 }}>
                Supabase의 PostgreSQL DB, Google OAuth 연동, Row Level Security(RLS) 정책을 적용하고, 프런트엔드를 Vercel에 단일 클릭 배포합니다.
              </p>
            </div>
          </div>

          <div style={{
            padding: '16px 20px',
            backgroundColor: 'var(--color-espresso)',
            color: 'var(--color-paper)',
            borderRadius: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>READY FOR BACKEND HOOKUP: POSTS, USERS, COMMENTS SCHEMAS READY</span>
            <span style={{ color: 'var(--color-copper)' }}>v1.0-FRONTEND-READY</span>
          </div>
        </div>
      )}
    </div>
  );
};
