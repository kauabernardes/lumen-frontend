/**
 * Serviço de Comunidades para o projeto Lumen.
 * Gerencia a criação, entrada e listagem de comunidades.
 */

const communityService = {
  /**
   * Cria uma nova comunidade.
   * @param {string} name - Nome da comunidade (5-50 caracteres).
   * @param {string} [description] - Descrição opcional.
   * @returns {Promise<Object>}
   */
  async create(name, description) {
    return await window.api.post("/community", { name, description });
  },

  /**
   * Entra em uma comunidade existente.
   * @param {string} id - ID da comunidade.
   * @returns {Promise<Object>}
   */
  async join(id) {
    return await window.api.post(`/community/${id}/join`);
  },

  /**
   * Busca comunidades recomendadas para o usuário.
   * @param {number} page - Página atual.
   * @param {number} limit - Quantidade por página.
   * @returns {Promise<Object>}
   */
  async getRecommended(page = 1, limit = 10) {
    return await window.api.get("/community/recommended", {
      params: { page, limit },
    });
  },

  /**
   * Busca os detalhes de uma comunidade específica.
   * @param {string} id - ID da comunidade.
   * @returns {Promise<Object>}
   */
  async getById(id) {
    return await window.api.get(`/community/${id}`);
  },

  /**
   * Busca a lista de posts de uma comunidade específica.
   * @param {string} communityId - ID da comunidade.
   * @param {number} page - Página atual.
   * @param {number} limit - Quantidade por página.
   * @returns {Promise<Object>}
   */
  async getPosts(communityId, page = 1, limit = 10) {
    return await window.api.get(`/community/${communityId}/posts`, {
      params: { page, limit },
    });
  },
};

// Disponibiliza o serviço globalmente
window.communityService = communityService;
