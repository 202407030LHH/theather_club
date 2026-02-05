---
trigger: always_on
---

# 프로젝트 개발 규칙

## 1. 코드 스타일 및 포맷팅

### 1.1 일반 규칙
- **들여쓰기**: 2칸 스페이스 사용 (탭 사용 금지)
- **줄 길이**: 최대 100자 (주석 포함)
- **파일 인코딩**: UTF-8
- **줄바꿈**: LF (Unix 스타일)
- **파일 끝**: 항상 빈 줄로 종료

### 1.2 JavaScript/TypeScript
- **세미콜론**: 항상 사용
- **따옴표**: 작은따옴표(') 사용, JSX는 큰따옴표(") 사용
- **화살표 함수**: 가능한 경우 화살표 함수 사용
- **const/let**: var 사용 금지, 가능한 const 우선 사용
- **템플릿 리터럴**: 문자열 연결 시 템플릿 리터럴 사용

```javascript
// Good
const userName = 'John';
const greeting = `Hello, ${userName}!`;

// Bad
var userName = "John";
const greeting = 'Hello, ' + userName + '!';
```

### 1.3 CSS
- **클래스 네이밍**: kebab-case 사용
- **ID 사용**: 가급적 지양, 클래스 사용 권장
- **중첩**: 최대 3단계까지만 허용
- **단위**: 0값에는 단위 생략

```css
/* Good */
.user-profile-card {
  margin: 0;
  padding: 1rem;
}

/* Bad */
.UserProfileCard {
  margin: 0px;
  padding: 1rem;
}
```

## 2. 네이밍 컨벤션

### 2.1 변수 및 함수
- **변수**: camelCase
- **상수**: UPPER_SNAKE_CASE
- **함수**: camelCase, 동사로 시작
- **클래스**: PascalCase
- **컴포넌트**: PascalCase

```javascript
// Good
const MAX_RETRY_COUNT = 3;
let userAge = 25;

function getUserData() { }
class UserProfile { }
```

### 2.2 파일 네이밍
- **컴포넌트 파일**: PascalCase (예: `UserProfile.jsx`)
- **유틸리티 파일**: camelCase (예: `dateUtils.js`)
- **스타일 파일**: kebab-case (예: `user-profile.css`)
- **테스트 파일**: `*.test.js` 또는 `*.spec.js`

### 2.3 폴더 구조
```
src/
├── components/       # 재사용 가능한 컴포넌트
├── pages/           # 페이지 컴포넌트
├── hooks/           # 커스텀 훅
├── utils/           # 유틸리티 함수
├── services/        # API 서비스
├── constants/       # 상수 정의
├── styles/          # 전역 스타일
├── assets/          # 이미지, 폰트 등
└── types/           # TypeScript 타입 정의
```

## 3. Git 커밋 규칙

### 3.1 커밋 메시지 형식
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 3.2 Type 종류
- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음)
- **refactor**: 코드 리팩토링
- **test**: 테스트 코드 추가/수정
- **chore**: 빌드 업무, 패키지 매니저 설정 등
- **perf**: 성능 개선
- **ci**: CI/CD 관련 변경

### 3.3 커밋 메시지 예시
```
feat(attendance): 출석 체크 기능 추가

- 사용자가 수업 출석을 체크할 수 있는 UI 구현
- 출석 데이터를 로컬 스토리지에 저장
- 매주 일요일 자동 초기화 로직 추가

Closes #123
```

### 3.4 브랜치 전략
- **main**: 배포 가능한 안정 버전
- **develop**: 개발 중인 최신 버전
- **feature/[기능명]**: 새로운 기능 개발
- **fix/[버그명]**: 버그 수정
- **hotfix/[긴급수정명]**: 긴급 버그 수정
- **release/[버전]**: 릴리즈 준비

```bash
# 브랜치 생성 예시
git checkout -b feature/attendance-tracking
git checkout -b fix/login-error
git checkout -b hotfix/critical-security-issue
```

## 4. 코드 품질

