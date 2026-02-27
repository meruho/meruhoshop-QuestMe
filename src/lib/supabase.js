import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 내부 fetch 래퍼(Vb)에서 발생하는 "Invalid value" 오류를 디버깅/우회
const nativeFetch = (url, options = {}) => {
  // 헤더 검사 및 정리
  const rawHeaders = options.headers || {};
  const cleanHeaders = {};
  for (const [k, v] of Object.entries(rawHeaders)) {
    if (v !== undefined && v !== null) {
      cleanHeaders[k] = String(v);
    } else {
      console.warn('[supabase fetch] 헤더 제거됨:', k, '=', v);
    }
  }

  // 요청 옵션 정리
  const cleanOptions = {};
  if (options.method) cleanOptions.method = String(options.method);
  cleanOptions.headers = cleanHeaders;
  if (options.body !== undefined) cleanOptions.body = options.body;
  if (options.mode) cleanOptions.mode = options.mode;
  if (options.credentials) cleanOptions.credentials = options.credentials;
  if (options.cache) cleanOptions.cache = options.cache;
  if (options.redirect) cleanOptions.redirect = options.redirect;
  if (options.signal) cleanOptions.signal = options.signal;

  console.log('[supabase fetch]', cleanOptions.method || 'GET', String(url).substring(0, 80));
  return fetch(url, cleanOptions);
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
