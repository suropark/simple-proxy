import { Hono } from 'hono';
import { serve } from '@hono/node-server';

interface ProxyConfig {
  port?: number;
}

function createProxyServer(config: ProxyConfig) {
  const app = new Hono();
  const { port = 3000 } = config;

  // 모든 HTTP 메서드에 대해 프록시 처리
  app.all('*', async (c) => {
    const fullUrl = c.req.url;
    const url = new URL(fullUrl);

    // targetUrl 파라미터를 찾아서 그 이후의 모든 텍스트를 URL로 사용
    const targetUrlIndex = fullUrl.indexOf('targetUrl=');
    if (targetUrlIndex === -1) {
      return c.json({ error: 'targetUrl parameter is required' }, 400);
    }

    // targetUrl= 이후의 모든 텍스트를 가져옴
    const targetUrl = fullUrl.substring(targetUrlIndex + 10); // 'targetUrl='.length = 10
    if (!targetUrl) {
      return c.json({ error: 'targetUrl value is required' }, 400);
    }

    try {
      const targetUrlObj = new URL(targetUrl);
      // targetUrl을 그대로 사용 (이미 완전한 URL이므로)
      const proxyUrl = targetUrlObj;
      // 요청 헤더 복사 (host, x-target-url 헤더는 제외)
      const headers = new Headers();
      for (const [key, value] of Object.entries(c.req.header())) {
        if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'x-target-url') {
          headers.set(key, value);
        }
      }
      // 요청 본문 가져오기
      let body: BodyInit | undefined;
      if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
        body = await c.req.arrayBuffer();
      }
      // 프록시 요청 생성
      const proxyRequest = new Request(proxyUrl.toString(), {
        method: c.req.method,
        headers,
        body,
      });
      // 타겟 서버로 요청 전송
      const response = await fetch(proxyRequest);

      const json = await response.json();
      return new Response(JSON.stringify(json));
      // 응답 헤더 복사
    } catch (error) {
      console.error('Proxy error:', error);
      return c.json({ error: 'Proxy request failed' }, 500);
    }
  });

  return { app, port };
}

// 서버 시작
function startServer(config: ProxyConfig) {
  const { app, port } = createProxyServer(config);

  console.log(`🚀 Proxy server starting on port ${port}`);
  console.log(`📡 Proxying requests to client-specified targetUrl`);

  serve({
    fetch: app.fetch,
    port,
  });
}

// 환경 변수에서 포트만 사용
const port = parseInt(process.env.PORT || '3000');

startServer({ port });

console.log(`✅ Proxy server running at http://localhost:${port}`);
console.log(`🎯 Target URL: (client-specified)`);
