const API_URL = "https://task-proyect-api.vercel.app";

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const isDemoMode = localStorage.getItem("demo_mode") === "true";
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && !isDemoMode && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Error de servidor" }));
    throw new Error(error.message || "Error en la solicitud");
  }

  return response.json();
}

export const authService = {
  register: (data) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const taskService = {
  getAll: (filter = {}) => {
    const params = new URLSearchParams(filter);
    return request(`/tasks?${params}`);
  },

  getAllByAdmin: () => request("/tasks/admin"),

  createByAdmin: (data) =>
    request("/tasks/admin", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getById: (id) => request(`/tasks/${id}`),

  create: (data) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  complete: (id) =>
    request(`/tasks/complete/${id}`, {
      method: "PUT",
    }),

  delete: (id) =>
    request(`/tasks/${id}`, {
      method: "DELETE",
    }),
};

export const adminUserService = {
  getAll: () => request("/users"),
  getById: (id) => request(`/users/${id}`),
  deleteById: (id) =>
    request(`/users/${id}`, {
      method: "DELETE",
    }),
};

export { parseJwt };