### 4.1 주석 규칙
- **JSDoc 사용**: 함수와 클래스에 JSDoc 주석 작성
- **의도 설명**: 코드가 "무엇을" 하는지보다 "왜" 하는지 설명
- **TODO 주석**: `// TODO: 설명` 형식으로 작성

```javascript
/**
 * 사용자의 출석 정보를 가져옵니다.
 * @param {string} userId - 사용자 ID
 * @param {Date} date - 조회할 날짜
 * @returns {Promise<AttendanceData>} 출석 정보
 */
async function getAttendanceData(userId, date) {
  // 캐시된 데이터가 있으면 먼저 확인 (성능 최적화)
  const cached = cache.get(userId);
  if (cached) return cached;
  
  // TODO: API 호출 에러 핸들링 개선 필요
  return await api.fetchAttendance(userId, date);
}
```

### 4.2 에러 처리
- **try-catch**: 비동기 작업은 반드시 에러 처리
- **에러 로깅**: 모든 에러는 로깅
- **사용자 친화적 메시지**: 사용자에게 명확한 에러 메시지 제공

```javascript
// Good
try {
  const data = await fetchUserData();
  return data;
} catch (error) {
  console.error('사용자 데이터 조회 실패:', error);
  throw new Error('사용자 정보를 불러올 수 없습니다. 다시 시도해주세요.');
}

// Bad
const data = await fetchUserData(); // 에러 처리 없음
```

### 4.3 코드 리뷰 체크리스트
- [ ] 코드가 요구사항을 충족하는가?
- [ ] 네이밍이 명확하고 일관성 있는가?
- [ ] 불필요한 코드나 주석이 없는가?
- [ ] 에러 처리가 적절한가?
- [ ] 테스트 코드가 작성되었는가?
- [ ] 성능 이슈가 없는가?
- [ ] 보안 취약점이 없는가?

## 5. 성능 및 최적화

### 5.1 일반 원칙
- **불필요한 렌더링 방지**: React.memo, useMemo, useCallback 활용
- **이미지 최적화**: WebP 포맷 사용, lazy loading 적용
- **번들 크기 최적화**: 코드 스플리팅, tree shaking
- **캐싱 전략**: 적절한 캐싱으로 API 호출 최소화

### 5.2 React 최적화
```javascript
// Good - 메모이제이션 활용
const MemoizedComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);
  
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  return <div onClick={handleClick}>{processedData}</div>;
});

// Bad - 매번 재계산
const Component = ({ data }) => {
  const processedData = expensiveOperation(data); // 매 렌더링마다 실행
  return <div onClick={() => console.log('Clicked')}>{processedData}</div>;
};
```

## 6. 보안

### 6.1 보안 원칙
- **환경 변수**: API 키, 비밀번호 등은 환경 변수로 관리
- **XSS 방지**: 사용자 입력은 항상 검증 및 이스케이프
- **CSRF 방지**: CSRF 토큰 사용
- **인증/인가**: JWT 토큰 사용 시 만료 시간 설정
- **의존성 관리**: 정기적으로 보안 취약점 점검

```javascript
// Good - 환경 변수 사용
const API_KEY = process.env.REACT_APP_API_KEY;

// Bad - 하드코딩
const API_KEY = 'abc123xyz456'; // 절대 금지!
```

### 6.2 민감 정보 관리
- `.env` 파일은 `.gitignore`에 추가
- `.env.example` 파일로 필요한 환경 변수 명시
- 프로덕션 환경 변수는 별도 관리

## 7. 테스트

### 7.1 테스트 원칙
- **단위 테스트**: 모든 유틸리티 함수와 비즈니스 로직
- **통합 테스트**: 주요 사용자 플로우
- **커버리지**: 최소 80% 이상 유지
- **테스트 네이밍**: `should [예상 동작] when [조건]` 형식

```javascript
describe('getUserAttendance', () => {
  it('should return attendance data when user exists', async () => {
    const result = await getUserAttendance('user123');
    expect(result).toBeDefined();
    expect(result.userId).toBe('user123');
  });
  
  it('should throw error when user does not exist', async () => {
    await expect(getUserAttendance('invalid')).rejects.toThrow();
  });
});
```

