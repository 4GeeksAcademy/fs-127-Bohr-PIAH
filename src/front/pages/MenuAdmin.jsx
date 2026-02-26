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
            <h2 className="welcome-text p-3">Panel Administrativo</h2>

            {/* BOTONES SUPERIORES */}
            <div className="action-grid d-flex">
                <div className="feature-item m-1" onClick={handleCreateDepartment} style={{ cursor: 'pointer' }}>
                    <p className="feature-title">
                        <p className="feature-description"> 
                            Crear nuevo Departamento
                        </p>
                    </p>
                </div>

                <div className="feature-item m-1" onClick={handleCreateUser} style={{ cursor: 'pointer' }}>
                    <p className="feature-title">
                        <p className="feature-description">
                            Crear nuevo Usuario
                        </p>
                    </p>
                </div>
            </div>

            {/* PANELES POR DEPARTAMENTO*/}
            <div className="projects-panel">

                {/* RECTÁNGULOS VERTICALES */}
                <div className="features-grid">
                    
                    <div className="project-rect" onClick={() => handleDptoClick("Departamento uno")} style={{ cursor: 'pointer' }}>
                        <p>Departamento uno</p>
                    </div>

                    <div className="project-rect" onClick={() => handleDptoClick("Departamento dos")}  style={{ cursor: 'pointer' }}>
                        <p>Departamento dos</p>
                    </div>

                    <div className="project-rect" onClick={() => handleDptoClick("Departamento tres")}  style={{ cursor: 'pointer' }}>
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
