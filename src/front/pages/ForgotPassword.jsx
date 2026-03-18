import { useState } from "react";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Ha ocurrido un error");
                return;
            }

            setMessage("Te hemos enviado un correo con las instrucciones");

        } catch (err) {
            setError("Error de conexión con el servidor");
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