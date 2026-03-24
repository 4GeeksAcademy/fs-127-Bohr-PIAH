import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordService } from "../services/authService";

export const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
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
            <h2 className="view-title">Recovery Password</h2>
            <div className="login-box">
                <form className="cyber-form" onSubmit={handleSubmit}>

                    <label className="cyber-label">New Password</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showNew ? "text" : "password"}
                            className="cyber-input"
                            placeholder="********"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ paddingRight: "36px" }}
                            required
                        />
                        <button type="button" style={eyeStyle} onClick={() => setShowNew(v => !v)}>
                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <label className="cyber-label">Confirm New Password</label>
                    <div style={{ position: "relative" }}>
                        <input
                            type={showConfirm ? "text" : "password"}
                            className="cyber-input"
                            placeholder="********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ paddingRight: "36px" }}
                            required
                        />
                        <button type="button" style={eyeStyle} onClick={() => setShowConfirm(v => !v)}>
                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

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
