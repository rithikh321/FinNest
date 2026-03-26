import { create } from "zustand";

const useAuthStore = create((set) => ({
  user:  null,
  token: null,

  login: (user, token) => {
    localStorage.setItem("mf_token", token);
    localStorage.setItem("mf_user",  JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("mf_token");
    localStorage.removeItem("mf_user");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
