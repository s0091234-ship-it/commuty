import React, { useState, useEffect } from 'react';
import { Post, PostCategory, User } from '../types';
import { X, Check, FileText, Sparkles, Pin } from 'lucide-react';

interface PostEditorModalProps {
  initialPost?: Post | null;
  currentUser: User;
  onClose: () => void;
  onSubmit: (postData: Partial<Post>) => void;
}

const TEMPLATE_PRESETS = [
  {
    name: '신규 회원 온보딩 3단계 공지',
    content: `[밴드 신규 가족을 위한 이용 안내]

반갑습니다! 저희 밴드에 오신 것을 진심으로 환영합니다.

1. 프로필 설정 가이드
- 닉네임 설정 규칙: [닉네임 / 활동지역 / 연령대]
- 프로필 사진 설정 시 정모 우선 초대 혜택

2. 첫 출석 체크
- '가입 인사' 게시판에 간단한 인사글을 남겨주세요!

3. 주요 정기 일정 안내
- 매주 수요일 저녁: 온라인 수다방
- 매월 셋째 주 토요일: 오프라인 정기 모임`,
  },
  {
    name: '오프라인 정모 회비 정산 양식',
    content: `[제N회 정기모임 회비 투명 결산 보고]

일시: 2026년 OO월 OO일
장소: OO모임 공간
참석자: 총 O명

1. 총 수입 내역
- 1인당 회비 25,000원 x O명 = OOO,OOO원

2. 지출 상세 영수증
- 식사대: OOO,OOO원 (영수증 사진 첨부 1)
- 대관료/카페: OOO,OOO원 (영수증 사진 첨부 2)
- 잔액: OOO원 (차기 모임 이월 또는 N분의 1 환급)

언제나 투명하고 신뢰받는 밴드를 만들겠습니다. 감사합니다.`,
  },
];

export const PostEditorModal: React.FC<PostEditorModalProps> = ({
  initialPost,
  currentUser,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [content, setContent] = useState(initialPost?.content || '');
  const [category, setCategory] = useState<PostCategory>(initialPost?.category || 'knowhow');
  const [tagsInput, setTagsInput] = useState(initialPost ? initialPost.tags.join(', ') : '');
  const [isPinned, setIsPinned] = useState(initialPost?.isPinned || false);

  const canPin = currentUser.role === 'admin' || currentUser.role === 'band_leader';

  const categoryLabelMap: Record<PostCategory, string> = {
    all: '전체',
    knowhow: '운영 노하우',
    member_management: '멤버 관리',
    template: '공지 템플릿',
    qna: 'Q&A',
    lounge: '자유 토론',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category: category === 'all' ? 'knowhow' : category,
      categoryLabel: categoryLabelMap[category] || '운영 노하우',
      tags: tags.length > 0 ? tags : ['운영팁'],
      isPinned: canPin ? isPinned : false,
    });
    onClose();
  };

  const handleApplyTemplate = (templateContent: string) => {
    if (content.trim() && !window.confirm('기존 작성 중인 내용이 템플릿으로 대체됩니다. 진행하시겠습니까?')) {
      return;
    }
    setContent(templateContent);
    setCategory('template');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', padding: '36px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <span className="font-mono-eyebrow" style={{ color: 'var(--color-copper)' }}>
              {initialPost ? 'EDIT POST' : 'NEW CONTRIBUTION'}
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-ink)' }}>
              {initialPost ? '게시글 수정' : '새 게시글 / 운영 지식 작성'}
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

        {/* Template Quick Insert */}
        <div style={{
          backgroundColor: 'var(--color-oat)',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--color-copper)" />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-ink)' }}>
              인기 공지 템플릿 빠른 적용:
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {TEMPLATE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyTemplate(p.content)}
                style={{
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-paper)',
                  color: 'var(--color-near-black)',
                  fontSize: '11.5px',
                  fontFamily: 'var(--font-sans)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pills)',
                  cursor: 'pointer',
                }}
              >
                + {p.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category Selection */}
          <div className="form-group">
            <label className="form-label">게시판 카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory)}
              className="form-select"
            >
              <option value="knowhow">💡 운영 노하우 (리더십 / 활성화 / 이벤트)</option>
              <option value="member_management">👥 멤버 관리 (규칙 제정 / 온보딩 / 분쟁조정)</option>
              <option value="template">📢 공지 템플릿 (공지 양식 / 회비 정산 양식)</option>
              <option value="qna">❓ Q&A 질문 (운영 고민 / 솔루션 상담)</option>
              <option value="lounge">💬 자유 토론 (리더 일상 / 네트워킹)</option>
            </select>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글의 핵심 내용을 직관적으로 작성해주세요"
              className="form-input"
              required
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="예: 유령회원정리, 모임통장, 분쟁해결"
              className="form-input"
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label className="form-label">본문 내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="밴드 리더들과 나눌 상세 내용, 팁, 양식, 질문을 작성해주세요..."
              className="form-textarea"
              style={{ minHeight: '200px' }}
              required
            />
          </div>

          {/* Pin to top (if leader or admin) */}
          {canPin && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
              padding: '10px 14px',
              backgroundColor: 'var(--color-oat)',
              borderRadius: '8px',
            }}>
              <input
                type="checkbox"
                id="pinCheckbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--color-ledger-brown)' }}
              />
              <label htmlFor="pinCheckbox" style={{ fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Pin size={13} /> 이 게시글을 게시판 최상단에 공지로 고정 (리더 권한)
              </label>
            </div>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-oat-pill"
            >
              취소
            </button>
            <button
              type="submit"
              className="btn-ledger-pill"
            >
              <Check size={16} />
              {initialPost ? '수정 완료' : '게시글 등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
