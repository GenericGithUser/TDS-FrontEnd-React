import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import '../styles/dashboard.css'

function Dashboard(){
    const { user } = useAuth();

    return(
        <>
            <div className="container">
                <Toolbar />
                <div className="board">
                    <header>
                        <h1 className="title">MAYNILAD <span className="green">RECORDS TRANSMISSION SYSTEM</span></h1>
                        <h2 className="subtitle">Hello <span className="userTitle">{user?.name}</span>! from <span className="branchTitle">{user.branch}</span></h2>
                    </header>
                    <Outlet />
                </div>
                
            </div>
        </>
    )
}

export default Dashboard