const recommendationService = {
  async get() {
    return await window.api.get(`/recommendation`);
  },
};

window.recommendationService = recommendationService;
