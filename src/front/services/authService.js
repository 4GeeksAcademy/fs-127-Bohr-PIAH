const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const loginService = async (email, password) => {
    const response = await fetch(BACKEND_URL + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login failed");
    return data;
};

export const forgotPasswordService = async (email) => {
    const response = await fetch(BACKEND_URL + "/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Ha ocurrido un error");
    return data;
};

export const resetPasswordService = async (token, password) => {
    const response = await fetch(BACKEND_URL + "/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong");
    return data;
};

export const changePasswordService = async (currentPassword, newPassword, token) => {
    const response = await fetch(BACKEND_URL + "/api/auth/change-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong");
    return data;
};