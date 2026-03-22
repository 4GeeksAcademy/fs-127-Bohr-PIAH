import React, { useState, useEffect } from "react";
import NewUser from "../components/NewUser/New_User.jsx";
import NewDpto from "../components/NewDpto/New_Dpto.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getAllDepartments, createDepartment, deleteDepartment as deleteDepartmentService } from "../services/departmentService";
import { DashboardNavbar } from "../components/Dashboard/DashboardNavbar.jsx";
import UserListModal from "../components/NewUser/UserListModal.jsx";

export const MenuAdmin = () => {
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewDpto, setShowNewDpto] = useState(false);
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    getAllDepartments(store.token).then(data => {
      dispatch({ type: "set_departments", payload: data });
    }).catch(err => console.error("Error cargando departamentos", err));
  }, [store.token]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showUserList, setShowUserList] = useState(false);

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

  const deleteDepartment = async (index) => {
    const dpto = store.departments[index];
    try {
      await deleteDepartmentService(store.token, dpto.id);
      dispatch({ type: "set_departments", payload: store.departments.filter((_, i) => i !== index) });
    } catch (err) {
      console.error("Error borrando departamento", err);
    }
  };

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
    <>
      <DashboardNavbar />

      {/* Contenedor principal con paddingTop para que no lo tape el fixed-top */}
      <div className="home-wrapper" style={{ paddingTop: "150px" }}>
        <h2 className="welcome-text p-3">Menu Admin</h2>

        <div className="action-grid d-flex">
          <div className="sub-feature m-1" onClick={handleCreateDepartment} style={{ cursor: 'pointer' }}>
            <p className="feature-title">Add New Department</p>
          </div>

          <div className="sub-feature m-1" onClick={handleCreateUser} style={{ cursor: 'pointer' }}>
            <p className="feature-title">Add New User</p>
          </div>
          <div className="sub-feature m-1" onClick={() => setShowUserList(true)} style={{ cursor: 'pointer' }}>
            <p className="feature-title">User List</p>
          </div>

        </div>

        <div className="dpto-panel">
          <div className="dpto-section">
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
        {showUserList && (
          <UserListModal
            users={store.users}
            onClose={() => setShowUserList(false)}
          />
        )}

      </div>
    </>
  );
};
