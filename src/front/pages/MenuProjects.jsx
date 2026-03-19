// ====== INICIO CAMBIOS PATY ======
import { useState, useEffect } from "react";
// ====== FIN CAMBIOS PATY ======
import ModalProject from "../components/ModalProject/ModalProject";
import useGlobalReducer from "../hooks/useGlobalReducer";
// ====== INICIO CAMBIOS PATY ======
import { getAllProjects, createProject, deleteProject as deleteProjectService } from "../services/projectService";
// ====== FIN CAMBIOS PATY ======

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
  const { store, dispatch } = useGlobalReducer();
  const [projectData, setProjectData] = useState(initialProject);
  const projects = store.projects || [];
  const [editingId, setEditingId] = useState(null);

  // ====== INICIO CAMBIOS PATY ======
  useEffect(() => {
    getAllProjects(store.token).then(data => {
      dispatch({ type: "set_projects", payload: data });
    }).catch(err => console.error("Error cargando proyectos", err));
  }, []);
  // ====== FIN CAMBIOS PATY ======

  const handleChange = (field, value) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const onChangeLeader = (value) => {
    setProjectData(prev => ({ ...prev, teamLeader: value }));
  };

  const onAddUser = () => {
    setProjectData(prev => ({ ...prev, users: [...prev.users, ""] }));
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

  // ====== INICIO CAMBIOS PATY ======
  const handleSaveProject = async () => {
    if (editingId) {
      dispatch({ type: 'edit_project', payload: { id: editingId, ...projectData } });
    } else {
      try {
        const data = await createProject(store.token, projectData);
        if (data) {
          dispatch({ type: "add_project", payload: data });
        }
      } catch (err) {
        console.error("Error creando proyecto", err);
      }
    }
    setProjectData(initialProject);
    setEditingId(null);
    setShowModal(false);
  };
  // ====== FIN CAMBIOS PATY ======

  // ====== INICIO CAMBIOS PATY ======
  const handleDeleteProject = async (id) => {
    try {
      await deleteProjectService(store.token, id);
      dispatch({ type: 'delete_project', payload: id });
    } catch (err) {
      console.error("Error borrando proyecto", err);
    }
  };
  // ====== FIN CAMBIOS PATY ======

  const handleProjectClick = (project) => {
    setProjectData(project);
    setEditingId(project.id);
    setShowModal(true);
  };

  return (
    <div className="home-wrapper">
      <h2 className="welcome-text p-3">My Projects</h2>

      <div className="action-grid d-flex">
        <div className="sub-feature m-1" style={{ cursor: 'pointer' }}
          onClick={() => { setProjectData(initialProject); setEditingId(null); setShowModal(true); }}>
          <div className="feature-title">New Project</div>
        </div>
        <div className="sub-feature m-1" style={{ cursor: 'pointer' }}>
          <p>New Report</p>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-rect" onClick={() => handleProjectClick(project)}>
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
            {/* ====== INICIO CAMBIOS PATY ====== */}
            <button className="delete-btn"
              onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}>
              Delete
            </button>
            {/* ====== FIN CAMBIOS PATY ====== */}
          </div>
        ))}
      </div>

      <ModalProject
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingId(null); setProjectData(initialProject); }}
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
