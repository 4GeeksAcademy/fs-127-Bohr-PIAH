import { useState } from "react";
import "./CssModalProject.css";
import "./CssCard.css";

export default function ModalProject({
  isOpen,
  onClose,
  title = "Add New Project",
  data,
  isEdit,
  onDeleteProject,
  onChange,
  onAddUser,
  onDeleteUser,
  onChangeUser,
  onChangeLeader,
  onSubmit,
  users = []
}) {
  if (!isOpen) return null;

  const {
    nombre,
    wpDeadline,
    taskDeadline,
    users: selectedUsers = [],
    teamLeader = null
  } = data || {};

  // Estado para el buscador del líder
  const [leaderSearch, setLeaderSearch] = useState("");
  const [showLeaderSuggestions, setShowLeaderSuggestions] = useState(false);

  // Estado para los buscadores de cada usuario de la lista
  const [userSearches, setUserSearches] = useState({});
  const [showUserSuggestions, setShowUserSuggestions] = useState({});

  // Obtiene el nombre completo de un usuario por ID
  const getUserName = (id) => {
    const user = users.find(u => u.id === id);
    return user ? `${user.first_name} ${user.last_name}` : "";
  };

  // Filtra usuarios por búsqueda, excluyendo los IDs ya seleccionados
  const filterUsers = (search, excludeIds = []) =>
    users.filter(u =>
      !excludeIds.includes(u.id) &&
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase())
    );

  const leaderName = getUserName(teamLeader);

  // Estilo compartido para el dropdown de sugerencias
  const dropdownStyle = {
    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999,
    background: "#1a1a2e", border: "1px solid #27E6D6", borderRadius: "4px",
    listStyle: "none", margin: 0, padding: 0, maxHeight: "150px", overflowY: "auto"
  };

  const suggestionItemStyle = { padding: "8px 12px", cursor: "pointer", color: "#e0e0e0", borderBottom: "1px solid #2a2a4a" };

  return (
    <div className="modal-cyber-overlay" onClick={onClose}>
      <div className="modal-cyber-container" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-cyber-title">{title}</h3>

        <label className="cyber-label">Project</label>
        <input
          className="cyber-input"
          type="text"
          value={nombre}
          onChange={(e) => onChange("nombre", e.target.value)}
        />

        <label className="cyber-label">Start Project</label>
        <input
          className="cyber-input"
          type="date"
          value={wpDeadline}
          onChange={(e) => onChange("wpDeadline", e.target.value)}
        />

        <label className="cyber-label">End Project</label>
        <input
          className="cyber-input"
          type="date"
          value={taskDeadline}
          onChange={(e) => onChange("taskDeadline", e.target.value)}
        />

        {/* --- TEAM LEADER CON AUTOCOMPLETE --- */}
        <h4 className="cyber-subtitle">Team Leader</h4>
        <div className="cyber-user-item">
          <div style={{ position: "relative", flex: 1 }}>

            {teamLeader && leaderName ? (
              <div className="cyber-input d-flex justify-content-between align-items-center">
                <span>{leaderName}</span>
                <span
                  onClick={() => { onChangeLeader(null); setLeaderSearch(""); }}
                  style={{ cursor: "pointer", color: "#ff4d4d", fontWeight: "bold" }}
                >✕</span>
              </div>
            ) : (
              <input
                className="cyber-input"
                type="text"
                placeholder="Search leader..."
                value={leaderSearch}
                onChange={(e) => { setLeaderSearch(e.target.value); setShowLeaderSuggestions(true); }}
                onFocus={() => setShowLeaderSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLeaderSuggestions(false), 150)}
              />
            )}

            {showLeaderSuggestions && filterUsers(leaderSearch).length > 0 && (
              <ul style={dropdownStyle}>
                {filterUsers(leaderSearch).map(user => (
                  <li
                    key={user.id}
                    onMouseDown={() => { onChangeLeader(user.id); setLeaderSearch(""); setShowLeaderSuggestions(false); }}
                    style={suggestionItemStyle}
                    onMouseEnter={e => e.currentTarget.style.background = "#27E6D620"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {user.first_name} {user.last_name}
                    <span style={{ fontSize: "0.75rem", color: "#888", marginLeft: "8px" }}>{user.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* --- USERS CON AUTOCOMPLETE --- */}
        <h4 className="cyber-subtitle">Users</h4>
        <div className="cyber-user-list">
          {selectedUsers.map((userId, i) => (
            <div key={i} className="cyber-user-item">
              <div style={{ position: "relative", flex: 1 }}>

                {userId && getUserName(userId) ? (
                  <div className="cyber-input d-flex justify-content-between align-items-center">
                    <span>{getUserName(userId)}</span>
                    <span
                      onClick={() => { onChangeUser(i, null); setUserSearches({ ...userSearches, [i]: "" }); }}
                      style={{ cursor: "pointer", color: "#ff4d4d", fontWeight: "bold" }}
                    >✕</span>
                  </div>
                ) : (
                  <input
                    className="cyber-input"
                    type="text"
                    placeholder="Search user..."
                    value={userSearches[i] || ""}
                    onChange={(e) => {
                      setUserSearches({ ...userSearches, [i]: e.target.value });
                      setShowUserSuggestions({ ...showUserSuggestions, [i]: true });
                    }}
                    onFocus={() => setShowUserSuggestions({ ...showUserSuggestions, [i]: true })}
                    onBlur={() => setTimeout(() => setShowUserSuggestions({ ...showUserSuggestions, [i]: false }), 150)}
                  />
                )}

                {showUserSuggestions[i] && filterUsers(userSearches[i] || "", selectedUsers.filter((_, idx) => idx !== i)).length > 0 && (
                  <ul style={dropdownStyle}>
                    {filterUsers(userSearches[i] || "", selectedUsers.filter((_, idx) => idx !== i)).map(user => (
                      <li
                        key={user.id}
                        onMouseDown={() => {
                          onChangeUser(i, user.id);
                          setUserSearches({ ...userSearches, [i]: "" });
                          setShowUserSuggestions({ ...showUserSuggestions, [i]: false });
                        }}
                        style={suggestionItemStyle}
                        onMouseEnter={e => e.currentTarget.style.background = "#27E6D620"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {user.first_name} {user.last_name}
                        <span style={{ fontSize: "0.75rem", color: "#888", marginLeft: "8px" }}>{user.email}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button className="cyber-btn-danger" onClick={() => onDeleteUser(i)}>✖</button>
            </div>
          ))}
        </div>

        <button className="cyber-btn-outline" style={{ width: "100%", marginTop: "10px" }} onClick={onAddUser}>
          Add User
        </button>

        <div className="modal-cyber-footer mt-4 d-flex justify-content-between align-items-center">
          <div>
            {isEdit && (
              <button
                className="cyber-btn-danger"
                onClick={() => {
                  if (window.confirm("¿Estás seguro de eliminar este proyecto?")) {
                    onDeleteProject();
                  }
                }}
              >
                Delete Project
              </button>
            )}
          </div>
          <div className="d-flex gap-2">
            <button className="cyber-btn-outline" onClick={onClose}>Cancel</button>
            <button className="cyber-btn" onClick={onSubmit}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
