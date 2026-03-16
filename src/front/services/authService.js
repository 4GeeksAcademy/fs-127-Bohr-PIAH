const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const loginService = async (email, password) => {
    const response = await fetch(BACKEND_URL + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Login failed");
    }

    return data;
};