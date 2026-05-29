import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute( { children, allowedRoles } ){
    const { user, loading } = useAuth();

    if(loading){
        return <>Loading</>
    }

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    if (
      allowedRoles &&
      !user.is_admin &&
      !allowedRoles.includes(user.usr_role)
    ) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute;