import { useState } from "react";
import ModalProject from "../components/ModalProject/ModalProject";

export const MenuProjects = () => {

  const handleMenuProject = () => {
    console.log("Crear nuevo proyecto");
  };

  const handleProjectClick = (projectName) => {
    console.log("Entrar a:", projectName);
  };

  // Estado del modal
  const [showModal, setShowModal] = useState(false);

  // Estado del formulario del modal
  const [projectData, setProjectData] = useState({
    nombre: "",
    wpDeadline: "",
    taskDeadline: "",
    users: [],
    notificaciones: false,
    finalizado: false
  });

  // Función para actualizar campos del modal
  const handleChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container py-5">

      {/* ENCABEZADO SUPERIOR */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Menu de mis proyectos</h2>
        <div className="d-flex">

          <button className="btn btn-success m-1" onClick={handleMenuProject}>
            Crear nuevo proyecto
          </button>
          <button className="btn btn-warning m-1" onClick={handleMenuProject}>
            Crear nuevo Reporte
          </button>
        </div>
      </div>

      <div className="p-5"></div>

      {/* BOTONES DE PROYECTOS */}
      <div className="d-flex flex-column p-4 gap-2 bg-light rounded-4">

        <button
          className="btn btn-outline-primary py-3 fs-5 rounded-4"
          onClick={() => {
            handleProjectClick("Proyecto uno");
            setShowModal(true);
          }}
        >
          Proyecto uno
        </button>

        <button
          className="btn btn-outline-primary py-3 fs-5 rounded-4"
          onClick={() => {
            handleProjectClick("Proyecto dos");
            setShowModal(true);
          }}
        >
          Proyecto dos
        </button>

        <button
          className="btn btn-outline-primary py-3 fs-5 rounded-4"
          onClick={() => {
            handleProjectClick("Proyecto tres");
            setShowModal(true);
          }}
        >
          Proyecto tres
        </button>

      </div>

      {/* Render del modal */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            {showModal && (
              <ModalProject
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                data={projectData}
                onChange={handleChange}
                onAddUser={() => { }}
                onDeleteUser={() => { }}
                onSubmit={() => { }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
