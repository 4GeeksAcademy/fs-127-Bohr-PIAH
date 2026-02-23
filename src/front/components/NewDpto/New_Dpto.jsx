import React, { useState } from "react";

export default function New_Dpto({ onCancel, onCreate }) {
    const [formDpto, setFormDpto] = useState({
        department_name: "",
        staf: [""],
    });

    // Maneja cambios del nombre del departamento
    const handleChangeDpto = (e) => {
        setFormDpto({
            ...formDpto,
            department_name: e.target.value
        });
    };

    // Maneja cambios en cada input del array staf
    const handleStafChange = (index, value) => {
        const newStaf = [...formDpto.staf];
        newStaf[index] = value;

        setFormDpto({
            ...formDpto,
            staf: newStaf
        });
    };

    // Agrega un nuevo campo de staff
    const addStaf = () => {
        setFormDpto({
            ...formDpto,
            staf: [...formDpto.staf, ""]
        });
    };

    // Envía el formulario completo
    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formDpto); // envías los datos al padre
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
                        <label className="form-label">Name Department</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formDpto.department_name}
                            onChange={handleChangeDpto}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Staff</label>

                        {formDpto.staf.map((person, index) => (
                            <input
                                key={index}
                                type="text"
                                className="form-control mb-2"
                                value={person}
                                onChange={(e) => handleStafChange(index, e.target.value)}
                                required
                            />
                        ))}

                        <button
                            type="button"
                            className="btn btn-primary mt-2"
                            onClick={addStaf}
                        >
                            Agregar otro
                        </button>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="btn btn-success">
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
