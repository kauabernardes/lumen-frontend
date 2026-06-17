const authService = {
  async login(identifier, password) {
    const payload = { identifier, password };

    const data = await window.api.post("/auth/login", payload);

    if (data && data.access_token) {
      sessionStorage.setItem("auth_token", data.access_token);
      sessionStorage.setItem("auth_data", JSON.stringify(data?.user));
    }

    return data;
  },

  async register(userData) {
    return await window.api.post("/auth/register", userData);
  },

  logout() {
    sessionStorage.removeItem("auth_token");
  },

  getToken() {
    return sessionStorage.getItem("auth_token");
  },

  getAuthData() {
    const data = sessionStorage.getItem("auth_data");

    try {
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erro ao converter dados do storage:", error);
      return null;
    }
  },
};
window.authService = authService;
