import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

interface ProxyRequest {
  targetUrl: string;
}

serve(async (req) => {
  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    // targetUrl 파라미터를 찾아서 그 이후의 모든 텍스트를 URL로 사용
    const fullUrl = req.url;
    const targetUrlIndex = fullUrl.indexOf('targetUrl=');

    if (targetUrlIndex === -1) {
      return new Response(JSON.stringify({ error: 'targetUrl parameter is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // targetUrl= 이후의 모든 텍스트를 가져옴
    let targetUrl = fullUrl.substring(targetUrlIndex + 10); // 'targetUrl='.length = 10

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'targetUrl value is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // URL 디코딩
    try {
      targetUrl = decodeURIComponent(targetUrl);
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid URL encoding' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 요청 헤더 복사 (host, x-target-url 헤더는 제외)
    const headers = new Headers();
    for (const [key, value] of req.headers.entries()) {
      if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'x-target-url') {
        headers.set(key, value);
      }
    }

    // 요청 본문 가져오기
    let body: BodyInit | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await req.arrayBuffer();
    }

    // 프록시 요청 생성
    const proxyRequest = new Request(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    // 타겟 서버로 요청 전송
    const response = await fetch(proxyRequest);

    // 응답을 JSON으로 파싱
    const json = await response.json();

    return new Response(JSON.stringify(json), {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Proxy request failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
