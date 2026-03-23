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
            setMessage("Te hemos enviado un correo con las instrucciones");
        } catch (err) {
            setError(err.message || "Ha ocurrido un error");
        }
    };

    return (
        <div className="home-wrapper">
            <h2 className="view-title">Recuperar contraseña</h2>
            <div className="login-box">
                <form className="cyber-form" onSubmit={handleSubmit}>
                    <label className="cyber-label">Email</label>
                    <input
                        type="email"
                        className="cyber-input"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {message && <p style={{ color: "green" }}>{message}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit" className="cyber-btn-success login-btn">
                        Enviar correo
                    </button>
                </form>
            </div>
        </div>
    );
};