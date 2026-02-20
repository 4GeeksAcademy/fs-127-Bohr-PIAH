export const Login = () => {
    
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">

          <h2 className="text-center mb-4">Login</h2>

          <form className="p-4 border rounded shadow-sm bg-white">

            {/* Nombre */}
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                placeholder="Tu nombre"
              />
            </div>

            {/* Correo */}
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                id="correo"
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="********"
              />
            </div>

            {/* Botón */}
            <button type="submit" className="btn btn-primary w-100">
              Iniciar sesión
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};
