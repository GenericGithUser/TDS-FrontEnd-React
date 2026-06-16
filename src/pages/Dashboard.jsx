import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import '../styles/dashboard.css'

function Dashboard(){
    const { user } = useAuth();

    return (
      <>
        <div className="container">
          <Toolbar />
          <div className="boardHead">
            <h1 className="title">
              MAYNILAD{" "}
              <span className="green">RECORDS TRANSMISSION SYSTEM</span>
            </h1>
            <div className="board">
              <header>
                <h2 className="subtitle">
                  Hello <span className="userTitle">{user?.emp_name}</span>! 
                  {!user.is_admin && (
                    <>{""} from {""}
                  <span className="branchTitle">{user.office_dept}</span>
                  </>
                  )}
                </h2>
              </header>
              <Outlet />
            </div>
          </div>
        </div>
      </>
    );
}

export default Dashboard