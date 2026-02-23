import React, { useState } from "react";

export default function NewUser({ onCancel, onCreate }) {
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        password: "",
        confirmPassword: "",
        role: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        if (onCreate) onCreate(formData);
    };

    return (
        <div
            className="modal-overlay-modern"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
            }}
        >
            <div
                className="modal-modern"
                style={{
                    background: "white",
                    borderRadius: "12px",
                    width: "500px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    padding: "20px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                }}
            >
                <form className="p-3" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Lastname</label>
                        <input
                            type="text"
                            className="form-control"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label className="form-label">Role</label>
                        <input
                            type="text"
                            className="form-control"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        />

                    <div className="d-flex justify-content-between mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="btn btn-primary">
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
