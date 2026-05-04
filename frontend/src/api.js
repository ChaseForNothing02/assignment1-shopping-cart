const API_BASE_URL = "http://localhost:5000";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const saveAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getSavedUser = () => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  return JSON.parse(savedUser);
};

export const request = async (path, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};