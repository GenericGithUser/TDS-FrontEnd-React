import '../styles/records.css'
import '../styles/createEdit.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigationData } from '../components/NavigationDataContext'
import { Helmet } from 'react-helmet-async'

function CreateEditUser() {
    const { navData, clearRouteData } = useNavigationData();
    const navigate = useNavigate();

    const [checked, setChecked] = useState(true);

    console.log(navData);
    const titlePrefix = 
          navData?.mode === "edit" ? "Edit":
          navData?.mode === "create" ? "Create": "No Nav Data";

    const pageTitle = `${titlePrefix} User`.trim();      
    
    if (!navData) {

      return <h1>No NavData</h1>;
    }
    console.log(navData);
    
    const handleSave = () => {
      const destination = navData.returnTo;

      clearRouteData(); // ✅ Clear ONLY after successful action
      navigate(destination); // Go back
    };

    const handleCancel = () => {
      const destination = navData.returnTo;
      clearRouteData(); // ✅ Clear on cancel
      navigate(destination);
    };
    
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
            <form action="" id="createForm" method="post">
              <div className="r1">
                <div className="item">
                  <label htmlFor="recTitle" className="recLabel">
                    Existing Employee ID:
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="recTitle"
                    className="recInput"
                  />
                </div>
                <div className="item">
                  <label htmlFor="recCode" className="recLabel">
                    Branch/Office:
                  </label>
                  <input
                    type="text"
                    name="code"
                    id="recCode"
                    className="recInput"
                  />
                </div>
              </div>
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
                  />
                </div>
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
                    />
                  </div>
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
                  />
                </div>
                <div className="item">
                  <label className="recLabel lblSpecial">
                    Password would be Generated Automatically, a link would be
                    sent on the users email
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
                  onClick={handleSave}
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
            <form action="" id="createForm" method="post">
              <div className="r1">
                <div className="item">
                  <label htmlFor="recTitle" className="recLabel">
                    Existing Employee ID:
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="recTitle"
                    className="recInput"
                    defaultValue={navData.data.id}
                  />
                </div>
                <div className="item">
                  <label htmlFor="recCode" className="recLabel">
                    Branch/Office:
                  </label>
                  <input
                    type="text"
                    name="code"
                    id="recCode"
                    className="recInput"
                    defaultValue={navData.data.branch}
                  />
                </div>
              </div>
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
                    defaultValue={navData.data.name}
                  />
                </div>
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
                      defaultValue={navData.data.role}
                    />
                  </div>
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
                    defaultValue={navData.data.email}
                  />
                </div>
                <div className="item">
                  <label className="recLabel" htmlFor='passRet'>
                    Retain Old Password? : 
                  </label>
                  <input type="checkbox" name="passRet" id="passRet" checked={checked} onChange={(e)=> setChecked(e.target.checked)}/>
                </div>
              </div>
              <div className="r1">
                <div className="item"></div>
                <div className="item"></div>
              </div>
              <div className="buttonCont">
                <input
                  type="submit"
                  value="SAVE EDITS"
                  className="btnGreen"
                  onClick={handleSave}
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