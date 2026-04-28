/**
 * Serviço de Daily Log para o projeto Lumen.
 * Gerencia o resumo (streak, calendário, status) e a criação de check-ins.
 */

const dailyService = {
  /**
   * Busca o resumo do usuário contendo o streak, semana e estatísticas.
   * @returns {Promise<Object>}
   */
  async getSummary() {
    return await window.api.get("/daily-log/summary");
  },

  /**
   * Envia um novo daily check-in.
   * @param {Object} payload - Objeto com date, mood, studiedYesterday, achievedGoal e studyToday.
   * @returns {Promise<Object>}
   */
  async createCheckin(payload) {
    return await window.api.post("/daily-log", payload);
  }
};

// Disponibiliza o serviço globalmente
window.dailyService = dailyService;