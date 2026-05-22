import RecordTable from "../components/RecordTable";
import '../styles/records.css'
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

function Records(){
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const { user } = useAuth();

    const handleCreateRecord = () => {
        const sendData = { mode: 'create', returnTo: "/dashboard/records", callback: ()=> console.log('Success') }
        setRouteData(sendData);
        navigate("create");

    }

    return (
      <>
        <Helmet>
          <title>Dashboard | Records</title>
        </Helmet>
        <div className="container3">
          <h2 className="green">Records</h2>
          <RecordTable />
        </div>
        {user.role === "preparer" && (
          <div className="buttonCont">
            <button className="btnCancel" onClick={handleCreateRecord}>
              CREATE NEW RECORD
            </button>
            
          </div>
        )}
      </>
    );
}

export default Records