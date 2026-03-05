import { useState } from "react";
import ModalProject from "../components/ModalProject/ModalProject";

// Estado inicial del proyecto
const initialProject = {
  nombre: "",
  wpDeadline: "",
  taskDeadline: "",
  users: [""],
  notificaciones: false,
  finalizado: false
};

export const MenuProjects = () => {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState(initialProject);

  // Cambios generales del formulario
  const handleChange = (field, value) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  // Usuarios dinámicos
  const onAddUser = () => {
    setProjectData(prev => ({
      ...prev,
      users: [...prev.users, ""]
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
      updated[index] = newValue;
      return { ...prev, users: updated };
    });
  };

  // Guardar proyecto
  const handleSaveProject = () => {
    setProjects(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...projectData
      }
    ]);

    setProjectData(initialProject);
    setShowModal(false);
  };

  // Borrar proyecto
  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Click en proyecto
  const handleProjectClick = (projectName) => {
    console.log("Entrar a:", projectName);
    // Aquí puedes navegar con React Router si quieres
    // navigate(`/project/${projectName}`);
  };

  return (
    <div className="home-wrapper">

      <h2 className="welcome-text p-3">Menú de mis proyectos</h2>

      <div className="action-grid d-flex">
        <div className="sub-feature m-1" style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)}>
          <div className="feature-title">Crear nuevo proyecto</div>
        </div>

        <div className="sub-feature m-1" style={{ cursor: 'pointer' }}>
          <p>Crear nuevo reporte</p>
        </div>
      </div>

      {/* LISTA DE PROYECTOS */}
      <div className="features-grid">
        {projects.map((project) => (
          <div className="project-rect" onClick={() => handleProjectClick(project)}>

            <h3 className="project-title">{project.nombre}</h3>

            <div className="project-section">
              <span className="project-label">Deadline WP</span>
              <span className="project-value">{project.wpDeadline || "Sin fecha"}</span>
            </div>

            <div className="project-section">
              <span className="project-label">Deadline Tareas</span>
              <span className="project-value">{project.taskDeadline || "Sin fecha"}</span>
            </div>

            <div className="project-section">
              <span className="project-label">Usuarios</span>
              <div className="project-users">
                {project.users.map((u, i) => (
                  <span key={i} className="project-value">• {u}</span>
                ))}
              </div>
            </div>

            <div className="project-section">
              <span className="project-label">Notificaciones</span>
              <span className="project-value">
                {project.notificaciones ? "Activadas" : "Desactivadas"}
              </span>
            </div>

            <div className="project-section">
              <span className="project-label">Estado</span>
              <span className="project-value">
                {project.finalizado ? "Finalizado" : "En progreso"}
              </span>
            </div>

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteProject(project.id);
              }}
            >
              Borrar
            </button>

          </div>

        ))}
      </div>

      {/* MODAL */}
      <ModalProject
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={projectData}
        onChange={handleChange}
        onAddUser={onAddUser}
        onDeleteUser={onDeleteUser}
        onChangeUser={onChangeUser}
        onSubmit={handleSaveProject}
      />

    </div>
  );
};
