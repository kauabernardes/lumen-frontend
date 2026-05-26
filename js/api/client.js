

const API_BASE_URL = "http://localhost:3000"; 

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  
  const token = sessionStorage.getItem("auth_token");

  const defaultHeaders = {
    "Content-Type": "application/json",
  };


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

window.api = api;
