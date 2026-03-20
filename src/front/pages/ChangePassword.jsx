import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { changePasswordService } from "../services/authService";

export const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await changePasswordService(currentPassword, newPassword, store.token);
            setMessage("Password changed successfully");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (err) {
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div className="home-wrapper">
            <h2 className="view-title">Change password</h2>
            <div className="login-box">
                <form className="cyber-form" onSubmit={handleSubmit}>
                    <label className="cyber-label">Current password</label>
                    <input
                        type="password"
                        className="cyber-input"
                        placeholder="********"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <label className="cyber-label">New password</label>
                    <input
                        type="password"
                        className="cyber-input"
                        placeholder="********"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {message && <p style={{ color: "green" }}>{message}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit" className="cyber-btn-success login-btn">
                        Save new password
                    </button>
                </form>
            </div>
        </div>
    );
};