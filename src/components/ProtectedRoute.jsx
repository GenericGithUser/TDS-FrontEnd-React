import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mosaic } from "react-loading-indicators";

function ProtectedRoute( { children, allowedRoles } ){
    const { user, loading } = useAuth();

    if(loading){
        return (
          <>
            <div className="centered">
              <Mosaic size="large" color="#31a919" />
            </div>
          </>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    if (user.must_change_password === true) {
      return <Navigate to="/change-password" replace />;
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