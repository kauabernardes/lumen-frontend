/**
 * Serviço de Usuários para o projeto Lumen.
 * Gerencia perfil, resumos (summary) e publicações do usuário via REST API.
 */

const userService = {
  /**
   * Busca as informações básicas do perfil do usuário logado.
   * @returns {Promise<Object>}
   */
  async getProfile() {
    return await window.api.get("/user/me");
  },

  /**
   * Atualiza as informações do perfil do usuário.
   * @param {Object} data - Dados para atualizar (ex: { name, username })
   * @returns {Promise<Object>}
   */
  async updateProfile(data) {
    return await window.api.put("/user/me", data);
  },

  /**
   * Busca o resumo de estatísticas do usuário (ofensiva, horas, check-ins).
   * @returns {Promise<Object>}
   */
  async getSessionStats(userId) {
    return await window.api.get(`/user/${userId}/session/stats`);
  },

  /**
   * Busca as comunidades que o usuário logado participa.
   * @returns {Promise<Array>}
   */
  async getCommunities() {
    return await window.api.get("/user/communities");
  },

  /**
   * Busca os posts/contribuições feitos pelo usuário logado.
   * @param {number} page - Página atual.
   * @param {number} limit - Limite de itens por página.
   * @returns {Promise<Object>}
   */
  async getContributions(page = 1, limit = 5) {
    return await window.api.get(
      `/user/contributions?page=${page}&limit=${limit}`,
    );
  },

  async updateProfile(formData) {
    return await window.api.patch(`/user/profile`, formData);
  },
};

// Disponibiliza o serviço globalmente
window.userService = userService;
