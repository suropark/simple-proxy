# Simple Proxy Server

Hono를 사용한 가벼운 프록시 서버입니다. 클라이언트의 요청을 타겟 URL로 전달하고 응답을 반환합니다.

## 설치

```bash
npm install
```

## 사용법

### 개발 모드로 실행

```bash
npm run dev
```

### 프로덕션 빌드 및 실행

```bash
npm run build
npm start
```

### 환경 변수 설정

- `TARGET_URL`: 프록시할 타겟 URL (기본값: `http://localhost:8080`)
- `PORT`: 프록시 서버 포트 (기본값: `3000`)

예시:

```bash
TARGET_URL=http://api.example.com PORT=3001 npm run dev
```

## 기능

- 모든 HTTP 메서드 지원 (GET, POST, PUT, DELETE 등)
- 요청 헤더 자동 전달 (Host 헤더 제외)
- 요청 본문 전달
- 응답 헤더 및 본문 전달
- 에러 처리

## 예시

프록시 서버가 `http://localhost:3000`에서 실행 중이고 타겟이 `http://api.example.com`인 경우:

```
클라이언트 요청: GET http://localhost:3000/users
프록시 전달: GET http://api.example.com/users
```

## 라이센스

MIT
