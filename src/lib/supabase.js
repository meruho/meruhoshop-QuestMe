import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 내부 fetch 래퍼(Vb)에서 발생하는 "Invalid value" 오류를 우회하기 위해
// 직접 native fetch를 호출하는 커스텀 fetch를 제공
const nativeFetch = (...args) => fetch(...args);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: false, // URL에서 자동으로 코드 감지하지 않음 (수동 처리)
  },
  global: {
    fetch: nativeFetch,
  },
});
