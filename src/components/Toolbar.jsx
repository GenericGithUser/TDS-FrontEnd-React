import { useAuth } from '../context/AuthContext';
import '../styles/toolbar.css'
import { NavLink } from 'react-router-dom';
import { SlLogout } from "react-icons/sl";
import { FaCircleUser } from "react-icons/fa6";
import { BsBuildingsFill } from "react-icons/bs";
import { LuTicketX } from "react-icons/lu";



function Toolbar(){
    const { user, logout } = useAuth();
 
    return (
      <>
        <div className="toolBar">
          <div className="circle">
            <img src="/assets/mlogo.png" alt="logo" className="logo" />
          </div>
          <div className="nav">
            {user.role !== "admin" && (
              <>
                <NavLink to={"home"} className="aNavItem">
                  {({ isActive }) => (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#f3fdff"
                        className={isActive ? "navItem active" : "navItem"}
                      >
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                      </svg>
                      <p>Home</p>
                    </>
                  )}
                </NavLink>
                <NavLink to={"transmissions"} className="aNavItem">
                  {({ isActive }) => (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#f3fdff"
                        className={isActive ? "navItem active" : "navItem"}
                      >
                        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                      </svg>
                      <p>Trans- missions</p>
                    </>
                  )}
                </NavLink>
                <NavLink to={"records"} className="aNavItem">
                  {({ isActive }) => (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#f3fdff"
                        className={isActive ? "navItem active" : "navItem"}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
                          clipRule="evenodd"
                        />
                        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                      </svg>
                      <p>Records</p>
                    </>
                  )}
                </NavLink>
              </>
            )}
            {user.role === "admin" && (
              <>
                <NavLink to={"home"} className="aNavItem">
                  {({ isActive }) => (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#f3fdff"
                        className={isActive ? "navItem active" : "navItem"}
                      >
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                      </svg>
                      <p>Home</p>
                    </>
                  )}
                </NavLink>
                <NavLink to={"transmissions"} className="aNavItem">
                  {({ isActive }) => (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#f3fdff"
                        className={isActive ? "navItem active" : "navItem"}
                      >
                        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                      </svg>
                      <p>Trans- missions</p>
                    </>
                  )}
                </NavLink>
                <NavLink to={"users"} className="aNavItem">
                  {({ isActive }) => (
                    <>
                      <FaCircleUser
                        className={
                          isActive ? "expand navItem active" : "expand navItem"
                        }
                      />
                      <p>Users</p>
                    </>
                  )}
                </NavLink>
                <NavLink to={"branches"} className="aNavItem">
                  {({ isActive }) => (
                    <>
                      <BsBuildingsFill
                        className={
                          isActive ? "expand navItem active" : "expand navItem"
                        }
                      />
                      <p>Branches</p>
                    </>
                  )}
                </NavLink>
                <NavLink to={"tickets"} className="aNavItem">
                  {({ isActive }) => (
                    <>
                      <LuTicketX
                        className={
                          isActive ? "expand navItem active" : "expand navItem"
                        }
                      />
                      <p>Tickets</p>
                    </>
                  )}
                </NavLink>
              </>
            )}
          </div>
          <div className="logDiv">
            <SlLogout className="logout" onClick={logout} />
            <p className="logoutlbl">Log-out</p>
          </div>
        </div>
      </>
    );

}

export default Toolbar