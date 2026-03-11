import React from "react";
import { X } from "lucide-react";

const ModalWorkPackage = ({ isOpen, onClose, title, setTitle, onSubmit }) => {
    if (!isOpen) return null;

    return (

        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 100, backdropFilter: 'blur(4px)', borderRadius: '15px'
        }}>

            <div className="glass-card-yellow p-4 shadow-lg" style={{ width: '350px', border: '1px solid #27E6D6' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="text-white mb-0" style={{ fontSize: "1rem" }}>NEW WORK PACKAGE</h5>
                    <X size={20} className="text-info" style={{ cursor: "pointer" }} onClick={onClose} />
                </div>

                <input
                    type="text" className="form-control bg-dark text-white border-info mb-3 shadow-none" placeholder="WP Name (e.g. Design)" value={title}
                    onChange={(e) => setTitle(e.target.value)} autoFocus />

                <div className="d-flex gap-2 justify-content-end">
                    <button className="nav-login-cyber" style={{ padding: "5px 15px" }} onClick={onSubmit}>Create</button>
                </div>
            </div>
        </div>
    );
};

export default ModalWorkPackage;