import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordService } from "../services/authService";

export const ResetPassword = () => {
<<<<<<< HEAD
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
=======
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
>>>>>>> e183cd906fed29b28718300d4e2963ed9eb954dc
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

    const eyeStyle = {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "rgba(255,255,255,0.5)",
        padding: 0,
        display: "flex",
        alignItems: "center",
    };

    return (
        <div className="home-wrapper">
<<<<<<< HEAD
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
=======
            <h2 className="view-title">New Password</h2>
            <div className="login-box">
                <form className="cyber-form" onSubmit={handleSubmit}>
                    <label className="cyber-label">New Password</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="cyber-input"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: "36px" }}
                            required
                        />
                        <button type="button" style={eyeStyle} onClick={() => setShowPassword(v => !v)}>
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
>>>>>>> e183cd906fed29b28718300d4e2963ed9eb954dc
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
