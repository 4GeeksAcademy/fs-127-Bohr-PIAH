import { useState } from "react";
import ModalProject from "../components/ModalProject/ModalProject";

export const MenuProjects = () => {

  const [showModal, setShowModal] = useState(false);

  // Lista dinámica de proyectos
  const [projects, setProjects] = useState([]);

  // Datos del modal
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

  // Guardar proyecto
  const handleSaveProject = () => {
    setProjects(prev => [
      ...prev,
      {
        nombre: projectData.nombre,
        wpDeadline: projectData.wpDeadline,
        taskDeadline: projectData.taskDeadline,
        users: projectData.users,
        notificaciones: projectData.notificaciones,
        finalizado: projectData.finalizado
      }
    ]);

    // Reset modal
    setProjectData({
      nombre: "",
      wpDeadline: "",
      taskDeadline: "",
      users: [{ value: "" }],
      notificaciones: false,
      finalizado: false
    });

    setShowModal(false);
  };

  // Borrar proyecto
  const deleteProject = (index) => {
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleProjectClick = (projectName) => {
    console.log("Entrar a:", projectName);
  };

  return (
    <div className="home-wrapper">

      <h2 className="welcome-text p-3">Menú de mis proyectos</h2>

      <div className="action-grid d-flex">
        <div className="sub-feature m-1" style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)}>
          <div className="feature-title">Crear nuevo proyecto</div>
        </div>

        <div className="sub-feature m-1" style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)}>
          <p>Crear nuevo reporte</p>
        </div>
      </div>

      {/* LISTA DINÁMICA DE PROYECTOS */}
      <div className="features-grid">

        {projects.map((project, index) => (
          <div
            key={index}
            className="project-rect"
            onClick={() => handleProjectClick(project.nombre)}
            style={{ cursor: 'pointer' }}
          >

            <p className="dept-title">{project.nombre}</p>

            <p className="section-label">Deadline WP</p>
            <p className="staff-item">{project.wpDeadline || "Sin fecha"}</p>

            <p className="section-label">Deadline Tareas</p>
            <p className="staff-item">{project.taskDeadline || "Sin fecha"}</p>

            <p className="section-label">Usuarios</p>
            {project.users.map((u, i) => (
              <p key={i} className="staff-item">• {u.value}</p>
            ))}

            <p className="section-label">Notificaciones</p>
            <p className="staff-item">{project.notificaciones ? "Activadas" : "Desactivadas"}</p>

            <p className="section-label">Estado</p>
            <p className="staff-item">{project.finalizado ? "Finalizado" : "En progreso"}</p>

            {/* BOTÓN BORRAR */}
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation(); // evita abrir el proyecto al borrar
                deleteProject(index);
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
