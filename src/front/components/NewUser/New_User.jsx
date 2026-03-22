import React, { useState } from "react";
import "./CssAddUser.css";
import { toast } from "react-toastify";

const ROLES = ["admin", "head", "staff", "guest"];

export default function NewUser({ onCancel, onCreate }) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.role) {
            toast.error("Please select a role");
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
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="cyber-field">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="cyber-field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="cyber-field">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="cyber-field">
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a role...</option>
                            {ROLES.map(r => (
                                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                            ))}
                        </select>
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
