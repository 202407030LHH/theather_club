# Theater Club 배포 가이드

이 프로젝트는 **React 프론트엔드**와 **Node.js/Express/SQLite 백엔드**로 구성되어 있습니다.
서버와 DB가 함께 동작해야 하므로, **Vercel**이나 **GitHub Pages** 같은 정적 사이트 호스팅 서비스로는 배포가 어렵습니다.

대신 **Render.com** (무료) 또는 **Railway.app** 같은 백엔드 호스팅 서비스를 추천합니다.

## 추천 배포 방법: Render.com (무료)

### 1단계: GitHub에 코드 올리기
1. GitHub 저장소를 만들고 코드를 push합니다.

### 2단계: Render.com 설정
1. [Render.com](https://render.com) 회원가입 및 로그인
2. **New +** 버튼 클릭 -> **Web Service** 선택
3. GitHub 저장소 연결
4. 설정 화면에서 다음과 같이 입력:

| 항목 | 값 |
|------|----|
| **Name** | theater-club (원하는 이름) |
| **Region** | Singapore (한국과 가까움) |
| **Branch** | main (또는 master) |
| **Root Directory** | . (비워둠) |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build && cd server && npm install` |
| **Start Command** | `node server/server.js` |

5. **Create Web Service** 클릭

### 3단계: 확인
배포가 완료되면 Render에서 제공하는 URL (예: `https://theater-club.onrender.com`)로 접속하면 됩니다.

---

## 로컬 실행 방법 (개발용)

프로젝트 폴더 안에 있는 `start_app.bat` 파일을 더블 클릭하면
백엔드 서버(5000번 포트)와 프론트엔드 서버(5173번 포트)가 동시에 실행되고,
자동으로 브라우저가 열립니다.
