const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// GET /api/projects - Get all projects
export const getAllProjects = async (token) => {
    const response = await fetch(BACKEND_URL + "/api/projects", {
        headers: { "Authorization": `Bearer ${token}`}
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error getting projects");
    return data;
};

// GET /api/projects/: id - Get project by id
export const getProjectById = async (token, projectId) => {
    const response = await fetch(BACKEND_URL + `/api/projects/${projectId}`,{
        headers: { "Authorization": `Bearer ${token}`}
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error getting project tree");
    return data;
};

// POST /api/projects - Create project
export const createProject = async (token, projectData) => {
    const response = await fetch(BACKEND_URL + "/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error creating project");
    return data;
};

// PUT /api/projects/:id - Update project
export const updateProject = async (token, projectId, projectData) => {
    const response = await fetch(BACKEND_URL + `/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error updating project");
    return data;
};

// DELETE /api/projects/:id - Delete project
export const deleteProject = async (token, projectId) => {
    const response = await fetch(BACKEND_URL + `/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error deleting project");
    return data;
};
