/**
 * Serviço de Autenticação para o projeto Lumen.
 * Gerencia login, registro e persistência do token.
 */

const authService = {
  /**
   * Realiza o login do usuário.
   * @param {string} identifier - Email ou username (depende da implementação do backend).
   * @param {string} password - Senha do usuário.
   * @returns {Promise<Object>} - Retorna os dados do usuário ou token.
   */
  async login(identifier, password) {
    const payload = { identifier, password };

    const data = await window.api.post("/auth/login", payload);

    if (data && data.access_token) {
      sessionStorage.setItem("auth_token", data.access_token);
    }

    return data;
  },

  /**
   * Realiza o registro de um novo usuário.
   * @param {Object} userData - Objeto contendo email, username e password.
   * @returns {Promise<Object>} - Retorna o resultado do registro.
   */
  async register(userData) {
    // Usa o api global
    return await window.api.post("/auth/register", userData);
  },

  /**
   * Remove o token da sessão, realizando o logout.
   */
  logout() {
    sessionStorage.removeItem("auth_token");
  },

  /**
   * Retorna o token de autenticação atual, se existir.
   * @returns {string|null}
   */
  getToken() {
    return sessionStorage.getItem("auth_token");
  },
};

// Disponibiliza o serviço globalmente para scripts legados no HTML
window.authService = authService;
