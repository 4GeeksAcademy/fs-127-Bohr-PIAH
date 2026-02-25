import { useState } from "react";
import New_Dpto from "../components/NewDpto/New_Dpto";

export const MenuDptoProject = () => {

  const handleMenuDptoProject = () => {
    console.log("Crear nuevo Departamento");
  };

  const handleDptoProjectClick = (projectName) => {
    console.log("Entrar a:", projectName);
  };

  const [showModal, setShowModal] = useState(false);

  const [dptoData, setDptoData] = useState({
    departmentName: "",
  });

  const handleChange = (field, value) => {
    setDptoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="home-wrapper">

      {/* TÍTULO PRINCIPAL */}
      <h2 className="view-title">Menú de mis departamentos</h2>

      {/* BOTONES SUPERIORES */}
      <div className="action-grid">
        <div className="action-item" onClick={handleMenuDptoProject}>
          <p>Nuevo Departamento</p>
        </div>

        <div className="action-item" onClick={handleMenuDptoProject}>
          <p>Nuevo Reporte</p>
        </div>
      </div>

      {/* PANEL CLARO */}
      <div className="projects-panel">

        {/* RECTÁNGULOS VERTICALES */}
        <div className="features-grid">

          <div
            className="project-rect"
            onClick={() => {
              handleDptoProjectClick("Departamento uno");
              setShowModal(true);
            }}
          >
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="25" stroke="var(--c-cyber)" strokeWidth="3" fill="none" />
            </svg>
            <p>Departamento uno</p>
          </div>

          <div
            className="project-rect"
            onClick={() => {
              handleDptoProjectClick("Departamento dos");
              setShowModal(true);
            }}
          >
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="25" stroke="var(--c-cyber)" strokeWidth="3" fill="none" />
            </svg>
            <p>Departamento dos</p>
          </div>

          <div
            className="project-rect"
            onClick={() => {
              handleDptoProjectClick("Departamento tres");
              setShowModal(true);
            }}
          >
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="25" stroke="var(--c-cyber)" strokeWidth="3" fill="none" />
            </svg>
            <p>Departamento tres</p>
          </div>

        </div>

      </div>

      {/* MODAL CYBER */}
      {showModal && (
        <New_Dpto
          onCancel={() => setShowModal(false)}
          onCreate={(data) => {
            console.log("Departamento creado:", data);
            setShowModal(false);
          }}
        />
      )}


    </div>
  );
};
