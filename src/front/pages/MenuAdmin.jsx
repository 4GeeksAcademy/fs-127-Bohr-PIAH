import React, { useState } from "react";
import NewUser from "../components/NewUser/New_User.jsx";
import NewDpto from "../components/NewDpto/New_Dpto.jsx";

export const MenuAdmin = () => {

    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [showNewDpto, setShowNewDpto] = useState(false);

    // Botón: Crear nuevo usuario
    const handleCreateUser = () => {
        setShowNewUserForm(true);
    };

    // Botón: Crear nuevo departamento
    const handleCreateDepartment = () => {
        setShowNewDpto(true);
    };

    const handleCancelNewDpto = () => {
        setShowNewDpto(false);
    };

    const handleSaveNewDpto = (data) => {
        console.log("Nuevo departamento creado:", data);
        setShowNewDpto(false);
    };

    const handleDptoClick = (dptoName) => {
        console.log("Entrar a:", dptoName);
    };

    return (
        <div className="container py-5">
            {/* ENCABEZADO SUPERIOR */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0">Panel Administrativo</h2>

                <div className="d-flex">
                    <button className="btn btn-success m-1" onClick={handleCreateDepartment}>
                        Crear nuevo Departamento
                    </button>

                    

                    <button className="btn btn-success m-1" onClick={handleCreateUser}>
                        Crear nuevo usuario
                    </button>
                </div>
            </div>

            <div className="p-5"></div>

            {/* BOTONES DE PROYECTOS */}
            <div className="d-flex flex-row p-4 gap-3 bg-light rounded-4">
                <button
                    className="btn btn-outline-primary py-4 px-5 fs-5 rounded-4 flex-fill"
                    onClick={() => handleDptoClick("Departamento uno")}
                >
                    Departamento uno
                </button>

                <button
                    className="btn btn-outline-primary py-4 px-5 fs-5 rounded-4 flex-fill"
                    onClick={() => handleDptoClick("Departamento uno")}
                >
                    Departamento uno
                </button>

                <button
                    className="btn btn-outline-primary py-4 px-5 fs-5 rounded-4 flex-fill"
                    onClick={() => handleDptoClick("Departamento uno")}
                >
                    Departamento uno
                </button>
            </div>

            {/* FORMULARIO DE CREACIÓN DE USUARIO */}
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">

                        {showNewDpto && (
                        <NewDpto
                            onCancel={handleCancelNewDpto}
                            onCreate={handleSaveNewDpto}
                        />
                        )}




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
                </div>
            </div>
        </div>
    );
};
