import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // PKCE 콜백: URL에 ?code= 파라미터가 있으면 수동으로 세션 교환
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        // URL에서 코드 즉시 제거 (히스토리 클린)
        window.history.replaceState({}, document.title, window.location.pathname);
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error('코드 교환 오류:', error.message);
          } else {
            setUser(data.session?.user ?? null);
          }
        } catch (err) {
          console.error('코드 교환 실패:', err.message);
        }
        setLoading(false);
        return;
      }

      // 일반 플로우: 기존 세션 확인
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    init();

    // 로그인/로그아웃 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error('Google 로그인 에러:', error.message);
      alert(`로그인 오류: ${error.message}`);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signInWithGoogle, signOut };
}
