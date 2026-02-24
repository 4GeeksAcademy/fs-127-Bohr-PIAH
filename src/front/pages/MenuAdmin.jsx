import React, { useState } from "react";
import NewUser from "../components/NewUser/New_User.jsx";
import NewDpto from "../components/NewDpto/New_Dpto.jsx";

export const MenuAdmin = () => {

    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [showNewDpto, setShowNewDpto] = useState(false);

    const handleCreateUser = () => setShowNewUserForm(true);
    const handleCreateDepartment = () => setShowNewDpto(true);

    const handleCancelNewDpto = () => setShowNewDpto(false);
    const handleSaveNewDpto = (data) => {
        console.log("Nuevo departamento creado:", data);
        setShowNewDpto(false);
    };

    const handleDptoClick = (dptoName) => {
        console.log("Entrar a:", dptoName);
    };

    return (
        <div className="home-wrapper">

            {/* TÍTULO PRINCIPAL */}
            <h2 className="view-title">Panel Administrativo</h2>

            {/* BOTONES SUPERIORES */}
            <div className="action-grid">
                <div className="action-item" onClick={handleCreateDepartment}>
                    <p>Crear nuevo Departamento</p>
                </div>

                <div className="action-item" onClick={handleCreateUser}>
                    <p>Crear nuevo Usuario</p>
                </div>
            </div>

            {/* PANEL CLARO */}
            <div className="projects-panel">

                {/* RECTÁNGULOS VERTICALES */}
                <div className="features-grid">

                    <div
                        className="project-rect"
                        onClick={() => handleDptoClick("Departamento uno")}
                    >
                        <svg width="60" height="60">
                            <circle cx="30" cy="30" r="25" stroke="var(--c-cyber)" strokeWidth="3" fill="none" />
                        </svg>
                        <p>Departamento uno</p>
                    </div>

                    <div
                        className="project-rect"
                        onClick={() => handleDptoClick("Departamento dos")}
                    >
                        <svg width="60" height="60">
                            <circle cx="30" cy="30" r="25" stroke="var(--c-cyber)" strokeWidth="3" fill="none" />
                        </svg>
                        <p>Departamento dos</p>
                    </div>

                    <div
                        className="project-rect"
                        onClick={() => handleDptoClick("Departamento tres")}
                    >
                        <svg width="60" height="60">
                            <circle cx="30" cy="30" r="25" stroke="var(--c-cyber)" strokeWidth="3" fill="none" />
                        </svg>
                        <p>Departamento tres</p>
                    </div>

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
