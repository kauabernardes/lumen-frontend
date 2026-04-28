/**
 * Cliente API centralizado para o projeto Lumen.
 * Responsável por gerenciar a URL base, headers e autenticação.
 */

const API_BASE_URL = "http://localhost:3000"; // Ajuste conforme a porta da sua API NestJS

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Recupera o token da sessão (ajuste para localStorage se preferir)
  const token = sessionStorage.getItem("auth_token");

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Se houver um token, adiciona o cabeçalho de Autorização
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Se for uma requisição de método GET ou HEAD, não enviamos corpo
  if (config.method === "GET" || config.method === "HEAD") {
    delete config.body;
  }

  try {
    const response = await fetch(url, config);

    // Se a resposta não for ok (status fora de 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || `Erro na requisição: ${response.status}`,
      );
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Se a resposta for 204 (No Content), retorna null imediatamente
    if (response.status === 204) {
      return null;
    }

    // Verifica se há conteúdo para ler antes de tentar converter para JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.log(error);
    console.error(
      `[API Error] ${config.method || "GET"} ${endpoint}:`,
      error.message,
      error.status,
    );
    if (error.status == 401) {
      location.href = location.origin;
    }
    throw error;
  }
}

// Métodos utilitários para facilitar o uso
const api = {
  get: (endpoint, options) =>
    apiRequest(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) =>
    apiRequest(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (endpoint, body, options) =>
    apiRequest(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (endpoint, options) =>
    apiRequest(endpoint, { ...options, method: "DELETE" }),
  patch: (endpoint, body, options) =>
    apiRequest(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

// Exporta o objeto api para ser usado nos outros scripts
// Como você está usando scripts simples no HTML, usaremos o padrão global no window para facilitar
window.api = api;
