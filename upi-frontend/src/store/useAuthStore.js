import { create } from "zustand";

const useAuthStore = create((set) => ({
  user:  null,
  token: null,

  login: (user, token) => {
    localStorage.setItem("token",    token);
    localStorage.setItem("upi_user", JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("upi_user");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
