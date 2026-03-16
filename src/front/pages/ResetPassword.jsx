import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const token = searchParams.get("token");

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Something went wrong");
                return;
            }

            setMessage("Password updated successfully");
            setTimeout(() => navigate("/login"), 2000);

        } catch (err) {
            setError("Connection error, please try again");
        }
    };

    return (
        <div className="home-wrapper">
            <h2 className="view-title">New password</h2>
            <div className="login-box">
                <form className="cyber-form" onSubmit={handleSubmit}>
                    <label className="cyber-label">New password</label>
                    <input
                        type="password"
                        className="cyber-input"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {message && <p style={{ color: "green" }}>{message}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit" className="cyber-btn-success login-btn">
                        Save password
                    </button>
                </form>
            </div>
        </div>
    );
};