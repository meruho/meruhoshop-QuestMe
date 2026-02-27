import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DEV_USER = {
  id: 'dev-user',
  email: 'dev@local.dev',
  user_metadata: { full_name: 'Dev User', avatar_url: null },
};

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // 개발 모드: 로컬 더미 유저로 즉시 로그인
    if (import.meta.env.DEV) {
      setUser(DEV_USER);
      return;
    }

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
    // 개발 모드: 더미 유저 제거
    if (import.meta.env.DEV && user?.id === 'dev-user') {
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return { user, loading, signInWithGoogle, signOut };
}
