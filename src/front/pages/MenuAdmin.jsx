import React, { useState } from "react";
import NewUser from "../components/NewUser/New_User.jsx";
import NewDpto from "../components/NewDpto/New_Dpto.jsx";

export const MenuAdmin = () => {

    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [showNewDpto, setShowNewDpto] = useState(false);

    // Lista dinámica de departamentos
    const [departments, setDepartments] = useState([]);

    const handleCreateUser = () => setShowNewUserForm(true);
    const handleCreateDepartment = () => setShowNewDpto(true);

    const handleCancelNewDpto = () => setShowNewDpto(false);

    // Guardar nuevo departamento
    const handleSaveNewDpto = (data) => {
        setDepartments(prev => [
            ...prev,
            {
                name: data.department_name,
                lider: data.lider,
                staf: data.staf
            }
        ]);

        setShowNewDpto(false);
    };

    // Borrar departamento
    const deleteDepartment = (index) => {
        setDepartments(prev => prev.filter((_, i) => i !== index));
    };

    const handleDptoClick = (dptoName) => {
        console.log("Entrar a:", dptoName);
    };

    return (
        <div className="home-wrapper">

            <h2 className="welcome-text p-3">Panel Administrativo</h2>

            <div className="action-grid d-flex">
                <div className="sub-feature m-1" onClick={handleCreateDepartment} style={{ cursor: 'pointer' }}>
                    <p className="feature-title">
                        <p className="feature-description">Crear nuevo Departamento</p>
                    </p>
                </div>

                <div className="sub-feature m-1" onClick={handleCreateUser} style={{ cursor: 'pointer' }}>
                    <p className="feature-title">
                        <p className="feature-description">Crear nuevo Usuario</p>
                    </p>
                </div>
            </div>

            {/* LISTA DE DEPARTAMENTOS DINÁMICA */}
            <div className="projects-panel">
                <div className="features-grid">

                    {departments.map((dpto, index) => (
                        <div
                            key={index}
                            className="project-rect"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDptoClick(dpto.name)}
                        >
                            {/* Nombre */}
                            <p className="dept-title">{dpto.name}</p>

                            {/* Líder */}
                            <p className="section-label">Líder</p>
                            {dpto.lider?.map((person, i) => (
                                <p key={i} className="lider-item">• {person}</p>
                            ))}

                            {/* Equipo */}
                            <p className="section-label">Equipo</p>
                            {dpto.staf?.map((person, i) => (
                                <p key={i} className="staff-item">• {person}</p>
                            ))}

                            {/* Botón borrar */}
                            <button
                                className="delete-btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // evita abrir el departamento al borrar
                                    deleteDepartment(index);
                                }}
                            >
                                Borrar
                            </button>

                        </div>
                    ))}

                </div>
            </div>

            {/* MODAL NUEVO DEPARTAMENTO */}
            {showNewDpto && (
                <NewDpto
                    onCancel={handleCancelNewDpto}
                    onCreate={handleSaveNewDpto}
                />
            )}

            {/* MODAL NUEVO USUARIO */}
            {showNewUserForm && (
                <NewUser
                    onCancel={() => setShowNewUserForm(false)}
                    onCreate={(data) => {
                        console.log("Usuario creado:", data);
                        setShowNewUserForm(false);
                    }}
                />
            )}

        </div>
    );
};
