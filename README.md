# Simple Proxy Server

두 가지 버전의 프록시 서버를 제공합니다:

1. **Hono 기반 로컬 서버** - Node.js 환경에서 실행
2. **Supabase Edge Function** - Deno 환경에서 실행 (서버리스)

클라이언트의 요청을 타겟 URL로 전달하고 응답을 반환하는 프록시 서버입니다.

## 설치

```bash
npm install
```

## 사용법

### 1. Hono 기반 로컬 서버

#### 개발 모드로 실행

```bash
npm run dev
```

#### 프로덕션 빌드 및 실행

```bash
npm run build
npm start
```

#### 환경 변수 설정

- `PORT`: 프록시 서버 포트 (기본값: `3000`)

예시:

```bash
PORT=3001 npm run dev
```

### 2. Supabase Edge Function

#### 로컬 개발

```bash
# Supabase CLI 설치 (필요한 경우)
npm install -g supabase

# 로컬에서 Edge Function 실행
supabase start
supabase functions serve proxy --env-file .env.local
```

#### 배포

```bash
# Edge Function 배포
supabase functions deploy proxy
```

#### 사용법

Edge Function이 배포되면 다음과 같이 사용할 수 있습니다:

```
https://your-project.supabase.co/functions/v1/proxy?targetUrl=https://api.example.com/data
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
