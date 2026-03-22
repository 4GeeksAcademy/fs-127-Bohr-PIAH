const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


// GET /api/tasks - Get all tasks
export const getAllTasks = async (token) => {
    const response = await fetch(BACKEND_URL + "/api/tasks", {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error getting tasks");
    return data;
};

// POST /api/tasks - Create task
export const createTask = async (token, taskData) => {
    const response = await fetch(BACKEND_URL + "/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error creating task");
    return data;
};

// PUT /api/tasks/:id - Update task
export const updateTask = async (token, taskId, taskData) => {
    const response = await fetch(BACKEND_URL + `/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error updating task");
    return data;
};

// DELETE /api/tasks/:id - Delete task
export const deleteTask = async (token, taskId) => {
    const response = await fetch(BACKEND_URL + `/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    
    // Añadido por Paty: algunos endpoints DELETE devuelven 204 sin body
    if (response.status === 204) return { message: "Deleted" };
    
    const text = await response.text();
    try {
        const data = JSON.parse(text);
        if (!response.ok) throw new Error(data.error || "Error deleting task");
        return data;
    } catch {
        throw new Error(`Server error ${response.status}: ${text.slice(0, 100)}`);
    }
};