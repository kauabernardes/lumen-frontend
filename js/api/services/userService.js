const userService = {
  async getProfile() {
    return await window.api.get("/user/me");
  },

  async updateProfile(data) {
    return await window.api.put("/user/me", data);
  },

  async getSessionStats(userId) {
    return await window.api.get(`/user/${userId}/session/stats`);
  },

  async getCommunities() {
    return await window.api.get("/user/communities");
  },

  async getContributions(page = 1, limit = 5) {
    return await window.api.get(
      `/user/contributions?page=${page}&limit=${limit}`,
    );
  },

  async updateProfile(formData) {
    return await window.api.patch(`/user/profile`, formData);
  },
};

window.userService = userService;
