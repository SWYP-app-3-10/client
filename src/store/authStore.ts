import {create} from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
    profileImage: string | null;
  } | null;
  setUser: (user: AuthStore['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  isAuthenticated: false,
  setIsAuthenticated: value => set({isAuthenticated: value}),
  user: null,
  setUser: user => set({user}),
  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
    }),
}));

// 편의 훅: 인증 상태만 필요한 경우
export const useIsAuthenticated = () =>
  useAuthStore(state => state.isAuthenticated);

// 편의 훅: 사용자 정보만 필요한 경우
export const useUser = () => useAuthStore(state => state.user);
