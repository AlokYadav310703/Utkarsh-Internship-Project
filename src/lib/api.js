import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("utkarsh_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const setSession = (token, user) => {
  if (token) localStorage.setItem("utkarsh_token", token);
  if (user) localStorage.setItem("utkarsh_user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("utkarsh_token");
  localStorage.removeItem("utkarsh_user");
};
