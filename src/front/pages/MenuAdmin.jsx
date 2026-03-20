import React, { useState, useEffect } from "react";
import NewUser from "../components/NewUser/New_User.jsx";
import NewDpto from "../components/NewDpto/New_Dpto.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment as deleteDepartmentService, getDepartmentWithUsers } from "../services/departmentService";
import { getAllUsers, updateUser } from "../services/userService";

export const MenuAdmin = () => {
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewDpto, setShowNewDpto] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    if (!store.token) return;
    getAllDepartments(store.token)
      .then(data => dispatch({ type: "set_departments", payload: data }))
      .catch(err => console.error("Error cargando departamentos", err));
    getAllUsers(store.token)
      .then(data => setAllUsers(data))
      .catch(err => console.error("Error cargando usuarios", err));
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

  const reloadDepartments = async () => {
    const data = await getAllDepartments(store.token);
    dispatch({ type: "set_departments", payload: data });
  };

  const handleSaveNewDpto = async (data) => {
    try {
      // 1. Crear el departamento
      const result = await createDepartment(store.token, { name: data.department_name });

      // 2. Asignar usuarios al departamento
      await Promise.all(
        data.user_ids.map(uid => updateUser(store.token, uid, { department_id: result.id }))
      );

      // 3. Setear el team leader (requiere que el usuario ya esté en el departamento)
      if (data.head_id) {
        await updateDepartment(store.token, result.id, { head_id: data.head_id });
      }

      await reloadDepartments();
    } catch (err) {
      console.error("Error creando departamento", err);
    }
    setShowNewDpto(false);
  };

  const handleSaveEditedDpto = async (data) => {
    const deptId = editingData.id;
    const originalUserIds = editingData.original_user_ids || [];
    try {
      // 1. Añadir nuevos usuarios al departamento
      const added = data.user_ids.filter(id => !originalUserIds.includes(id));
      await Promise.all(added.map(uid => updateUser(store.token, uid, { department_id: deptId })));

      // 2. Actualizar nombre y head del departamento
      await updateDepartment(store.token, deptId, {
        name: data.department_name,
        head_id: data.head_id ?? null,
      });

      // 3. Quitar usuarios eliminados del departamento
      const removed = originalUserIds.filter(id => !data.user_ids.includes(id));
      await Promise.all(removed.map(uid => updateUser(store.token, uid, { department_id: null })));

      await reloadDepartments();
    } catch (err) {
      console.error("Error actualizando departamento", err);
    }
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

  const handleDptoClick = async (index) => {
    const d = store.departments[index];
    try {
      const deptWithUsers = await getDepartmentWithUsers(store.token, d.id);
      const userIds = (deptWithUsers.users || []).map(u => u.id);
      setEditingIndex(index);
      setEditingData({
        id: d.id,
        department_name: d.name,
        user_ids: userIds,
        head_id: d.head_id || null,
        original_user_ids: userIds,
      });
      setShowNewDpto(true);
    } catch (err) {
      console.error("Error cargando usuarios del departamento", err);
    }
  };

  const getHeadName = (dpto) => {
    if (!dpto.head_id) return null;
    const user = allUsers.find(u => u.id === dpto.head_id);
    return user ? `${user.first_name} ${user.last_name}` : null;
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
          {store.departments.map((dpto, index) => (
            <div
              key={index}
              className="dpto-rect"
              style={{ cursor: 'pointer' }}
              onClick={() => handleDptoClick(index)}
            >
              <h3 className="dpto-title">{dpto.name}</h3>

              {getHeadName(dpto) && (
                <div className="personal-section">
                  <p className="section-label">Leader</p>
                  <p className="item-section">• {getHeadName(dpto)}</p>
                </div>
              )}

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
          allUsers={allUsers}
          currentUser={store.user}
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