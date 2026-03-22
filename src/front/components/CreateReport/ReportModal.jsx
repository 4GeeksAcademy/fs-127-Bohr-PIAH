import React, { useState, useEffect } from "react";
import { getAllDepartments } from "../../services/departmentService";
import { getAllProjects } from "../../services/projectService";

export const ReportModal = ({ show, onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!show) return;

    const loadData = async () => {
      try {
        const dptos = await getAllDepartments(token);
        setDepartments(dptos);

        const projs = await getAllProjects(token);
        setProjects(projs);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    loadData();
  }, [show, token]);

  if (!show) return null;

  const download = async (url, filename) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error generando el reporte");

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (err) {
      alert("No se pudo generar el reporte");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <h2>Generar Reporte</h2>

        {/* ORGANIZACIÓN */}
        <button
          className="nav-login-cyber w-100 my-2"
          onClick={() =>
            download("/api/reports/organization", "organization_report.pdf")
          }
        >
          Reporte de Organización
        </button>

        {/* DEPARTAMENTO */}
        <div className="my-3">
          <select
            className="form-control mb-2"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Selecciona un departamento</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            className="nav-login-cyber w-100"
            disabled={!selectedDepartment}
            onClick={() =>
              download(
                `/api/reports/department/${selectedDepartment}`,
                `department_${selectedDepartment}_report.pdf`
              )
            }
          >
            Reporte de Departamento
          </button>
        </div>

        {/* PROYECTO */}
        <div className="my-3">
          <select
            className="form-control mb-2"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            className="nav-login-cyber w-100"
            disabled={!selectedProject}
            onClick={() =>
              download(
                `/api/reports/project/${selectedProject}`,
                `project_${selectedProject}_report.pdf`
              )
            }
          >
            Reporte de Proyecto
          </button>
        </div>

        <button className="close-btn mt-3" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};
