const API_BASE_URL = "https://lumen-backend-production-8879.up.railway.app";

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = sessionStorage.getItem("auth_token");

  const defaultHeaders = {};

  // ERRO CORRIGIDO: Só define 'application/json' se NÃO for um FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

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

  // ERRO CORRIGIDO: Remove qualquer Content-Type forçado caso seja FormData
  if (options.body instanceof FormData && config.headers["Content-Type"]) {
    delete config.headers["Content-Type"];
  }

  if (config.method === "GET" || config.method === "HEAD") {
    delete config.body;
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData.message || `Erro na requisição: ${response.status}`,
      );
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

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

const api = {
  get: (endpoint, options) =>
    apiRequest(endpoint, { ...options, method: "GET" }),

  post: (endpoint, body, options) =>
    apiRequest(endpoint, {
      ...options,
      method: "POST",
      // ERRO CORRIGIDO: Se for FormData, não usa JSON.stringify()
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (endpoint, body, options) =>
    apiRequest(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (endpoint, options) =>
    apiRequest(endpoint, { ...options, method: "DELETE" }),

  patch: (endpoint, body, options) =>
    apiRequest(endpoint, {
      ...options,
      method: "PATCH",
      // ERRO CORRIGIDO: Se for FormData, passa direto sem converter
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
};

window.api = api;
