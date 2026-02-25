import { useState } from "react";
import ModalProject from "../components/ModalProject/ModalProject";

export const MenuProjects = () => {

  const [showModal, setShowModal] = useState(false);

  const [projectData, setProjectData] = useState({
    nombre: "",
    wpDeadline: "",
    taskDeadline: "",
    users: [{ value: "" }],
    notificaciones: false,
    finalizado: false
  });

  const handleChange = (field, value) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const onAddUser = () => {
    setProjectData(prev => ({
      ...prev,
      users: [...prev.users, { value: "" }]
    }));
  };

  const onDeleteUser = (index) => {
    setProjectData(prev => ({
      ...prev,
      users: prev.users.filter((_, i) => i !== index)
    }));
  };

  const onChangeUser = (index, newValue) => {
    setProjectData(prev => {
      const updated = [...prev.users];
      updated[index].value = newValue;
      return { ...prev, users: updated };
    });
  };

  return (
    <div className="home-wrapper">

      <h2 className="view-title">Menú de mis proyectos</h2>

      <div className="action-grid">
        <div className="action-item" onClick={() => setShowModal(true)}>
          <p>Crear nuevo proyecto</p>
        </div>

        <div className="action-item">
          <p>Crear nuevo reporte</p>
        </div>
      </div>

      {/* PROYECTOS EN RECTÁNGULOS VERTICALES */}
        <div className="features-grid">

          <div
            className="project-rect"
            onClick={() => {
              handleProjectClick("Proyecto uno");
              setShowModal(true);
            }}
          >
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="25" stroke="var(--c-cyber)" strokeWidth="3" fill="none" />
            </svg>
            <p>Proyecto uno</p>
          </div>

          <div
            className="project-rect"
            onClick={() => {
              handleProjectClick("Proyecto dos");
              setShowModal(true);
            }}
          >
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="25" stroke="var(--c-cyber)" strokeWidth="3" fill="none" />
            </svg>
            <p>Proyecto dos</p>
          </div>

          <div
            className="project-rect"
            onClick={() => {
              handleProjectClick("Proyecto tres");
              setShowModal(true);
            }}
          >
            <svg width="60" height="60">
              <circle cx="30" cy="30" r="25" stroke="var(--c-cyber)" strokeWidth="3" fill="none" />
            </svg>
            <p>Proyecto tres</p>
          </div>

        </div>

      <ModalProject
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={projectData}
        onChange={handleChange}
        onAddUser={onAddUser}
        onDeleteUser={onDeleteUser}
        onChangeUser={onChangeUser}
        onSubmit={() => console.log(projectData)}
      />

    </div>
  );
};
