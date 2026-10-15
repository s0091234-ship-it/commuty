import { Post, Comment, User, CommunityStats } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: '김총괄 (운영지원팀)',
    email: 'admin@bandleaders.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bandName: '밴드리더스 공식본부',
    bandCategory: '공식 커뮤니티',
    memberCount: 14200,
    joinedAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 'user-leader-1',
    name: '박등산 대장',
    email: 'hiker.park@gmail.com',
    role: 'band_leader',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bandName: '주말 2030 수도권 명산 등산밴드',
    bandCategory: '취미 / 아웃도어',
    memberCount: 8400,
    joinedAt: '2024-03-10',
    status: 'active',
  },
  {
    id: 'user-leader-2',
    name: '이재테크',
    email: 'money.lee@gmail.com',
    role: 'band_leader',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bandName: '직장인 ETF & 배당주 스터디',
    bandCategory: '경제 / 스터디',
    memberCount: 15300,
    joinedAt: '2024-04-02',
    status: 'active',
  },
  {
    id: 'user-member-1',
    name: '최초보리더',
    email: 'newbie.choi@gmail.com',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bandName: '강남 반려견 산책모임 (개설 2주차)',
    bandCategory: '반려동물',
    memberCount: 65,
    joinedAt: '2024-08-20',
    status: 'active',
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: '[공지/필독] 밴드 운영진을 위한 상생 가이드라인 & 회원 권익 보호 정책 안내',
    content: `안녕하세요, 밴드리더스 운영진 여러분.

2026년 하반기 커뮤니티 개편에 따라 각 밴드 리더분들이 꼭 숙지하셔야 할 기본 상생 가이드라인을 공유드립니다.

1. 무분별한 광고 및 상업적 홍보 제재 기준
- 사전 협의되지 않은 외부 단톡방/쇼핑몰 유입 링크는 1차 경고 후 2차 영구 강퇴 조치가 원칙입니다.
- 운영진 명의의 제휴 게시물은 게시글 서두에 [제휴 협찬] 표기를 의무화해주세요.

2. 신규 가입자 정착을 위한 3단계 온보딩 루틴
- 가입 환영 자동 메시지 적극 활용
- 7일 이내 첫 출석 체크 이벤트 진행
- 닉네임 표기 통일 가이드 (예: 닉네임/지역/연령대)

게시판 내 '공지 템플릿' 카테고리에 복사해서 바로 쓸 수 있는 텍스트 양식을 업로드해두었으니 자유롭게 활용하시기 바랍니다.`,
    category: 'knowhow',
    categoryLabel: '운영 노하우',
    author: {
      id: 'user-admin',
      name: '김총괄 (운영지원팀)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      bandName: '밴드리더스 공식본부',
    },
    tags: ['공지사항', '운영가이드', '회원관리'],
    isPinned: true,
    likes: 88,
    likedBy: ['user-leader-1', 'user-leader-2'],
    views: 1420,
    commentsCount: 3,
    createdAt: '2026-10-10 10:30',
  },
  {
    id: 'post-2',
    title: '회원 8,000명 돌파하며 깨달은 유령회원 정리 및 재활성화 꿀팁 공유',
    content: `안녕하세요! 수도권 명산 등산밴드를 2년째 이끌고 있는 박등산입니다.

회원 수가 3천 명을 넘어가면 필연적으로 '눈팅만 하고 활동 안 하는 유령 회원' 비중이 70%를 넘어가게 됩니다. 이때 제가 효과를 봤던 3가지 전략을 정리해봅니다.

첫째, "정리 예고제" 시행
- 90일 이상 미접속 회원 대상 정리 안내문을 2주 전 사전 공지
- "다시 참여를 희망하시는 분은 댓글 한 줄 남겨주세요" 액션 유도 -> 실제 15%가 복귀함!

둘째, 신규 소모임(소그룹) 활성화
- 초보자 전용 번개, 평일 야간 산책 등 진입장벽을 낮춘 마이크로 벙개 개설

셋째, 공동 리더진 역할 분담
- 사진 담당, 일정 공지 담당, 회계 담당 등 3인 체제로 분산해야 지치지 않습니다.

질문 있으신 초보 리더님들은 댓글 남겨주시면 아는 선에서 모두 답변드릴게요!`,
    category: 'knowhow',
    categoryLabel: '운영 노하우',
    author: {
      id: 'user-leader-1',
      name: '박등산 대장',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'band_leader',
      bandName: '주말 2030 수도권 명산 등산밴드',
    },
    tags: ['유령회원', '멤버활성화', '운영노하우'],
    isPinned: false,
    likes: 64,
    likedBy: ['user-leader-2'],
    views: 950,
    commentsCount: 2,
    createdAt: '2026-10-12 14:15',
  },
  {
    id: 'post-3',
    title: '[복붙 템플릿] 분쟁 유발 및 비매너 회원 경고/강퇴 공지 양식',
    content: `회원 간 마찰이나 정치/종교 갈등으로 밴드 분위기가 흐려질 때 즉각 대응할 수 있는 표준 안내문 양식입니다. 필요하신 분은 그대로 복사해서 쓰세요.

---------------------------------------------------
[밴드 운영진 안내문: 건전한 소통 문화 조성을 위한 당부]

안녕하세요, [밴드명] 가족 여러분.
본 밴드는 [모임의 취지]를 위해 모인 소중한 교류의 공간입니다.

최근 일부 회원 간의 과도한 비방, 모욕성 댓글, 규칙 위반 행위로 인해 다수 회원분들이 불편을 겪고 있습니다.

1. 운영 원칙
- 상호 존중과 배려의 언어 사용
- 특정인에 대한 인신공격, 조롱, 허위사실 유포 엄격 금지

2. 조치 절차
- 1차: 비공개 경고 메시지 및 게시글 비공개 전환
- 2차: 7일 활동 정지 조치
- 3차: 예고 없는 영구 탈퇴 및 재가입 불가 조치

모두가 편안하고 즐거운 밴드를 만들기 위해 회원 여러분의 적극적인 협조를 부탁드립니다.
- [밴드명] 리더 및 운영진 드림
---------------------------------------------------`,
    category: 'template',
    categoryLabel: '공지 템플릿',
    author: {
      id: 'user-leader-2',
      name: '이재테크',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'band_leader',
      bandName: '직장인 ETF & 배당주 스터디',
    },
    tags: ['템플릿', '강퇴공지', '규칙제정'],
    isPinned: false,
    likes: 112,
    likedBy: ['user-admin', 'user-leader-1'],
    views: 1840,
    commentsCount: 4,
    createdAt: '2026-10-13 09:20',
  },
  {
    id: 'post-4',
    title: '오프라인 정모 시 회비 투명 관리 어떻게 하시나요? (노하우 질문)',
    content: `안녕하세요, 반려견 산책 모임 밴드를 만든 지 이제 2주 된 신임 리더입니다.

다음 주말에 처음으로 오프라인 애견 카페 정모를 열려고 하는데, 회비 걷는 것과 영수증 정산 방식을 어떻게 투명하게 공개해야 뒤탈이 없을지 고민입니다.

선배 리더님들은 모임 통장을 쓰시나요, 아니면 네이버페이나 카카오뱅크 모임통장을 연동하시나요? 영수증 인증 팁이 있다면 조언 부탁드립니다!`,
    category: 'qna',
    categoryLabel: 'Q&A',
    author: {
      id: 'user-member-1',
      name: '최초보리더',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'member',
      bandName: '강남 반려견 산책모임 (개설 2주차)',
    },
    tags: ['정모', '회비관리', '초보리더'],
    isPinned: false,
    likes: 19,
    likedBy: ['user-leader-1'],
    views: 420,
    commentsCount: 3,
    createdAt: '2026-10-14 11:05',
  },
  {
    id: 'post-5',
    title: '밴드 채팅방 렉(버벅임) 현상과 대용량 사진 업로드 팁',
    content: `참여 멤버가 500명 넘는 단체 채팅방에서 사진 여러 장을 원본으로 올릴 때마다 멤버분들이 폰이 느려진다고 건의하더군요.

저희 밴드에서는 다음과 같이 룰을 정했습니다:
1. 실시간 챗에는 썸네일/화질 보통으로 공유
2. 정식 사진첩 앨범에 날짜별로 앨범 생성 후 원본 업로드

이렇게 하니 채팅방 데이터 용량도 획기적으로 줄고 반응도 아주 좋습니다.`,
    category: 'member_management',
    categoryLabel: '멤버 관리',
    author: {
      id: 'user-leader-1',
      name: '박등산 대장',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'band_leader',
      bandName: '주말 2030 수도권 명산 등산밴드',
    },
    tags: ['채팅방관리', '앨범관리', '팁'],
    isPinned: false,
    likes: 41,
    likedBy: [],
    views: 630,
    commentsCount: 1,
    createdAt: '2026-10-14 15:30',
  },
  {
    id: 'post-6',
    title: '[신고 접수건] 사설 코인 리딩방 홍보 계정 의심 건 제보합니다',
    content: `자유게시판에 댓글로 자꾸 불법 리딩방 밴드 링크를 뿌리는 계정이 있습니다. 관리자님 확인 부탁드립니다.`,
    category: 'lounge',
    categoryLabel: '자유 토론',
    author: {
      id: 'user-leader-2',
      name: '이재테크',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'band_leader',
      bandName: '직장인 ETF & 배당주 스터디',
    },
    tags: ['신고', '스팸차단'],
    isPinned: false,
    isReported: true,
    reportReason: '사설 불법 홍보 스팸 의심 글',
    likes: 5,
    likedBy: [],
    views: 110,
    commentsCount: 1,
    createdAt: '2026-10-14 19:40',
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    author: {
      id: 'user-leader-1',
      name: '박등산 대장',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'band_leader',
      bandName: '주말 2030 수도권 명산 등산밴드',
    },
    content: '공지 템플릿 잘 활용하고 있습니다! 특히 온보딩 환영 메시지 덕분에 가입 후 탈퇴율이 많이 낮아졌습니다.',
    createdAt: '2026-10-10 11:20',
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    author: {
      id: 'user-leader-2',
      name: '이재테크',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      role: 'band_leader',
      bandName: '직장인 ETF & 배당주 스터디',
    },
    content: '상업적 홍보 제재 기준 명확하게 짚어주셔서 감사드립니다. 밴드 공지에 인용하겠습니다.',
    createdAt: '2026-10-10 14:05',
  },
  {
    id: 'comment-3',
    postId: 'post-4',
    author: {
      id: 'user-leader-1',
      name: '박등산 대장',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'band_leader',
      bandName: '주말 2030 수도권 명산 등산밴드',
    },
    content: '카카오뱅크 모임통장이나 토스 모임통장이 밴드 회원분들께 입출금 내역이 실시간으로 투명하게 공유되어 분쟁 예방에 최고입니다! 영수증은 밴드 게시글에 사진 찍어서 바로바로 올려두면 신뢰도가 확 올라갑니다.',
    createdAt: '2026-10-14 11:35',
  },
  {
    id: 'comment-4',
    postId: 'post-4',
    author: {
      id: 'user-admin',
      name: '김총괄 (운영지원팀)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      bandName: '밴드리더스 공식본부',
    },
    content: '초보 리더님 환영합니다! 정모 회비 관련 표준 서식도 이번 주 내로 템플릿 게시판에 업데이트해 드릴게요.',
    createdAt: '2026-10-14 12:10',
  }
];

export const INITIAL_STATS: CommunityStats = {
  totalMembers: 1248,
  activeBands: 890,
  todayPosts: 27,
  pendingReports: 1,
};
