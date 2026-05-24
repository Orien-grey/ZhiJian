import { defineStore } from "pinia";
import { authAPI } from "@/services/auth";

interface UserProfile {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    user: null,
  }),
  actions: {
    clearAuth() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    async login(email: string, password: string) {
      const { data } = await authAPI.login({ email, password });
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      localStorage.setItem("accessToken", this.accessToken ?? "");
      localStorage.setItem("refreshToken", this.refreshToken ?? "");
    },
    async register(email: string, password: string) {
      await authAPI.register({ email, password, role: "user" });
    },
    async refreshSession() {
      if (!this.refreshToken) {
        this.clearAuth();
        return false;
      }

      try {
        const { data } = await authAPI.refresh({
          refresh_token: this.refreshToken,
        });

        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        localStorage.setItem("accessToken", this.accessToken ?? "");
        localStorage.setItem("refreshToken", this.refreshToken ?? "");

        return true;
      } catch {
        this.clearAuth();
        return false;
      }
    },
    async logout() {
      if (this.refreshToken) {
        try {
          await authAPI.logout({ refresh_token: this.refreshToken });
        } catch {}
      }
      this.clearAuth();
    },
  },
});
