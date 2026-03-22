const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// GET /api/users - Get all users
export const getAllUsers = async (token) => {
  const response = await fetch(BACKEND_URL + "/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error getting users");
  return data;
};

// GET /api/users/:id - Get user by id
export const getUserById = async (token, userId) => {
  const response = await fetch(BACKEND_URL + `/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error getting user");
  return data;
};

// GET /api/users/:id/projects - Get user with projects
export const getUserWithProjects = async (token, userId) => {
  const response = await fetch(BACKEND_URL + `/api/users/${userId}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Error getting user projects");
  return data;
};

// POST /api/users - Create user
export const createUser = async (token, userData) => {
  const response = await fetch(BACKEND_URL + "/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (response.status === 409) throw new Error("USER_ALREADY_EXISTS");
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error creating user");
  return data;
};

// PUT /api/users/:id - Update user
export const updateUser = async (token, userId, userData) => {
  const response = await fetch(BACKEND_URL + `/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error updating user");
  return data;
};

// DELETE /api/users/:id - Delete user
export const deleteUser = async (token, userId) => {
  const response = await fetch(BACKEND_URL + `/api/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error deleting user");
  return data;
};
