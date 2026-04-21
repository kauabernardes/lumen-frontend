/**
 * Serviço de Sessões de Estudo para o projeto Lumen.
 * Gerencia sessões via REST API e via Socket.io.
 */

const sessionService = {
  /**
   * Entra em uma sessão via Socket.io.
   * @param {string|null} sessionId - ID da sessão (null para criar uma nova).
   * @param {Function} callback - Callback para processar a resposta do servidor.
   */
  async join(sessionId = null, callback) {
    const token = window.sessionStorage.getItem("auth_token");

    if (!token) {
      throw new Error("Você precisa estar logado para acessar as sessões.");
    }

    const payload = { token };
    if (sessionId) payload.sessionId = sessionId;

    // A entrada é feita via socket, conforme a arquitetura do backend
    window.socket.emit("join_session", payload, callback);
  },

  /**
   * Busca a lista de participantes da sessão atual.
   * @param {string} sessionId - ID da sessão.
   * @returns {Promise<Array>}
   */
  async getParticipants(sessionId) {
    return await window.api.get(`/session/${sessionId}/participants`);
  },

  /**
   * Alterna o estado do timer via REST API.
   * @param {string} sessionId - ID da sessão.
   * @returns {Promise<Object>}
   */
  async toggle(sessionId) {
    return await window.api.post(`/session/${sessionId}/toggle`);
  },

  /**
   * Força uma pausa (curta ou longa) via REST API.
   * @param {string} sessionId - ID da sessão.
   * @param {'short' | 'long'} type - Tipo da pausa.
   * @returns {Promise<Object>}
   */
  async forceBreak(sessionId, type) {
    return await window.api.post(`/session/${sessionId}/break`, { type });
  },

  /**
   * Força o estado de estudo via REST API.
   * @param {string} sessionId - ID da sessão.
   * @returns {Promise<Object>}
   */
  async forceStudy(sessionId) {
    return await window.api.post(`/session/${sessionId}/study`);
  },
};

// Disponibiliza o serviço globalmente
window.sessionService = sessionService;
