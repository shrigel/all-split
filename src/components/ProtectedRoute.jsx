import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ condition, redirectTo = "/", children }) {
    if (!condition) {
        return <Navigate to={redirectTo} replace />;
    }
    return children;
}