import React, { useState } from "react";
import "./CssNewDpto.css";

export default function New_Dpto({ onCancel, onCreate }) {
    const [formDpto, setFormDpto] = useState({
        department_name: "",
        lider: [""],
        staf: [""],
    });

    const handleChangeDpto = (e) => {
        setFormDpto({
            ...formDpto,
            department_name: e.target.value
        });
    };

    const handleStafChange = (index, value) => {
        const newStaf = [...formDpto.staf];
        newStaf[index] = value;

        setFormDpto({
            ...formDpto,
            staf: newStaf
        });
    };

    const handleLiderChange = (index, value) => {
        const newLider = [...formDpto.lider];
        newLider[index] = value;

        setFormDpto({
            ...formDpto,
            lider: newLider
        });
    };

    const addStaf = () => {
        setFormDpto({
            ...formDpto,
            staf: [...formDpto.staf, ""]
        });
    };

    const addLider = () => {
        setFormDpto({
            ...formDpto,
            lider: [...formDpto.lider, ""]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formDpto);
    };

    return (
        <div className="modal-overlay-cyber">
            <div className="modal-cyber-box">

                <button className="modal-cyber-close" onClick={onCancel}>
                    ✕
                </button>

                <h3 className="modal-cyber-title">Nuevo Departamento</h3>

                <form className="cyber-form" onSubmit={handleSubmit}>

                    {/* Nombre del departamento */}
                    <label className="cyber-label">Nombre del departamento</label>
                    <input
                        type="text"
                        className="cyber-input"
                        value={formDpto.department_name}
                        onChange={handleChangeDpto}
                        required
                    />

                    {/* Líder */}
                    <label className="cyber-label">Líder del equipo</label>

                    {formDpto.lider.map((person, index) => (
                        <input
                            key={index}
                            type="text"
                            className="cyber-input mb-2"
                            value={person}
                            onChange={(e) => handleLiderChange(index, e.target.value)}
                            required
                        />
                    ))}

                    {/* Staff */}
                    <label className="cyber-label">Team</label>

                    {formDpto.staf.map((person, index) => (
                        <input
                            key={index}
                            type="text"
                            className="cyber-input mb-2"
                            value={person}
                            onChange={(e) => handleStafChange(index, e.target.value)}
                            required
                        />
                    ))}

                    <button
                        type="button"
                        className="cyber-btn-success"
                        onClick={addStaf}
                    >
                        Agregar miembro
                    </button>

                    {/* Botones */}
                    <div className="modal-cyber-footer">
                        <button
                            type="button"
                            className="cyber-btn-secondary"
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="cyber-btn-success">
                            Crear
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
