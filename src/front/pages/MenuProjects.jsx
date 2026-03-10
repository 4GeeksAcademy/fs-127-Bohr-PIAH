import { useState } from "react";
import ModalProject from "../components/ModalProject/ModalProject";
import { useContext } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer"; 



// Estado inicial del proyecto
const initialProject = {
  nombre: "",
  startproject: "",
  endproject: "",
  teamLeader: "",
  users: []
};

export const MenuProjects = () => {
  const [showModal, setShowModal] = useState(false);
  const { store, dispatch } = useContext(Context);
  const [projectData, setProjectData] = useState(initialProject);

  // Saber si estamos editando
  const [editingId, setEditingId] = useState(null);

  // Cambios generales del formulario
  const handleChange = (field, value) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  // Lider
  const onChangeLeader = (value) => {
    setProjectData(prev => ({
      ...prev,
      teamLeader: value
    }));
  };

  // Usuarios 
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

  // Guardar proyecto (crear o editar)
  const handleSaveProject = () => {
    if (editingId) {

      // MODO EDICIÓN: Enviamos una acción de editar 
      dispatch({
        type: 'edit_project',
        payload: { id: editingId, ...projectData }
      });
    } else {
      // MODO CREACIÓN: Usamos la que ya creamos tú y yo
      dispatch({
        type: 'add_project',
        payload: { id: crypto.randomUUID(), ...projectData }
      });
    }

    // Reset
    setProjectData(initialProject);
    setEditingId(null);
    setShowModal(false);
  };

  // Borrar proyecto
  const deleteProject = (id) => {
    dispatch({
      type: 'delete_project',
      payload: id
    });
  };

  // Click en proyecto → editar
  const handleProjectClick = (project) => {
    setProjectData(project);   // cargar datos en el modal
    setEditingId(project.id);  // activar modo edición
    setShowModal(true);
  };

  return (
    <div className="home-wrapper">

      <h2 className="welcome-text p-3">My Projects</h2>

      <div className="action-grid d-flex">
        <div
          className="sub-feature m-1"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setProjectData(initialProject);
            setEditingId(null);
            setShowModal(true);
          }}
        >
          <div className="feature-title">New Project</div>
        </div>

        <div className="sub-feature m-1" style={{ cursor: 'pointer' }}>
          <p>New Report</p>
        </div>
      </div>

      {/* LISTA DE PROYECTOS */}
      <div className="projects-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-rect"
            onClick={() => handleProjectClick(project)}
          >

            <h3 className="project-title">{project.nombre}</h3>

            <div className="project-section">
              <span className="project-label">Start Project</span>
              <span className="project-value">{project.wpDeadline || "Sin fecha"}</span>
            </div>

            <div className="project-section">
              <span className="project-label">End Project</span>
              <span className="project-value">{project.taskDeadline || "Sin fecha"}</span>
            </div>

            <div className="project-section">
              <span className="project-label">Leader</span>
              <span className="project-value">• {project.teamLeader || "Sin líder"}</span>
            </div>

            <div className="project-section">
              <span className="project-label">Users</span>
              <div className="project-users">
                {project.users.map((u, i) => (
                  <span key={i} className="project-value">• {u}</span>
                ))}
              </div>
            </div>

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteProject(project.id);
              }}
            >
              Delete
            </button>

          </div>
        ))}
      </div>

      {/* MODAL */}
      <ModalProject
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingId(null);
          setProjectData(initialProject);
        }}
        title={editingId ? "Edit Project" : "Add New Project"}
        data={projectData}
        onChange={handleChange}
        onAddUser={onAddUser}
        onDeleteUser={onDeleteUser}
        onChangeUser={onChangeUser}
        onChangeLeader={onChangeLeader}
        onSubmit={handleSaveProject}
      />

    </div>
  );
};
