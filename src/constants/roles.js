// 사용자 등급 정의
// 이 파일에서 등급을 추가하거나 수정할 수 있습니다.
// label: 화면에 표시될 이름
// color: 등급 뱃지 색상 (CSS 색상 코드)

export const USER_ROLES = {
    ADMIN: {
        id: 'ADMIN',
        label: '관리자',
        color: '#800020' // Burgundy
    },
    MEMBER: {
        id: 'MEMBER',
        label: '정회원',
        color: '#2e7d32' // Green
    },
    GUEST: {
        id: 'GUEST',
        label: '손님',
        color: '#666666' // Gray
    }
};

export const DEFAULT_ROLE = 'GUEST';
