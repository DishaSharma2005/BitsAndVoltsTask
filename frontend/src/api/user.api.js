import api from "./axios";

export const getUsers = (page = 1, limit = 5) =>
  api.get(`/users?page=${page}&limit=${limit}`);

export const searchUsers = (q, page = 1, limit = 5) =>
  api.get(`/users/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);

export const getUserById = (id) => api.get(`/users/${id}`);

export const createUser = (formData) =>
  api.post("/users", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateUser = (id, formData) =>
  api.put(`/users/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const exportUsersCSV = () =>
  api.get("/users/export/csv", { responseType: "blob" });
