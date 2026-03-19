const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// GET /api/departments - Get all departments
export const getAllDepartments = async (token) => {
    const response = await fetch(BACKEND_URL + "/api/departments", {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error getting departments");
    return data;
};

// GET /api/departments/:id - Get department by id
export const getDepartmentById = async (token, departmentId) => {
    const response = await fetch(BACKEND_URL + `/api/departments/${departmentId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error getting department");
    return data;
};

// GET /api/departments/:id/users - Get department with users
export const getDepartmentWithUsers = async (token, departmentId) => {
    const response = await fetch(BACKEND_URL + `/api/departments/${departmentId}/users`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error getting department users");
    return data;
};

// POST /api/departments - Create department
export const createDepartment = async (token, departmentData) => {
    const response = await fetch(BACKEND_URL + "/api/departments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(departmentData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error creating department");
    return data;
};

// PUT /api/departments/:id - Update department
export const updateDepartment = async (token, departmentId, departmentData) => {
    const response = await fetch(BACKEND_URL + `/api/departments/${departmentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(departmentData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error updating department");
    return data;
};

// DELETE /api/departments/:id - Delete department
export const deleteDepartment = async (token, departmentId) => {
    const response = await fetch(BACKEND_URL + `/api/departments/${departmentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error deleting department");
    return data;
};