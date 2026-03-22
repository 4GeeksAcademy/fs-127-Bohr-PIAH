import React, { useState } from "react";
import "./CssAddUser.css";
import { toast } from "react-toastify";

export default function NewUser({ onCancel, onCreate }) {
    const [formData, setFormData] = useState({
        name: "",
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
            toast.error("Passwords do not match");
            return;
        }

        if (onCreate) onCreate(formData);
    };

    return (
        <div className="modal-cyber-overlay">
            <div className="modal-cyber-window">
                <form className="cyber-form" onSubmit={handleSubmit}>

                    <div className="cyber-field">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="cyber-field">
                        <label>Role</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="cyber-buttons">
                        <button
                            type="button"
                            className="btn-cyber-secondary"
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="btn-cyber-primary">
                            Crear
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
