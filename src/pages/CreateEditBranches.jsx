import '../styles/records.css'
import '../styles/createEdit.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigationData } from '../components/NavigationDataContext'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { GetBranch } from '../hooks/GetBranch';

function CreateEditBranches() {
    const { navData, clearRouteData } = useNavigationData();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [businessArea, setBusinessArea] = useState("");
    const { user } = useAuth();
    const {branchError, branchLoading, branches, createBranch, updateBranch} = GetBranch();
    

    const titlePrefix = 
          navData?.mode === "edit" ? "Edit":
          navData?.mode === "create" ? "Create": "No Nav Data";

    const pageTitle = `${titlePrefix} Branch`.trim();    
    
    
    
    if (!navData) {

      return <h1>No NavData</h1>;
    }

    if (user.usr_role !== "ADMIN") {
      navigate("/");
      return <h1>401 UNAUTHORIZED</h1>;
    }
    
    const createBranchData = () => {
      
      const branchData = {
        business_area: businessArea,
        office_dept: name
      };

      return branchData;
    }

    const handleSave = (e) => {
      e.preventDefault();
      const destination = navData.returnTo;
      const data = createBranchData();
      createBranch(data);
      clearRouteData(); // ✅ Clear ONLY after successful action
      navigate(destination); // Go back
    };

    const handleUpdate = (e) =>{
      e.preventDefault();

      let editData = {
        business_area: null,
        office_dept: null
      };
      if (navData?.data?.business_area.trim() !== businessArea.trim() && businessArea !== "") {
        editData.business_area = businessArea;
      }
      if (navData?.data?.office_dept.trim() !== name.trim() && name !== "") {
        editData.office_dept = name;
      }

      const destination = navData.returnTo;
      updateBranch(navData?.data?.branch_id, editData);
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
        setName(navData?.data?.office_dept);
        setBusinessArea(navData?.data?.business_area);
      },[]);
    }
    
    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <h1 className="ceTitle">
          {navData.mode === "create" && <>Create</>}
          {navData.mode === "edit" && <>Edit</>} Branch
        </h1>
        {navData.mode === "create" && (
          <div className="createBox">
            <form onSubmit={handleSave}>
              <div className="r2">
                <div className="item">
                  <label htmlFor="recName" className="recLabel expander">
                    Office Name:
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
              </div>
              <div className="r2">
                <div className="item">
                  <label htmlFor="businessArea" className="recLabel expander">
                    Business Area:
                  </label>
                  <input
                    type="text"
                    name="businessArea"
                    id="businessArea"
                    className="recInput"
                    value={businessArea}
                    onChange={(e) => setBusinessArea(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="r1">
                <div className="item"></div>
                <div className="item"></div>
              </div>
              <div className="buttonCont">
                <input
                  type="submit"
                  value="SAVE NEW BRANCH"
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
              <div className="r2">
                <div className="item">
                  <label htmlFor="recName" className="recLabel expander">
                    Office Name:
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
              </div>
              <div className="r2">
                <div className="item">
                  <label htmlFor="businessArea" className="recLabel expander">
                    Business Area:
                  </label>
                  <input
                    type="text"
                    name="businessArea"
                    id="businessArea"
                    className="recInput"
                    value={businessArea}
                    onChange={(e) => setBusinessArea(e.target.value)}
                    required
                  />
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

export default CreateEditBranches;