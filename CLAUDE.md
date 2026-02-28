# meruhoshop-QuestMe — Claude Instructions

## Project Info
- Stack: React 19, Vite 7, Tailwind CSS 3, Framer Motion, Supabase
- Deployed: https://meruhoshop-questme.vercel.app
- GitHub: https://github.com/meruho/meruhoshop-QuestMe
- Supabase project: `hkmbeimwfbvbgrqfleiq.supabase.co`

## DB Tables
- `profiles` (id, level, exp)
- `habits` (id, user_id, title, days, created_at)
- `habit_completions` (habit_id, user_id, completed_date)
- `tasks` (id, user_id, title, type, status, steps, current_step, created_at)
- `logs` (id, user_id, title, type, exp_gained, completed_at)
- All DB logic in `src/hooks/useGameState.js`

## Supabase Auth (resolved)
- **Problem**: `TypeError: Failed to execute 'fetch' on 'Window': Invalid value` on Vercel with PKCE flow
- **Solution**: `flowType: 'implicit'` in `src/lib/supabase.js`
- `useAuth.js` — no manual `?code=` detection needed, SDK handles hash fragment automatically

## MERUHOSHOP Design System
- Font: Galmuri11 / NeoDunggeunmo (pixel Korean font)
- Colors: pixel-dark #1A1A2E, pixel-bg #F0EAD6, pixel-card #FFFDF5, miru-blue #3498DB, exp-yellow #F1C40F
- Mascot: Miru — 8x8 pixel character, float animation `y: [0, -8, 0]`
- UI rules: `border-4 border-black`, `shadow-[4px_4px_0px_0px_#000]`, active translate feedback
- Series: "야무진 시리즈" — apps share same design system, Miru changes outfit per app
- See `tailwind.config.js` for full token list
