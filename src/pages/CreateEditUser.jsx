import '../styles/records.css'
import '../styles/createEdit.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigationData } from '../components/NavigationDataContext'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { GetUsers } from '../hooks/GetUsers'
import { GetBranch } from '../hooks/GetBranch';

function CreateEditUser() {
    const { navData, clearRouteData } = useNavigationData();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [branch, setBranch] = useState("");
    const [position, setPosition] = useState("");
    const [role, setRole] = useState("PREPARER");
    const [email, setEmail] = useState("");
    const [checked, setChecked] = useState(true);
    const { user } = useAuth();
    const {loading, error, users, createUser, updateUser } = GetUsers();
    const {branchError, branchLoading, branches} = GetBranch();
    let branchID ; 
    

    const titlePrefix = 
          navData?.mode === "edit" ? "Edit":
          navData?.mode === "create" ? "Create": "No Nav Data";

    const pageTitle = `${titlePrefix} User`.trim();    
    
    
    
    if (!navData) {

      return <h1>No NavData</h1>;
    }

    if (user.usr_role !== "ADMIN") {
      navigate("/");
      return <h1>401 UNAUTHORIZED</h1>;
    }

    const createPassword = () => {
      const userName = name.trim().split(/\s+/).pop();
      const tempPassword = `${userName}123`;

      return tempPassword;
      
    }

    const handleBranchId = (value)=>{
      branchID = value;
      setBranch(value);
      console.log(branchID);
    }
    
    const createUserData = () => {
      
      const userData = {
        emp_name: name,
        emp_branch_id: parseInt(branch),
        email: email,
        password: createPassword(),
        role: role,
        position: position
        
      };

      return userData;
    }

    const handleSave = (e) => {
      e.preventDefault();
      const destination = navData.returnTo;
      const data = createUserData();
      createUser(data);
      clearRouteData(); // ✅ Clear ONLY after successful action
      navigate(destination); // Go back
    };

    const handleUpdate = (e) =>{
      e.preventDefault();

      let editData = {
        emp_name: null,
        emp_branch_id: null,
        email: null,
        password: null,
        role: null,
        position: null,
      };
      if (navData?.data?.emp_name.trim() !== name.trim() && name !== "") {
        editData.emp_name = name;
      }
      if (
        parseInt(navData?.data?.emp_branch_id) !== parseInt(branch) &&
        branch !== ""
      ) {
        editData.emp_branch_id = parseInt(branch);
      }
      if (navData?.data?.email.trim() !== email.trim() && email !== "") {
        editData.email = email;
      }
      if (navData?.data?.usr_role.trim() !== role.trim() && role !== "") {
        editData.role = role;
      }
      if (
        navData?.data?.position.trim() !== position.trim() &&
        position !== ""
      ) {
        editData.position = role;
      }
      if (checked === false) {
        editData.password = createPassword();
      }

      const destination = navData.returnTo;
      updateUser(navData?.data?.employee_id, editData);
      clearRouteData(); // ✅ Clear ONLY after successful action
      navigate(destination); // Go back

    }

    const handleCancel = () => {
      const destination = navData.returnTo;
      clearRouteData(); // ✅ Clear on cancel
      navigate(destination);
    };

    if (navData.mode === "edit") {
      useEffect(()=>{
        setName(navData?.data?.emp_name);
        setEmail(navData?.data?.email);
        setBranch(navData?.data?.emp_branch_id);
        setPosition(navData?.data?.position);
        setRole(navData?.data?.usr_role);
      },[]);

    }
    
    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <h1 className="ceTitle">
          {navData.mode === "create" && <>Create</>}
          {navData.mode === "edit" && <>Edit</>} User
        </h1>
        {navData.mode === "create" && (
          <div className="createBox">
            <form onSubmit={handleSave}>
              <div className="r1">
                <div className="item">
                  <label htmlFor="recName" className="recLabel">
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="recName"
                    className="recInput"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="item">
                  <label htmlFor="branchSelect" className="recLabel">
                    Branch/Office:
                  </label>
                  <select
                    name="branchSelect"
                    id="branchSelect"
                    className="recInput"
                    value={branch}
                    onChange={(e) => handleBranchId(e.target.value)}
                    required
                  >
                    <option value="">--Select A Branch--</option>
                    {branchLoading ? (
                      <option value="">Loading.....</option>
                    ) : branchError ? (
                      <option value="">{branchError.message}</option>
                    ) : (
                      branches.map((branch) => (
                        <option
                          value={branch.branch_id}
                        >{`${branch.office_dept} | ${branch.business_area}`}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div className="r1">
                <div className="item">
                  <label htmlFor="recEmail" className="recLabel">
                    Company Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="recEmail"
                    className="recInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="item itmSpecial">
                  <div className="item">
                    <label htmlFor="recRetPeriod" className="recLabel">
                      Role:
                    </label>
                    <select
                      name="roleSelect"
                      id="roleSelect"
                      className="recInput"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      {parseInt(branch) !== 500 && branch !== "" ? (
                        <>
                          <option value="">--Select A Role--</option>
                          <option value="PREPARER">PREPARER</option>
                          <option value="APPROVER">APPROVER</option>
                        </>
                      ) : parseInt(branch) === 500 ? (
                        <>
                          <option value="">--Select A Role--</option>
                          <option value="RECEIVER">RECEIVER</option>
                        </>
                      ) : (
                        <option value="">--Select A Branch First--</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
              <div className="r1">
                <div className="item itmSpecial">
                  <div className="item">
                    <label htmlFor="recRetPeriod" className="recLabel">
                      Position:
                    </label>
                    <input
                      type="text"
                      name="retPeriod"
                      id="recRetPeriod"
                      className="recInput"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="item">
                  <label className="recLabel lblSpecial">
                    Password would be Generated Automatically, (LastName+123)
                  </label>
                </div>
              </div>

              <div className="r1">
                <div className="item"></div>
                <div className="item"></div>
              </div>
              <div className="buttonCont">
                <input
                  type="submit"
                  value="SAVE NEW USER"
                  className="btnGreen"
                ></input>
                <button className="btnCancel" onClick={handleCancel}>
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}
        {navData.mode === "edit" && (
          <div className="createBox">
            <form onSubmit={handleUpdate}>
              <div className="r1">
                <div className="item">
                  <label htmlFor="recName" className="recLabel">
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="recName"
                    className="recInput"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="item">
                  <label htmlFor="branchSelect" className="recLabel">
                    Branch/Office:
                  </label>
                  <select
                    name="branchSelect"
                    id="branchSelect"
                    className="recInput"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                  >
                    <option value="">--Select A Branch--</option>
                    {branchLoading ? (
                      <option value="">Loading.....</option>
                    ) : branchError ? (
                      <option value="">{branchError.message}</option>
                    ) : (
                      branches.map((branch) => (
                        <option
                          value={branch.branch_id}
                        >{`${branch.office_dept} | ${branch.business_area}`}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div className="r1">
                <div className="item">
                  <label htmlFor="recEmail" className="recLabel">
                    Company Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="recEmail"
                    className="recInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="item itmSpecial">
                  <div className="item">
                    <label htmlFor="recRetPeriod" className="recLabel">
                      Role:
                    </label>
                    <select
                      name="roleSelect"
                      id="roleSelect"
                      className="recInput"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="PREPARER">PREPARER</option>
                      <option value="APPROVER">APPROVER</option>
                      <option value="RECEIVER">RECEIVER</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="r1">
                <div className="item itmSpecial">
                  <div className="item">
                    <label htmlFor="recRetPeriod" className="recLabel">
                      Position:
                    </label>
                    <input
                      type="text"
                      name="retPeriod"
                      id="recRetPeriod"
                      className="recInput"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="item">
                  <div className="item itemCentered">
                    <label className="recLabel" htmlFor="passRet">
                      Retain Old Password? :
                    </label>
                    <input
                      type="checkbox"
                      name="passRet"
                      id="passRet"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
              <div className="r1"></div>
              <div className="r1">
                <div className="item"></div>
                <div className="item"></div>
              </div>
              <div className="buttonCont">
                <input
                  type="submit"
                  value="SAVE EDITS"
                  className="btnGreen"
                ></input>
                <button className="btnCancel" onClick={handleCancel}>
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}
      </>
    );
}

export default CreateEditUser