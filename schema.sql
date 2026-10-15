-- ============================================================
-- BAND LEADERS 커뮤니티 데이터베이스 스키마 (Supabase용)
-- Supabase 대시보드 -> SQL Editor에 붙여넣고 [Run]을 누르세요.
-- ============================================================

-- 1. 프로필(사용자) 테이블
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'band_leader' CHECK (role IN ('member', 'band_leader', 'admin')),
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  band_name TEXT,
  band_category TEXT,
  member_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 게시글 테이블
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('knowhow', 'member_management', 'template', 'qna', 'lounge')),
  category_label TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  author_role TEXT DEFAULT 'band_leader',
  author_band_name TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_pinned BOOLEAN DEFAULT FALSE,
  is_reported BOOLEAN DEFAULT FALSE,
  report_reason TEXT,
  likes INTEGER DEFAULT 0,
  liked_by TEXT[] DEFAULT ARRAY[]::TEXT[],
  views INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 댓글 테이블
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  author_role TEXT DEFAULT 'band_leader',
  author_band_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) 정책 설정 (보안)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자에게 읽기(SELECT) 허용
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public comments are viewable by everyone" ON public.comments FOR SELECT USING (true);

-- 데이터 조작(INSERT, UPDATE, DELETE) 허용 (Anon 키로도 조작 가능하도록 설정)
CREATE POLICY "Enable insert for all users" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.profiles FOR DELETE USING (true);

CREATE POLICY "Enable insert for posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Enable delete for posts" ON public.posts FOR DELETE USING (true);

CREATE POLICY "Enable insert for comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for comments" ON public.comments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for comments" ON public.comments FOR DELETE USING (true);

-- ============================================================
-- 초기 데이터 (Seed Data) 삽입
-- ============================================================
INSERT INTO public.profiles (id, name, email, role, avatar_url, band_name, band_category, member_count, status)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '김총괄 (운영지원팀)', 'admin@bandleaders.io', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '밴드리더스 공식본부', '공식 커뮤니티', 14200, 'active'),
  ('22222222-2222-2222-2222-222222222222', '박등산 대장', 'hiker.park@gmail.com', 'band_leader', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '주말 2030 수도권 명산 등산밴드', '취미 / 아웃도어', 8400, 'active'),
  ('33333333-3333-3333-3333-333333333333', '이재테크', 'money.lee@gmail.com', 'band_leader', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', '직장인 ETF & 배당주 스터디', '경제 / 스터디', 15300, 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.posts (id, title, content, category, category_label, author_id, author_name, author_avatar, author_role, author_band_name, tags, is_pinned, likes, views, comments_count)
VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    '[공지/필독] 밴드 운영진을 위한 상생 가이드라인 & 회원 권익 보호 정책 안내',
    '안녕하세요, 밴드리더스 운영진 여러분. 2026년 하반기 커뮤니티 개편에 따라 각 밴드 리더분들이 숙지하셔야 할 상생 가이드라인을 공유드립니다.',
    'knowhow',
    '운영 노하우',
    '11111111-1111-1111-1111-111111111111',
    '김총괄 (운영지원팀)',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'admin',
    '밴드리더스 공식본부',
    ARRAY['공지사항', '운영가이드', '회원관리'],
    TRUE,
    88,
    1420,
    1
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '회원 8,000명 돌파하며 깨달은 유령회원 정리 및 재활성화 꿀팁 공유',
    '회원 수가 3천 명을 넘어가면 필연적으로 유령 회원 비중이 높아집니다. 정리 예고제와 소모임 분산 전략을 추천드립니다.',
    'knowhow',
    '운영 노하우',
    '22222222-2222-2222-2222-222222222222',
    '박등산 대장',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'band_leader',
    '주말 2030 수도권 명산 등산밴드',
    ARRAY['유령회원', '멤버활성화', '운영노하우'],
    FALSE,
    64,
    950,
    1
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.comments (id, post_id, author_id, author_name, author_avatar, author_role, author_band_name, content)
VALUES
  (
    '66666666-6666-6666-6666-666666666666',
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    '박등산 대장',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'band_leader',
    '주말 2030 수도권 명산 등산밴드',
    '공지 템플릿 잘 활용하고 있습니다! 덕분에 신규 가입자 정착률이 많이 올라갔습니다.'
  )
ON CONFLICT (id) DO NOTHING;
