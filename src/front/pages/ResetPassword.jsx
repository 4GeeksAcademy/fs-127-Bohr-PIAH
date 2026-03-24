import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordService } from "../services/authService";

export const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const token = searchParams.get("token");

        try {
            await resetPasswordService(token, newPassword);
            setMessage("Password updated successfully");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div className="home-wrapper">
            <h2 className="view-title">Recovery Password</h2>
            <div className="login-box">
                <form className="cyber-form" onSubmit={handleSubmit}>
                    <label className="cyber-label">New Password</label>
                    <input
                        type="password"
                        className="cyber-input"
                        placeholder="********"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <label className="cyber-label">Confirm New Password</label>
                    <input
                        type="password"
                        className="cyber-input"
                        placeholder="********"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {message && <p className="cyber-msg-success">{message}</p>}
                    {error && <p className="cyber-msg-error">{error}</p>}
                    <div className="reset-btn-group">
                        <button
                            type="button"
                            className="cyber-btn-success login-btn"
                            onClick={() => navigate("/login")}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="cyber-btn-success login-btn">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
