export const Login = () => {
  return (
    <div className="home-wrapper">

      {/* TÍTULO */}
      <h2 className="view-title">Login</h2>

      {/* PANEL DEL LOGIN */}
      <div className="login-panel">

        <form className="cyber-form">

          {/* Nombre */}
          <label className="cyber-label">Nombre</label>
          <input
            type="text"
            className="cyber-input"
            placeholder="Tu nombre"
          />

          {/* Correo */}
          <label className="cyber-label">Correo</label>
          <input
            type="email"
            className="cyber-input"
            placeholder="correo@ejemplo.com"
          />

          {/* Password */}
          <label className="cyber-label">Contraseña</label>
          <input
            type="password"
            className="cyber-input"
            placeholder="********"
          />

          {/* Botón */}
          <button type="submit" className="cyber-btn-success login-btn">
            Iniciar sesión
          </button>

        </form>

      </div>
    </div>
  );
};
