import UserTable from '../components/UserTable';
import '../styles/records.css'
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

function Users(){
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const { user } = useAuth();

    if(user.usr_role !== "ADMIN"){
      const redirect = () => {
        navigate("/dashboard/home");
      }

      useEffect(() => {  
        setTimeout(redirect, 3000);

      }, [])

      return (
        <>
          <h1>You do not have Sufficient Permission to Access this page</h1>
          <h2>Redirecting to Home.......</h2>        
        </>
      );
    }

    const handleCreateUser = () => {
        const sendData = { mode: 'create', returnTo: "/dashboard/users", callback: ()=> console.log('Success') }
        setRouteData(sendData);
        navigate("create");

    }

    return (
      <>
        <Helmet>
          <title>Dashboard | Users</title>
        </Helmet>
        <div className="container3">
          <h2 className="green">Employees/Users</h2>
          <UserTable />
        </div>
          <div className="buttonCont">
            <button className="btnCancel" onClick={handleCreateUser}>
              CREATE NEW USER
            </button>
            
          </div>
      </>
    );
}

export default Users;