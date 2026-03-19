import React, { useState, useEffect } from "react";
import NewUser from "../components/NewUser/New_User.jsx";
import NewDpto from "../components/NewDpto/New_Dpto.jsx";
// Añadido por Paty
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getAllDepartments, createDepartment, deleteDepartment as deleteDepartmentService } from "../services/departmentService";

export const MenuAdmin = () => {
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewDpto, setShowNewDpto] = useState(false);

  // Añadido por Paty
  const { store, dispatch } = useGlobalReducer();

  // Añadido por Paty - carga departamentos del backend
  useEffect(() => {
    getAllDepartments(store.token).then(data => {
      dispatch({ type: "set_departments", payload: data });
    }).catch(err => console.error("Error cargando departamentos", err));
  }, [store.token]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const handleCreateUser = () => setShowNewUserForm(true);

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

  // Modificado por Paty - conectado al backend
  const handleSaveNewDpto = async (data) => {
    try {
      const result = await createDepartment(store.token, {
        name: data.department_name
      });
      if (result) {
        dispatch({ type: "set_departments", payload: [...store.departments, result] });
      }
    } catch (err) {
      console.error("Error creando departamento", err);
    }
    setShowNewDpto(false);
  };

  const handleSaveEditedDpto = (data) => {
    setEditingIndex(null);
    setEditingData(null);
    setShowNewDpto(false);
  };

  // Modificado por Paty - conectado al backend
  const deleteDepartment = async (index) => {
    const dpto = store.departments[index];
    try {
      await deleteDepartmentService(store.token, dpto.id);
      dispatch({ type: "set_departments", payload: store.departments.filter((_, i) => i !== index) });
    } catch (err) {
      console.error("Error borrando departamento", err);
    }
  };

  // Modificado por Paty - usa store.departments
  const handleDptoClick = (index) => {
    const d = store.departments[index];
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

      <div className="dpto-panel">
        <div className="dpto-section">
          {/* Modificado por Paty - usa store.departments */}
          {store.departments.map((dpto, index) => (
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
                  <p key={i} className="item-section">• {person}</p>
                ))}
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
                  e.stopPropagation();
                  deleteDepartment(index);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

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