import { useState } from "react";
import { forgotPasswordService } from "../services/authService";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await forgotPasswordService(email);
            setMessage("We have sent you an email with the instructions");
        } catch (err) {
            setError(err.message || "An error occurred");
        }
    };

    return (
        <div className="home-wrapper">
            <h2 className="view-title">Forgot Password</h2>
            <div className="login-box">
                <form className="cyber-form" onSubmit={handleSubmit}>
                    <label className="cyber-label">Email</label>
                    <input
                        type="email"
                        className="cyber-input"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {message && <p style={{ color: "green" }}>{message}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit" className="cyber-btn-success login-btn">
                        Send Email
                    </button>
                </form>
            </div>
        </div>
    );
};