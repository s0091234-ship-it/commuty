import React, { useState } from 'react';
import { Post, PostCategory, User } from '../types';
import { Search, Pin, Heart, MessageSquare, Eye, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface PostListProps {
  posts: Post[];
  currentUser: User | null;
  activeCategory: PostCategory;
  onSelectCategory: (category: PostCategory) => void;
  onSelectPost: (post: Post) => void;
  onOpenCreatePost: () => void;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  currentUser,
  activeCategory,
  onSelectCategory,
  onSelectPost,
  onOpenCreatePost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap(p => p.tags))
  );

  // Filter posts based on category, search, and tag
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    return matchesCategory && matchesSearch && matchesTag;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 32px 80px 32px' }}>
      {/* Top Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '28px',
        flexWrap: 'wrap',
      }}>
        {/* Search input with clean border */}
        <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
          <Search size={16} color="var(--color-quiet-graphite)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="노하우, 템플릿, 질문 키워드 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 16px 11px 44px',
              borderRadius: 'var(--radius-pills)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-oat)',
              fontSize: '13.5px',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'none',
                fontSize: '11px',
                color: 'var(--color-quiet-graphite)',
                cursor: 'pointer',
              }}
            >
              초기화
            </button>
          )}
        </div>

        {/* Popular Tags Quick Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="font-mono-eyebrow" style={{ color: 'var(--color-quiet-graphite)', marginRight: '4px' }}>
            HOT TAGS:
          </span>
          {allTags.slice(0, 6).map(tag => {
            const isTagActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isTagActive ? null : tag)}
                style={{
                  border: isTagActive ? '1px solid var(--color-ledger-brown)' : '1px solid var(--color-border)',
                  backgroundColor: isTagActive ? 'var(--color-ledger-brown)' : 'var(--color-paper)',
                  color: isTagActive ? 'var(--color-paper)' : 'var(--color-quiet-graphite)',
                  borderRadius: 'var(--radius-pills)',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                #{tag}
              </button>
            );
          })}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--color-copper)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              전체해제
            </button>
          )}
        </div>
      </div>

      {/* Post Grid / List */}
      {filteredPosts.length === 0 ? (
        <div className="card-oat" style={{
          padding: '60px 24px',
          textAlign: 'center',
          borderRadius: 'var(--radius-cards)',
        }}>
          <p className="font-mono-eyebrow" style={{ color: 'var(--color-quiet-graphite)', marginBottom: '8px' }}>
            NO POSTS FOUND
          </p>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '12px' }}>
            조건에 맞는 게시물이 없습니다.
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--color-quiet-graphite)', marginBottom: '24px' }}>
            새로운 지식이나 밴드 운영 팁을 가장 먼저 작성해보세요!
          </p>
          <button onClick={onOpenCreatePost} className="btn-ledger-pill">
            첫 글 작성하기
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPosts.map(post => {
            return (
              <article
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="card-paper"
                style={{
                  padding: '28px 32px',
                  cursor: 'pointer',
                  backgroundColor: post.isPinned ? '#faf7f2' : 'var(--color-paper)',
                  borderColor: post.isPinned ? '#dfd6cb' : 'var(--color-border)',
                }}
              >
                {/* Meta Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {post.isPinned && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'var(--color-ledger-brown)',
                        color: 'var(--color-paper)',
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-mono)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-pills)',
                        fontWeight: 600,
                      }}>
                        <Pin size={11} /> 상단 공지
                      </span>
                    )}

                    <span className="font-mono-eyebrow" style={{ color: 'var(--color-copper)' }}>
                      {post.categoryLabel}
                    </span>

                    <span style={{ color: 'var(--color-soft-gray)', fontSize: '12px' }}>•</span>

                    {/* Author brief */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-near-black)' }}>
                        {post.author.name}
                      </span>
                      {post.author.bandName && (
                        <span style={{ fontSize: '11.5px', color: 'var(--color-quiet-graphite)' }}>
                          ({post.author.bandName})
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {post.isReported && (
                      <span className="status-pill danger" style={{ fontSize: '10.5px' }}>
                        <ShieldAlert size={12} /> 관리자 신고 접수
                      </span>
                    )}
                    <span className="font-mono-eyebrow" style={{ color: 'var(--color-soft-gray)' }}>
                      {post.createdAt}
                    </span>
                  </div>
                </div>

                {/* Post Title */}
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  letterSpacing: '-0.4px',
                  color: 'var(--color-ink)',
                  marginBottom: '10px',
                  lineHeight: 1.35,
                }}>
                  {post.title}
                </h2>

                {/* Post Snippet */}
                <p style={{
                  fontSize: '14.5px',
                  lineHeight: 1.6,
                  color: 'var(--color-quiet-graphite)',
                  marginBottom: '18px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {post.content}
                </p>

                {/* Footer with Tags and Counters */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--color-border-subtle)',
                  paddingTop: '14px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}>
                  {/* Tags */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {post.tags.map(t => (
                      <span key={t} style={{
                        fontSize: '11.5px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-quiet-graphite)',
                        backgroundColor: 'var(--color-oat)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Counters */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: 'var(--color-quiet-graphite)', fontFamily: 'var(--font-mono)' }}>
                      <Eye size={14} />
                      {post.views}
                    </span>

                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12.5px',
                      color: currentUser && post.likedBy.includes(currentUser.id) ? 'var(--color-copper)' : 'var(--color-quiet-graphite)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: currentUser && post.likedBy.includes(currentUser.id) ? 600 : 400,
                    }}>
                      <Heart size={14} fill={currentUser && post.likedBy.includes(currentUser.id) ? 'var(--color-copper)' : 'none'} />
                      {post.likes}
                    </span>

                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: 'var(--color-quiet-graphite)', fontFamily: 'var(--font-mono)' }}>
                      <MessageSquare size={14} />
                      {post.commentsCount}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
