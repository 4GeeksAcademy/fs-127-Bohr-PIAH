import React, { useState } from "react";
import "../components/Signup/Signup.css";
import { toast } from "react-toastify";

export const Signup = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    emailConfirm: "",
    password: "",
    passwordConfirm: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.email !== formData.emailConfirm) {
      toast.error("Emails do not match");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("User registered successfully");
  };

  return (
    <div className="home-wrapper">
      <h2 className="view-title">Registrar Nuevo Usuario</h2>

      <form onSubmit={handleSubmit} className="signup-form">

        <div className="form-group-cyber">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-cyber">
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-cyber">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-cyber">
          <label>Confirmación de Email</label>
          <input
            type="email"
            name="emailConfirm"
            value={formData.emailConfirm}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-cyber">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group-cyber">
          <label>Verifique su Contraseña</label>
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-cyber">
          Registrar
        </button>
      </form>
    </div>
  );
};
