import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 내부 fetch 래퍼(Vb)에서 발생하는 "Invalid value" 오류를 디버깅/우회
const nativeFetch = (url, options = {}) => {
  // 원본 options 전체를 로그 (문제 진단용)
  try {
    const debugInfo = {
      urlType: typeof url,
      urlStr: String(url).substring(0, 100),
      method: options.method,
      bodyType: typeof options.body,
      bodyLen: options.body ? String(options.body).length : 0,
      hasSignal: !!options.signal,
      signalAborted: options.signal?.aborted,
      mode: options.mode,
      credentials: options.credentials,
      headers: {}
    };
    const rawH = options.headers || {};
    for (const [k, v] of Object.entries(rawH)) {
      debugInfo.headers[k] = { type: typeof v, len: String(v).length, val: String(v).substring(0, 30) };
    }
    console.log('[nativeFetch debug]', JSON.stringify(debugInfo));
  } catch (e) {
    console.log('[nativeFetch debug error]', e.message);
  }

  // 헤더 정리 및 옵션 전달
  const rawHeaders = options.headers || {};
  const cleanHeaders = {};
  for (const [k, v] of Object.entries(rawHeaders)) {
    if (v !== undefined && v !== null) {
      cleanHeaders[k] = String(v);
    }
  }

  const cleanOptions = { method: options.method, headers: cleanHeaders };
  if (options.body !== undefined) cleanOptions.body = options.body;

  return fetch(String(url), cleanOptions);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: false, // URL에서 자동으로 코드 감지하지 않음 (수동 처리)
  },
  global: {
    fetch: nativeFetch,
  },
});
