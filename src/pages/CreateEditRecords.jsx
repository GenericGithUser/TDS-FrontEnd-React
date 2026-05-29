import '../styles/records.css'
import '../styles/createEdit.css'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigationData } from '../components/NavigationDataContext'
import { Helmet } from 'react-helmet-async'

function CreateEditRecord() {
    const { navData, clearRouteData } = useNavigationData();
    const navigate = useNavigate();

    const titlePrefix = 
          navData.mode === "edit" ? "Edit":
          navData.mode === "create" ? "Create": "No Nav Data";

    const pageTitle = `${titlePrefix} Record`.trim();      
    
    if (!navData) {

      return <h1>No NavData</h1>;
    }

    
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
          <title>
            {pageTitle}
          </title>
        </Helmet>
        <h1 className="ceTitle">
          {navData.mode === "create" && <>Create</>}
          {navData.mode === "edit" && <>Edit</>} Record
        </h1>
        {navData.mode === "create" && (
          <div className="createBox">
            <form action="" id="createForm" method="post">
              <div className="r1">
                <div className="item">
                  <label htmlFor="recTitle" className="recLabel">
                    Title:
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
                    Code:
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
                <div className="item itmSpecial">
                  <div className="item">
                    <label htmlFor="recDesc" className="recLabel">
                      Description:
                    </label>
                    <textarea
                      type="text"
                      name="desc"
                      id="recDesc"
                      className="recInput special"
                      maxLength="300"
                    ></textarea>
                  </div>
                  <div className="item">
                    <label htmlFor="recChkItems" className="recLabel">
                      Checklist Items:{" "}
                      <p className="subtext">Use Comma(,) to delimit</p>
                    </label>
                    <input
                      type="text"
                      name="chkItems"
                      id="recChkItems"
                      className="recInput"
                    />
                  </div>
                </div>
                <div className="item itmSpecial">
                  <div className="item">
                    <label htmlFor="recRetPeriod" className="recLabel">
                      Retention Period:
                    </label>
                    <input
                      type="text"
                      name="retPeriod"
                      id="recRetPeriod"
                      className="recInput"
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="recRemarks" className="recLabel">
                      Remarks:
                    </label>
                    <input
                      type="text"
                      name="remarks"
                      id="recRemarks"
                      className="recInput special"
                    />
                  </div>
                </div>
              </div>
              <div className="r1">
                <div className="item"></div>
                <div className="item"></div>
              </div>
              <div className="buttonCont">
                <input
                  type="submit"
                  defaultValue="CREATE NEW RECORD"
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
                    Title:
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="recTitle"
                    className="recInput"
                    defaultValue={navData?.data?.record_titles}
                  />
                </div>
                <div className="item">
                  <label htmlFor="recCode" className="recLabel">
                    Code:
                  </label>
                  <input
                    type="text"
                    name="code"
                    id="recCode"
                    className="recInput"
                    defaultValue={navData?.data?.rec_code}
                  />
                </div>
              </div>
              <div className="r1">
                <div className="item itmSpecial">
                  <div className="item">
                    <label htmlFor="recDesc" className="recLabel">
                      Description:
                    </label>
                    <textarea
                      type="text"
                      name="desc"
                      id="recDesc"
                      className="recInput special"
                      maxLength="300"
                      defaultValue={navData?.data?.rec_description}
                    ></textarea>
                  </div>
                  <div className="item">
                    <label htmlFor="recChkItems" className="recLabel">
                      Checklist Items:{" "}
                      <p className="subtext">Use Comma(,) to delimit</p>
                    </label>
                    <input
                      type="text"
                      name="chkItems"
                      id="recChkItems"
                      className="recInput"
                      defaultValue={navData?.data?.checkList.join(",")}
                    />
                  </div>
                </div>
                <div className="item itmSpecial">
                  <div className="item">
                    <label htmlFor="recRetPeriod" className="recLabel">
                      Retention Period:
                    </label>
                    <input
                      type="text"
                      name="retPeriod"
                      id="recRetPeriod"
                      className="recInput"
                      defaultValue={navData?.data?.retention_period}
                    />
                  </div>
                  <div className="item">
                    <label htmlFor="recRemarks" className="recLabel">
                      Remarks:
                    </label>
                    <input
                      type="text"
                      name="remarks"
                      id="recRemarks"
                      className="recInput special"
                      defaultValue={navData?.data?.remarks}
                    />
                  </div>
                </div>
              </div>
              <div className="r1">
                <div className="item"></div>
                <div className="item"></div>
              </div>
              <div className="buttonCont">
                <input
                  type="submit"
                  defaultValue="CREATE NEW RECORD"
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

export default CreateEditRecord