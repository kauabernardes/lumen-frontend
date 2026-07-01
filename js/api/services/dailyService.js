const dailyService = {
  async getSummary() {
    return await window.api.get("/daily-log/summary");
  },

  async createCheckin(payload) {
    return await window.api.post("/daily-log", payload);
  },
};


window.dailyService = dailyService;
