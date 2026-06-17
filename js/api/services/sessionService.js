const sessionService = {
  async join(sessionId = null, callback) {
    const token = window.sessionStorage.getItem("auth_token");

    if (!token) {
      throw new Error("Você precisa estar logado para acessar as sessões.");
    }

    const payload = { token };
    if (sessionId) payload.sessionId = sessionId;

    window.socket.emit("join_session", payload, callback);
  },

  async sendMessage(text, callback) {
    const payload = { text };

    window.socket.emit("send_message", payload, callback);
  },

  async getParticipants(sessionId) {
    return await window.api.get(`/session/${sessionId}/participants`);
  },

  async toggle(sessionId) {
    return await window.api.post(`/session/${sessionId}/toggle`);
  },

  async forceBreak(sessionId, type) {
    return await window.api.post(`/session/${sessionId}/break`, { type });
  },

  async forceStudy(sessionId) {
    return await window.api.post(`/session/${sessionId}/study`);
  },

  async addTheme(sessionId, theme) {
    return await window.api.post(`/session/${sessionId}/add/theme`, { theme });
  },

  async getLastChallenge(sessionId) {
    return await window.api.get(`/session/${sessionId}/ai/question`);
  },

  async getThemes(sessionId) {
    return await window.api.get(`/session/${sessionId}/themes`);
  },

  async validate(sessionId) {
    return await window.api.post(`/session/${sessionId}/ai/validate`);
  },
};

window.sessionService = sessionService;
