import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { loginService } from "../services/authService";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginService(email, password);
      dispatch({ type: "set_token", payload: data.token });
      dispatch({ type: "set_user", payload: data.user });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="home-wrapper">
      <h2 className="view-title">Login</h2>

      {/* CONTENEDOR DEL LOGIN */}
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

          <label className="cyber-label">Password</label>
          <input
            type="password"
            className="cyber-input"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className="cyber-btn-success login-btn">
            Iniciar sesión
          </button>

          {/* LINK PARA CREAR USUARIO */}
          <p className="signup-link">
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>

        </form>

      </div>
    </div>
  );
};
