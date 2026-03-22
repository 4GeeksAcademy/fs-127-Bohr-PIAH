import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../components/ModalProject/CssModalProject.css";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import NewUser from "../components/NewUser/New_User.jsx";
import NewDpto from "../components/NewDpto/New_Dpto.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer";
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment as deleteDepartmentService,
  getDepartmentWithUsers,
} from "../services/departmentService";
import { getAllUsers, updateUser, createUser, deleteUser } from "../services/userService";

export const MenuAdmin = () => {
  const { store, dispatch } = useGlobalReducer();

  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [confirm, setConfirm] = useState({ isOpen: false, message: "", onConfirm: null });
  const [showNewDpto, setShowNewDpto] = useState(false);
  const [allUsers, setAllUsers] = useState(store.users || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserData, setEditingUserData] = useState(null);
  const [savingUserId, setSavingUserId] = useState(null);

  const reloadAll = async () => {
    const [depts, users] = await Promise.all([
      getAllDepartments(store.token),
      getAllUsers(store.token),
    ]);
    dispatch({ type: "set_departments", payload: depts });
    dispatch({ type: "set_users", payload: users }); // persiste en el store para próximas navegaciones
    setAllUsers(users);
  };

  useEffect(() => {
    if (!store.token) return;
    reloadAll().catch(err => console.error("Error cargando datos", err));
  }, [store.token]);

  const handleCreateUser = async (data) => {
    try {
      await createUser(store.token, data);
      setShowNewUserForm(false);
      await reloadAll();
      toast.success("User created successfully");
    } catch (err) {
      if (err.message === "USER_ALREADY_EXISTS") {
        toast.error("This user already exists.");
      } else {
        toast.error(err.message || "Error creating user");
      }
    }
  };

  const handleCancelNewDpto = () => {
    setShowNewDpto(false);
    setEditingIndex(null);
    setEditingData(null);
  };

  // Lanza errores para que New_Dpto los capture en su finally
  const handleSaveNewDpto = async (data) => {
    const result = await createDepartment(store.token, { name: data.department_name });

    await Promise.all(
      data.user_ids.map(uid => updateUser(store.token, uid, { department_id: result.id }))
    );

    if (data.head_id) {
      await updateDepartment(store.token, result.id, { head_id: data.head_id });
    }

    // Cerrar modal primero (el botón desaparece) y luego recargar datos
    setShowNewDpto(false);
    await reloadAll();
  };

  const handleSaveEditedDpto = async (data) => {
    const deptId = editingData.id;
    const originalUserIds = editingData.original_user_ids || [];

    // 1. Añadir nuevos miembros primero
    const added = data.user_ids.filter(id => !originalUserIds.includes(id));
    await Promise.all(added.map(uid => updateUser(store.token, uid, { department_id: deptId })));

    // 2. Actualizar departamento (nombre y head) antes de quitar miembros
    await updateDepartment(store.token, deptId, {
      name: data.department_name,
      head_id: data.head_id ?? null,
    });

    // 3. Quitar miembros eliminados al final
    const removed = originalUserIds.filter(id => !data.user_ids.includes(id));
    await Promise.all(removed.map(uid => updateUser(store.token, uid, { department_id: null })));

    // Actualizar tarjeta inmediatamente con los nuevos datos
    dispatch({
      type: "set_departments",
      payload: store.departments.map(d =>
        d.id === deptId ? { ...d, name: data.department_name, head_id: data.head_id ?? null } : d
      ),
    });

    setEditingIndex(null);
    setEditingData(null);
    setShowNewDpto(false);
    await reloadAll();
  };

  const handleDeleteDepartment = (index) => {
    const dpto = store.departments[index];
    setConfirm({
      isOpen: true,
      message: `Delete department "${dpto.name}"?`,
      onConfirm: async () => {
        setConfirm(c => ({ ...c, isOpen: false }));
        try {
          await deleteDepartmentService(store.token, dpto.id);
          dispatch({ type: "set_departments", payload: store.departments.filter((_, i) => i !== index) });
        } catch (err) {
          console.error("Error borrando departamento", err);
          toast.error(err.message || "Error deleting the department.");
        }
      }
    });
  };

  const handleEditDpto = async (index) => {
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
      console.error("Error cargando departamento", err);
    }
  };

  const handleDeleteUser = (u) => {
    setConfirm({
      isOpen: true,
      message: `Delete user "${u.first_name} ${u.last_name}"?`,
      onConfirm: async () => {
        setConfirm(c => ({ ...c, isOpen: false }));
        try {
          await deleteUser(store.token, u.id);
          setEditingUserId(null);
          setEditingUserData(null);
          await reloadAll();
          toast.success("User deleted successfully");
        } catch (err) {
          toast.error(err.message || "Error deleting user");
        }
      }
    });
  };

  const handleEditUser = (u) => {
    setEditingUserId(u.id);
    setEditingUserData({ first_name: u.first_name, last_name: u.last_name, email: u.email, role: u.role, department_id: u.department_id ?? null });
  };

  const handleSaveUser = async () => {
    setSavingUserId(editingUserId);
    try {
      const originalUser = allUsers.find(u => u.id === editingUserId);
      await updateUser(store.token, editingUserId, editingUserData);

      const newDeptId = editingUserData.department_id || null;
      const oldDeptId = originalUser?.department_id || null;
      const newRole = editingUserData.role;
      const oldRole = originalUser?.role;

      // Si ahora es head con departamento → asignarlo como team lead
      if (newRole === "head" && newDeptId) {
        await updateDepartment(store.token, newDeptId, { head_id: editingUserId });
      }

      // Si antes era head de otro departamento → limpiar ese head_id
      if (oldRole === "head" && oldDeptId && oldDeptId !== newDeptId) {
        const oldDept = store.departments.find(d => d.id === oldDeptId);
        if (oldDept?.head_id === editingUserId) {
          await updateDepartment(store.token, oldDeptId, { head_id: null });
        }
      }

      // Si dejó de ser head en su mismo departamento → limpiar head_id
      if (oldRole === "head" && newRole !== "head" && oldDeptId) {
        const oldDept = store.departments.find(d => d.id === oldDeptId);
        if (oldDept?.head_id === editingUserId) {
          await updateDepartment(store.token, oldDeptId, { head_id: null });
        }
      }

      await reloadAll();
      setEditingUserId(null);
      setEditingUserData(null);
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(err.message || "Error updating user");
    } finally {
      setSavingUserId(null);
    }
  };

  const getHeadName = (dpto) => {
    if (!dpto.head_id) return null;
    const u = allUsers.find(u => u.id === dpto.head_id);
    return u ? `${u.first_name} ${u.last_name}` : null;
  };

  return (
    <div className="home-wrapper v1" style={{ minHeight: "100vh" }}>

      {/* NAVBAR */}
      <nav
        className="navbar navbar-dark fixed-top"
        style={{ backgroundColor: "rgb(19, 22, 37)", borderBottom: "1px solid rgba(39, 230, 214, 0.1)", padding: "8px 0" }}
      >
        <div className="container-fluid px-md-4">
          <Link
            to="/dashboard"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
          >
            <div className="atom-nav-container" style={{ width: "80px", height: "80px" }}>
              <svg viewBox="0 0 120 120" className="atom-nav" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="10" className="nucleus-glow" />
                <circle cx="60" cy="60" r="10" className="nucleus" />
                <g className="orbit">
                  <path id="adm-p1" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" fill="none" />
                  <circle r="4" className="electron" fill="var(--c-nuc)">
                    <animateMotion dur="2s" repeatCount="indefinite" rotate="auto"><mpath href="#adm-p1" /></animateMotion>
                  </circle>
                </g>
                <g className="orbit" transform="rotate(60 60 60)">
                  <path id="adm-p2" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" fill="none" />
                  <circle r="4" className="electron" fill="var(--c-nuc)">
                    <animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto" begin="-0.5s"><mpath href="#adm-p2" /></animateMotion>
                  </circle>
                </g>
                <g className="orbit" transform="rotate(-60 60 60)">
                  <path id="adm-p3" d="M12,60 a48,25 0 1,0 96,0 a48,25 0 1,0 -96,0" className="orbit-path" strokeWidth="2" fill="none" />
                  <circle r="4" className="electron" fill="var(--c-nuc)">
                    <animateMotion dur="2.2s" repeatCount="indefinite" rotate="auto" begin="-1s"><mpath href="#adm-p3" /></animateMotion>
                  </circle>
                </g>
              </svg>
            </div>
            <span className="wellcome-text ms-2" style={{ fontSize: "1.2rem", textShadow: "0 0 10px var(--c-nuc)", color: "var(--c-nuc)" }}>
              BOHR
            </span>
          </Link>
        </div>
      </nav>

      {/* CONTENIDO */}
      <div className="container-fluid px-md-4" style={{ paddingTop: "90px", paddingBottom: "60px" }}>

        <h2 className="section-sub-title text-center" style={{ color: "#27E6D6", letterSpacing: "3px", fontSize: "1.6rem", marginBottom: "32px" }}>
          MENU ADMIN
        </h2>

        {/* DOS COLUMNAS */}
        <div className="row g-4" style={{ alignItems: "flex-start" }}>

          {/* IZQUIERDA — Usuarios (1/3) */}
          <div className="col-4">
            <div className="d-flex justify-content-center mb-3">
              <button className="nav-login-cyber" onClick={() => setShowNewUserForm(true)}>
                Add New User
              </button>
            </div>
            <div className="glass-card-yellow p-3" style={{ height: "65vh", display: "flex", flexDirection: "column" }}>
              <h3 className="section-sub-title mb-3" style={{ fontSize: "0.85rem", letterSpacing: "2px", color: "#27E6D6", flexShrink: 0 }}>
                USERS
              </h3>
              <input
                type="text"
                className="cyber-input"
                placeholder="Search user..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                style={{ width: "100%", padding: "6px 10px", fontSize: "0.82rem", marginBottom: "10px", flexShrink: 0 }}
              />
              <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                {[...allUsers]
                  .sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`))
                  .filter(u => `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase()))
                  .map(u => {
                    const dept = store.departments.find(d => d.id === u.department_id);
                    const deptName = dept ? dept.name : "No department";
                    const roleName = u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : "—";
                    const isEditing = editingUserId === u.id;
                    const isSaving = savingUserId === u.id;
                    return (
                      <div key={u.id} style={{ borderBottom: "1px solid rgba(39,230,214,0.1)", padding: "8px 4px" }}>
                        {isEditing ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <input className="cyber-input" style={{ flex: 1, fontSize: "0.78rem", padding: "4px 8px" }}
                                value={editingUserData.first_name}
                                onChange={e => setEditingUserData({ ...editingUserData, first_name: e.target.value })}
                                placeholder="Name" />
                              <input className="cyber-input" style={{ flex: 1, fontSize: "0.78rem", padding: "4px 8px" }}
                                value={editingUserData.last_name}
                                onChange={e => setEditingUserData({ ...editingUserData, last_name: e.target.value })}
                                placeholder="Last name" />
                            </div>
                            <input className="cyber-input" style={{ fontSize: "0.78rem", padding: "4px 8px" }}
                              value={editingUserData.email}
                              onChange={e => setEditingUserData({ ...editingUserData, email: e.target.value })}
                              placeholder="Email" />
                            <div style={{ display: "flex", gap: "6px" }}>
                              <select className="cyber-input" style={{ flex: 1, fontSize: "0.78rem", padding: "4px 8px" }}
                                value={editingUserData.role}
                                onChange={e => setEditingUserData({ ...editingUserData, role: e.target.value })}>
                                <option value="admin">Admin</option>
                                <option value="head">Head</option>
                                <option value="staff">Staff</option>
                                <option value="guest">Guest</option>
                              </select>
                              <select className="cyber-input" style={{ flex: 1, fontSize: "0.78rem", padding: "4px 8px" }}
                                value={editingUserData.department_id ?? ""}
                                onChange={e => setEditingUserData({ ...editingUserData, department_id: e.target.value ? Number(e.target.value) : null })}>
                                <option value="">No department</option>
                                {store.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                              </select>
                            </div>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button className="cyber-btn-primary" style={{ flex: 1, marginTop: 0 }}
                                onClick={handleSaveUser} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save"}
                              </button>
                              <button className="cyber-btn-secondary" style={{ flex: 1, marginTop: 0 }}
                                onClick={() => { setEditingUserId(null); setEditingUserData(null); }}>
                                Cancel
                              </button>
                              <button className="cyber-btn-danger" style={{ flex: 1, marginTop: 0 }}
                                onClick={() => handleDeleteUser(u)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "0.82rem", color: "white", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {u.first_name} {u.last_name}
                              <span style={{ color: "rgba(255,255,255,0.35)" }}> — </span>
                              <span style={{ color: "#8be0ff" }}>{deptName}</span>
                              <span style={{ color: "rgba(255,255,255,0.35)" }}> — </span>
                              <span style={{ color: "#27E6D6" }}>{roleName}</span>
                            </span>
                            <button onClick={() => handleEditUser(u)}
                              style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px", lineHeight: 1, flexShrink: 0, marginLeft: "6px" }}>
                              <Pencil size={13} color="#27E6D6" style={{ opacity: 0.6 }} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                {allUsers.length === 0 && (
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>No users found.</p>
                )}
              </div>
            </div>
          </div>

          {/* DERECHA — Departamentos (2/3) */}
          <div className="col-8">
            <div className="d-flex justify-content-center mb-3">
              <button className="nav-login-cyber" onClick={() => { setEditingIndex(null); setEditingData(null); setShowNewDpto(true); }}>
                Add New Department
              </button>
            </div>
            <div className="glass-card-yellow p-3" style={{ minHeight: "65vh" }}>
              <h3 className="section-sub-title mb-3" style={{ fontSize: "0.85rem", letterSpacing: "2px", color: "#27E6D6" }}>
                DEPARTMENTS
              </h3>
              <div className="row g-3">
                {store.departments.map((dpto, index) => {
                  const headName = getHeadName(dpto);
                  return (
                    <div key={dpto.id} className="col-4">
                      <div className="dpto-rect h-100 position-relative">
                        <div className="position-absolute d-flex gap-2" style={{ top: "12px", right: "12px" }}>
                          <button title="Editar" onClick={() => handleEditDpto(index)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px", lineHeight: 1 }}>
                            <Pencil size={15} color="#27E6D6" style={{ opacity: 0.7 }} />
                          </button>
                          <button title="Eliminar" onClick={() => handleDeleteDepartment(index)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px", lineHeight: 1 }}>
                            <Trash2 size={15} color="#ff4d4d" style={{ opacity: 0.7 }} />
                          </button>
                        </div>
                        <h3 className="dpto-title" style={{ paddingRight: "48px" }}>{dpto.name}</h3>
                        <div className="personal-section mt-2">
                          <p className="section-label" style={{ color: "#8be0ff", fontSize: "0.8rem", marginBottom: "4px" }}>Team Lead</p>
                          {headName
                            ? <p className="item-section mb-0">• {headName}</p>
                            : <span style={{ color: "#888", fontSize: "0.85rem" }}>No team lead assigned</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

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
          onCreate={handleCreateUser}
        />
      )}
    <ConfirmModal
      isOpen={confirm.isOpen}
      message={confirm.message}
      onConfirm={confirm.onConfirm}
      onCancel={() => setConfirm(c => ({ ...c, isOpen: false }))}
    />
    </div>
  );
};
