import TransTable from "../components/TransTable"
import '../styles/transmissions.css'
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";


function Transmissions(){

    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const { user } = useAuth();
    const handleCreateTrans = () => {
      const sendData = {
        mode: "create",
        returnTo: "/dashboard/transmissions",
      };
      setRouteData(sendData);
      navigate("create");
    };
    return (
      <>
        <Helmet>
          <title>Dashboard | Transmissions</title>
        </Helmet>
        <div className="container2">
          <h2 className="green">Transmissions</h2>
          <TransTable />
        </div>
        {user.role === "preparer" && (
          <button
            className="btnCancel restrictWidth"
            onClick={handleCreateTrans}
          >
            Send A Transmission
          </button>
        )}
      </>
    );
}
export default Transmissions