### 7.2 테스트 작성 시기
- 새로운 기능 개발 시 함께 작성
- 버그 수정 시 재현 테스트 먼저 작성
- 리팩토링 전 기존 동작 보장을 위한 테스트 작성

## 8. 문서화

### 8.1 README.md 필수 항목
- 프로젝트 소개
- 기술 스택
- 설치 및 실행 방법
- 환경 변수 설정
- 프로젝트 구조
- 기여 가이드

### 8.2 API 문서화
- 모든 API 엔드포인트 문서화
- 요청/응답 예시 포함
- 에러 코드 및 메시지 정의

### 8.3 변경 이력
- CHANGELOG.md 파일 유지
- 버전별 주요 변경사항 기록

## 9. 접근성 (Accessibility)

### 9.1 기본 원칙
- **시맨틱 HTML**: 의미에 맞는 HTML 태그 사용
- **키보드 네비게이션**: 모든 기능 키보드로 접근 가능
- **ARIA 속성**: 필요한 경우 적절한 ARIA 속성 추가
- **색상 대비**: WCAG 2.1 AA 기준 준수
- **대체 텍스트**: 모든 이미지에 alt 속성 추가

```html
<!-- Good -->
<button aria-label="메뉴 열기" onClick={handleMenuOpen}>
  <img src="menu-icon.svg" alt="" />
</button>

<!-- Bad -->
<div onClick={handleMenuOpen}>
  <img src="menu-icon.svg" />
</div>
```

## 10. 의존성 관리

### 10.1 패키지 관리
- **정기 업데이트**: 월 1회 의존성 업데이트 검토
- **보안 감사**: `npm audit` 정기 실행
- **버전 고정**: package-lock.json 또는 yarn.lock 커밋
- **불필요한 패키지 제거**: 사용하지 않는 패키지 정리

### 10.2 패키지 추가 시 고려사항
- 번들 크기 영향 검토
- 마지막 업데이트 시기 확인
- 라이선스 확인
- 대안 패키지 비교

## 11. 코드 리뷰

### 11.1 리뷰어 가이드
- **건설적 피드백**: 문제점과 함께 개선 방안 제시
- **칭찬도 중요**: 좋은 코드에 대한 긍정적 피드백
- **일관성 유지**: 프로젝트 규칙 준수 여부 확인
- **빠른 응답**: 24시간 내 리뷰 완료

### 11.2 작성자 가이드
- **작은 PR**: 한 번에 하나의 기능만 포함
- **자가 리뷰**: PR 생성 전 스스로 먼저 리뷰
- **설명 추가**: PR 설명에 변경 이유와 테스트 방법 명시
- **피드백 수용**: 건설적 비판을 긍정적으로 받아들이기

## 12. 배포

### 12.1 배포 전 체크리스트
- [ ] 모든 테스트 통과
- [ ] 린트 에러 없음
- [ ] 빌드 성공
- [ ] 환경 변수 설정 확인
- [ ] 변경 이력 업데이트
- [ ] 버전 번호 업데이트

### 12.2 버전 관리
- **Semantic Versioning**: MAJOR.MINOR.PATCH
  - MAJOR: 하위 호환성 없는 변경
  - MINOR: 하위 호환성 있는 기능 추가
  - PATCH: 하위 호환성 있는 버그 수정

## 13. 프로젝트별 특수 규칙

### 13.1 출석 관리 시스템 (Theater Club)
- **데이터 초기화**: 매주 일요일 자동 초기화
- **출석 카운트**: 총 16회 기준으로 관리
- **관리자 권한**: 전체 사용자 출석 현황 조회 가능
- **로컬 스토리지**: 출석 데이터는 로컬 스토리지에 저장

### 13.2 브랜치 전략
- 새 기능은 `feature/` 접두사 사용
- 예: `feature/checkClass`, `feature/admin-dashboard`

---

## 참고 자료
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [React Best Practices](https://react.dev/learn)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**마지막 업데이트**: 2026-02-05
**버전**: 1.0.0