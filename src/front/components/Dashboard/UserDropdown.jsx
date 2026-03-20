import { CircleUser } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserDropdown = ({ onOpenProfile }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Si guardas un token en localStorage, lo borras aquí
        localStorage.removeItem("token");

        // Redirige al home
        navigate("/");
    };

    return (
        <div className="dropdown ms-2">
            <button 
                className="nav-login-cyber d-flex align-items-center justify-content-center"
                type="button"
                id="userMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ padding: "12px !important", minWidth: "45px", height: "45px", lineHeight: "0" }}
            >
                <CircleUser size={22} strokeWidth={1.5} />
            </button>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark shadow"
                aria-labelledby="userMenu"
                style={{ backgroundColor: "rgb(25, 28, 45)", border: "1px solid rgba(39, 230, 214, 0.2)", marginTop: "15px" }}
            >
                <li>
                    <button className="dropdown-item py-2" onClick={onOpenProfile}>
                        Profile Info
                    </button>
                </li>

                <li>
                    <button className="dropdown-item py-2">
                        Color Settings
                    </button>
                </li>

                <li>
                    <button className="dropdown-item py-2 text-danger fw-bold" onClick={handleLogout}>
                        Log Out
                    </button>
                </li>
            </ul>
        </div>
    );
};
