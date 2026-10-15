import React, { useState } from 'react';
import { Post, Comment, User } from '../types';
import { X, Heart, MessageSquare, Pin, Trash2, Edit3, ShieldAlert, CornerDownRight, Check, Send } from 'lucide-react';

interface PostDetailModalProps {
  post: Post;
  comments: Comment[];
  currentUser: User | null;
  onClose: () => void;
  onToggleLike: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onEditPost: (post: Post) => void;
  onReportPost: (postId: string, reason: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  comments,
  currentUser,
  onClose,
  onToggleLike,
  onDeletePost,
  onEditPost,
  onReportPost,
  onAddComment,
  onDeleteComment,
  onOpenAuth,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('상업적 광고 / 스팸 의심');
  const [copiedLink, setCopiedLink] = useState(false);

  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;
  const isAuthor = currentUser ? currentUser.id === post.author.id : false;
  const isAdmin = currentUser ? currentUser.role === 'admin' : false;
  const canModify = isAuthor || isAdmin;

  const postComments = comments.filter(c => c.postId === post.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReportSubmit = () => {
    onReportPost(post.id, reportReason);
    setIsReporting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', padding: '36px 40px' }}
      >
        {/* Top Control Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="font-mono-eyebrow" style={{ color: 'var(--color-copper)' }}>
              {post.categoryLabel}
            </span>
            {post.isPinned && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'var(--color-ledger-brown)',
                color: 'var(--color-paper)',
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pills)',
              }}>
                <Pin size={10} /> 공지 고정
              </span>
            )}
            {post.isReported && (
              <span className="status-pill danger" style={{ fontSize: '10px' }}>
                신고된 게시글
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {canModify && (
              <>
                <button
                  onClick={() => onEditPost(post)}
                  className="btn-subtle"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  title="게시글 수정"
                >
                  <Edit3 size={13} />
                  수정
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
                      onDeletePost(post.id);
                      onClose();
                    }
                  }}
                  className="btn-subtle"
                  style={{ fontSize: '12px', padding: '6px 12px', color: 'var(--color-expiry-red)' }}
                  title="게시글 삭제"
                >
                  <Trash2 size={13} />
                  삭제
                </button>
              </>
            )}

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
        </div>

        {/* Post Title */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          lineHeight: 1.25,
          letterSpacing: '-0.8px',
          color: 'var(--color-ink)',
          marginBottom: '20px',
        }}>
          {post.title}
        </h1>

        {/* Author Bio Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          backgroundColor: 'var(--color-oat)',
          borderRadius: '12px',
          marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={post.author.avatar}
              alt={post.author.name}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--color-ink)' }}>
                  {post.author.name}
                </span>
                <span className={`status-pill ${post.author.role === 'admin' ? 'danger' : post.author.role === 'band_leader' ? 'active' : 'pending'}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                  {post.author.role === 'admin' ? '총괄관리자' : post.author.role === 'band_leader' ? '인증 리더' : '회원'}
                </span>
              </div>
              {post.author.bandName && (
                <div style={{ fontSize: '12px', color: 'var(--color-quiet-graphite)', marginTop: '2px' }}>
                  {post.author.bandName}
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="font-mono-eyebrow" style={{ color: 'var(--color-soft-gray)', display: 'block' }}>
              작성일시
            </span>
            <span className="font-mono-label" style={{ fontSize: '12px', color: 'var(--color-quiet-graphite)' }}>
              {post.createdAt}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <div style={{
          fontSize: '15.5px',
          lineHeight: '1.75',
          color: 'var(--color-near-black)',
          whiteSpace: 'pre-wrap',
          marginBottom: '32px',
          fontFamily: 'var(--font-sans)',
        }}>
          {post.content}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {post.tags.map(t => (
            <span key={t} style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-quiet-graphite)',
              backgroundColor: 'var(--color-oat)',
              padding: '4px 10px',
              borderRadius: '6px',
            }}>
              #{t}
            </span>
          ))}
        </div>

        {/* Actions Row (Like, Share, Report) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 0',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '36px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth('login');
                  return;
                }
                onToggleLike(post.id);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: isLiked ? '#fcf0e8' : 'var(--color-oat)',
                color: isLiked ? 'var(--color-copper)' : 'var(--color-ink)',
                border: isLiked ? '1px solid #f2cdb6' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-pills)',
                padding: '8px 18px',
                fontSize: '13.5px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Heart size={16} fill={isLiked ? 'var(--color-copper)' : 'none'} color={isLiked ? 'var(--color-copper)' : 'currentColor'} />
              추천 {post.likes}
            </button>

            <button
              onClick={handleShare}
              className="btn-oat-pill"
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              {copiedLink ? <Check size={14} color="var(--color-active-green)" /> : null}
              {copiedLink ? '링크 복사됨' : '공유하기'}
            </button>
          </div>

          <div>
            {!isReporting ? (
              <button
                onClick={() => setIsReporting(true)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-soft-gray)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldAlert size={13} />
                신고하기
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '12px',
                  }}
                >
                  <option value="상업적 광고 / 스팸 의심">상업적 광고 / 스팸 의심</option>
                  <option value="타 회원 비방 / 욕설">타 회원 비방 / 욕설</option>
                  <option value="불법 유료 리딩방 유도">불법 유료 리딩방 유도</option>
                  <option value="기타 운영 규정 위반">기타 운영 규정 위반</option>
                </select>
                <button
                  onClick={handleReportSubmit}
                  className="btn-ledger-pill"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  제출
                </button>
                <button
                  onClick={() => setIsReporting(false)}
                  className="btn-subtle"
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <MessageSquare size={18} color="var(--color-ink)" />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-ink)' }}>
              댓글 {postComments.length}개
            </h3>
          </div>

          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '28px' }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              backgroundColor: 'var(--color-oat)',
              padding: '16px',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
            }}>
              <img
                src={currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt="user avatar"
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={currentUser ? '밴드 운영진들과 의견 및 조언을 나눠보세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
                  rows={2}
                  style={{
                    width: '100%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    fontSize: '14px',
                    fontFamily: 'var(--font-sans)',
                    resize: 'none',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="submit"
                    className="btn-ledger-pill"
                    style={{ padding: '6px 16px', fontSize: '12.5px' }}
                  >
                    <Send size={13} />
                    댓글 등록
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comment List */}
          {postComments.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-soft-gray)', fontSize: '14px', padding: '24px 0' }}>
              아직 등록된 댓글이 없습니다. 첫 번째 조언을 남겨주세요!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {postComments.map(c => {
                const isCommentAuthor = currentUser ? currentUser.id === c.author.id : false;
                const canDeleteComment = isCommentAuthor || isAdmin;

                return (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '14px 18px',
                      backgroundColor: 'var(--color-paper)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                    }}
                  >
                    <img
                      src={c.author.avatar}
                      alt={c.author.name}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)' }}>
                            {c.author.name}
                          </span>
                          {c.author.bandName && (
                            <span style={{ fontSize: '11px', color: 'var(--color-quiet-graphite)' }}>
                              · {c.author.bandName}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="font-mono-eyebrow" style={{ color: 'var(--color-soft-gray)', fontSize: '10px' }}>
                            {c.createdAt}
                          </span>
                          {canDeleteComment && (
                            <button
                              onClick={() => onDeleteComment(c.id)}
                              style={{
                                border: 'none',
                                background: 'none',
                                color: 'var(--color-expiry-red)',
                                cursor: 'pointer',
                                padding: '2px',
                              }}
                              title="댓글 삭제"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p style={{ fontSize: '13.5px', color: 'var(--color-near-black)', lineHeight: 1.55 }}>
                        {c.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
