import React, { useState } from "react";
import NewUser from "../components/NewUser/New_User.jsx";
import NewDpto from "../components/NewDpto/New_Dpto.jsx";

export const MenuAdmin = () => {
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewDpto, setShowNewDpto] = useState(false);

  const [departments, setDepartments] = useState([]);

  // Para edición
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const handleCreateUser = () => setShowNewUserForm(true);

  // Crear nuevo (abrir modal vacío)
  const handleCreateDepartment = () => {
    setEditingIndex(null);
    setEditingData(null);
    setShowNewDpto(true);
  };

  const handleCancelNewDpto = () => {
    setShowNewDpto(false);
    setEditingIndex(null);
    setEditingData(null);
  };

  // Guardar nuevo departamento
  const handleSaveNewDpto = (data) => {
    setDepartments(prev => [
      ...prev,
      {
        name: data.department_name,
        leader: data.leader,
        staf: data.staf
      }
    ]);
    setShowNewDpto(false);
  };

  // Guardar departamento editado
  const handleSaveEditedDpto = (data) => {
    setDepartments(prev => prev.map((d, i) => {
      if (i === editingIndex) {
        return {
          name: data.department_name,
          leader: data.leader,
          staf: data.staf
        };
      }
      return d;
    }));
    setEditingIndex(null);
    setEditingData(null);
    setShowNewDpto(false);
  };

  // Borrar departamento
  const deleteDepartment = (index) => {
    setDepartments(prev => prev.filter((_, i) => i !== index));
  };

  // Al hacer click en la tarjeta: abrir modal en modo edición
  const handleDptoClick = (index) => {
    const d = departments[index];
    setEditingIndex(index);
    setEditingData({
      department_name: d.name,
      leader: Array.isArray(d.leader) && d.leader.length ? d.leader : [""],
      staf: Array.isArray(d.staf) && d.staf.length ? d.staf : [""],
    });
    setShowNewDpto(true);
  };

  return (
    <div className="home-wrapper">
      <h2 className="welcome-text p-3">Menu Admin</h2>

      <div className="action-grid d-flex">
        <div className="sub-feature m-1" onClick={handleCreateDepartment} style={{ cursor: 'pointer' }}>
          <p className="feature-title">Add New Department</p>
        </div>

        <div className="sub-feature m-1" onClick={handleCreateUser} style={{ cursor: 'pointer' }}>
          <p className="feature-title">Add New User</p>
        </div>
      </div>

      {/* LISTA DE Dpto */}
      <div className="dpto-panel">
        <div className="dpto-section">
          {departments.map((dpto, index) => (
            <div
              key={index}
              className="dpto-rect"
              style={{ cursor: 'pointer' }}
              onClick={() => handleDptoClick(index)}
            >
              <h3 className="dpto-title">{dpto.name}</h3>
              
              <div className="personal-section">
                <p className="section-label">Leader</p>
                {dpto.leader?.map((person, i) => (
                  <p key={i} className="item-section">• {person}</p>))}
              </div>

              <div className="personal-section">
              <p className="section-label">Team</p>
              {dpto.staf?.map((person, i) => (
                <p key={i} className="item-section">• {person}</p>
              ))}
              </div>

                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // evita abrir el modal al borrar
                    deleteDepartment(index);
                  }}
                >
                  Delete
                </button>
              </div>
          ))}
        </div>
      </div>

      {/* Modal para crear o editar */}
      {showNewDpto && (
        <NewDpto
          onCancel={handleCancelNewDpto}
          onCreate={editingIndex === null ? handleSaveNewDpto : handleSaveEditedDpto}
          initialData={editingData}
          isEdit={editingIndex !== null}
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
  );
};
