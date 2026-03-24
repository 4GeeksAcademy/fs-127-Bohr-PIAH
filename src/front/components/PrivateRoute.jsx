import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PrivateRoute = ({ element, requiredRole }) => {
    const { store } = useGlobalReducer();

    if (!store.token) return <Navigate to="/login" replace />;

    if (requiredRole && store.user?.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return element;
};
