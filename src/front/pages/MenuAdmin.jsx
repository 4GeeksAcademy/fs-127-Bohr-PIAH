import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
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
import { getAllUsers, updateUser } from "../services/userService";

export const MenuAdmin = () => {
  const { store, dispatch } = useGlobalReducer();

  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewDpto, setShowNewDpto] = useState(false);
  // Inicializar con store.users si ya están cargados (evita flash vacío al navegar)
  const [allUsers, setAllUsers] = useState(store.users || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState(null);

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

    // Cerrar modal primero (el botón desaparece) y luego recargar datos
    setEditingIndex(null);
    setEditingData(null);
    setShowNewDpto(false);
    reloadAll().catch(err => console.error("Error recargando datos", err));
  };

  const handleDeleteDepartment = async (index) => {
    const dpto = store.departments[index];
    if (!window.confirm(`¿Eliminar el departamento "${dpto.name}"?`)) return;
    try {
      await deleteDepartmentService(store.token, dpto.id);
      dispatch({ type: "set_departments", payload: store.departments.filter((_, i) => i !== index) });
    } catch (err) {
      console.error("Error borrando departamento", err);
      alert(err.message || "Error al eliminar el departamento.");
    }
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
      <div className="container-fluid px-md-4" style={{ paddingTop: "120px", paddingBottom: "60px" }}>

        <h2 className="section-sub-title text-center mb-4" style={{ color: "#27E6D6", letterSpacing: "3px", fontSize: "1.6rem" }}>
          MENU ADMIN
        </h2>

        <div className="d-flex justify-content-center gap-3 mb-5">
          <button className="nav-login-cyber" onClick={() => { setEditingIndex(null); setEditingData(null); setShowNewDpto(true); }}>
            Add New Department
          </button>
          <button className="nav-login-cyber" onClick={() => setShowNewUserForm(true)}>
            Add New User
          </button>
        </div>

        {/* GRID — 4 por fila */}
        <div className="row g-4">
          {store.departments.map((dpto, index) => {
            const headName = getHeadName(dpto);
            return (
              <div key={dpto.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="dpto-rect h-100 position-relative">

                  <div className="position-absolute d-flex gap-2" style={{ top: "12px", right: "12px" }}>
                    <button
                      title="Editar"
                      onClick={() => handleEditDpto(index)}
                      style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px", lineHeight: 1 }}
                    >
                      <Pencil size={15} color="#27E6D6" style={{ opacity: 0.7 }} />
                    </button>
                    <button
                      title="Eliminar"
                      onClick={() => handleDeleteDepartment(index)}
                      style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px", lineHeight: 1 }}
                    >
                      <Trash2 size={15} color="#ff4d4d" style={{ opacity: 0.7 }} />
                    </button>
                  </div>

                  <h3 className="dpto-title" style={{ paddingRight: "48px" }}>{dpto.name}</h3>

                  <div className="personal-section mt-2">
                    <p className="section-label" style={{ color: "#8be0ff", fontSize: "0.8rem", marginBottom: "4px" }}>Team Lead</p>
                    {headName
                      ? <p className="item-section mb-0">• {headName}</p>
                      : <span style={{ color: "#888", fontSize: "0.85rem" }}>No team lead assigned</span>
                    }
                  </div>

                </div>
              </div>
            );
          })}
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
          onCreate={() => setShowNewUserForm(false)}
        />
      )}
    </div>
  );
};
