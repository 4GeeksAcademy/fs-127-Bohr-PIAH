import React, { useState, useEffect } from "react";
import "./CssNewDpto.css";
import "./CssCardDpto.css";

export default function New_Dpto({ onCancel, onCreate, initialData = null, isEdit = false }) {
  const [formDpto, setFormDpto] = useState({
    department_name: "",
    leader: [""],
    staf: [""],
  });

  useEffect(() => {
    if (initialData) {
      setFormDpto({
        department_name: initialData.department_name || "",
        leader: Array.isArray(initialData.leader) && initialData.leader.length ? initialData.leader : [""],
        staf: Array.isArray(initialData.staf) && initialData.staf.length ? initialData.staf : [""],
      });
    }
  }, [initialData]);

  const handleChangeDpto = (e) => {
    setFormDpto({
      ...formDpto,
      department_name: e.target.value
    });
  };

  const handleStafChange = (index, value) => {
    const newStaf = [...formDpto.staf];
    newStaf[index] = value;
    setFormDpto({ ...formDpto, staf: newStaf });
  };

  const handleLiderChange = (index, value) => {
    const newLider = [...formDpto.leader];
    newLider[index] = value;
    setFormDpto({ ...formDpto, leader: newLider });
  };

  const addStaf = () => {
    setFormDpto({ ...formDpto, staf: [...formDpto.staf, ""] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Opcional: limpiar entradas vacías antes de enviar
    const cleaned = {
      department_name: formDpto.department_name.trim(),
      leader: formDpto.leader.filter(x => x && x.trim() !== "").map(x => x.trim()),
      staf: formDpto.staf.filter(x => x && x.trim() !== "").map(x => x.trim())
    };
    onCreate(cleaned);
  };

  return (
    <div className="modal-overlay-cyber">
      <div className="modal-cyber-box">
        <button className="modal-cyber-close" onClick={onCancel}>✕</button>
        <h3 className="modal-cyber-title">{isEdit ? "Edit Department" : "New Department"}</h3>

        <form className="cyber-form" onSubmit={handleSubmit}>
          <label className="cyber-label">Department name</label>
          <input
            type="text"
            className="cyber-input"
            value={formDpto.department_name}
            onChange={handleChangeDpto}
            required
          />

          <label className="cyber-label">Team leader</label>
          {formDpto.leader.map((person, index) => (
            <input
              key={index}
              type="text"
              className="cyber-input mb-2"
              value={person}
              onChange={(e) => handleLiderChange(index, e.target.value)}
              required
            />
          ))}

          <label className="cyber-label">Team</label>
          {formDpto.staf.map((person, index) => (
            <input
              key={index}
              type="text"
              className="cyber-input mb-2"
              value={person}
              onChange={(e) => handleStafChange(index, e.target.value)}
              required
            />
          ))}

          <button type="button" className="cyber-btn-success" onClick={addStaf}>Add member</button>

          <div className="modal-cyber-footer">
            <button type="button" className="cyber-btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="cyber-btn-success">{isEdit ? "Save" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
