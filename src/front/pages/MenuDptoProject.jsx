import { useState } from "react";
import New_Dpto from "../components/NewDpto/New_Dpto";

export const MenuDptoProject = () => {

  const [showModal, setShowModal] = useState(false);

  // Lista dinámica de departamentos
  const [departments, setDepartments] = useState([

  ]);

  const handleDptoProjectClick = (projectName) => {
    console.log("Entrar a:", projectName);
  };

  // Crear nuevo departamento desde el modal
  const handleCreateDpto = (data) => {
    setDepartments(prev => [
      ...prev,
      {
        name: data.department_name,
        staf: data.staf
      }
    ]);

    setShowModal(false);
  };

  // Borrar departamento
  const deleteDepartment = (index) => {
    setDepartments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="home-wrapper">

      <h2 className="welcome-text p-3">Menú de mis departamentos</h2>

      <div className="action-grid d-flex">
        <div className="sub-feature m-1"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowModal(true)}
        >
          <div className="feature-title">Nuevo Departamento
          </div>
        </div>

        <div
          className="sub-feature m-1"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowModal(true)}
        >
          <div className="feature-title">Crear Reporte
          </div>


        </div>
      </div>

      <div className="projects-panel">
        <div className="section-sub-title">

          {departments.map((dpto, index) => (
            <div key={index} className="project-rect">

              {/* Nombre del departamento */}
              <p
                style={{ cursor: "pointer", }}
                onClick={() => handleDptoProjectClick(dpto.name)}
              >
                {dpto.name}
              </p>

              {/* Staff */}
              <div>
                {dpto.staf.map((person, i) => (
                  <p key={i} className="staff-item">
                    • {person}
                  </p>
                ))}
              </div>

              {/* Botón borrar */}
              <button
                className="delete-btn"
                onClick={() => deleteDepartment(index)}
              >
                Borrar
              </button>

            </div>
          ))}

        </div>
      </div>

      {
        showModal && (
          <New_Dpto
            onCancel={() => setShowModal(false)}
            onCreate={handleCreateDpto}
          />
        )
      }

    </div >
  );
};
