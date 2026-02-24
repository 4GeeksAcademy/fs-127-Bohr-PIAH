import { DashboardNavbar } from "../components/DashboardNavbar";


export const Dashboard = () => {
    return (
        <div className="dashboard-page">
            <DashboardNavbar /> {/* Aquí colocas la pieza */}
            <div className="container mt-5">
                <h1>Bienvenido a tu Panel de Control</h1>
                <p>Aquí irán tus proyectos y desplegables...</p>
            </div>
        </div>
    );
};