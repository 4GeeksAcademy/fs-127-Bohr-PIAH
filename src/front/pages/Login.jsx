import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <div className="home-wrapper">

      <h2 className="view-title">Login</h2>

      {/* CONTENEDOR DEL LOGIN */}
      <div className="login-box">

        <form className="cyber-form">

          <label className="cyber-label">Correo</label>
          <input
            type="email"
            className="cyber-input"
            placeholder="correo@ejemplo.com"
          />

          <label className="cyber-label">Contraseña</label>
          <input
            type="password"
            className="cyber-input"
            placeholder="********"
          />

          <button type="submit" className="cyber-btn-success login-btn">
            Iniciar sesión
          </button>

          {/* LINK PARA CREAR USUARIO */}
          <p className="signup-link">
            ¿No tienes cuenta? <a href="/signup">Crear usuario</a>
          </p>

        </form>

      </div>
    </div>
  );
};
