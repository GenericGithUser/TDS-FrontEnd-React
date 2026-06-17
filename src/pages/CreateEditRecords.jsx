import '../styles/records.css'
import '../styles/createEdit.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigationData } from '../components/NavigationDataContext'
import { useAuth } from '../context/AuthContext'
import { Helmet } from 'react-helmet-async'
import { GetRecords } from '../hooks/GetRecords'
import '../styles/loading.css'
import toast from 'react-hot-toast'

function CreateEditRecord() {
    const { navData, clearRouteData, setRouteData } = useNavigationData();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [checklist, setChecklist] = useState('');
    const [retPeriod, setRetPeriod] = useState('');
    const [code, setCode] = useState('');
    const [remark, setRemarks] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();
    const { records, loading, error, createRecord, updateRecord} = GetRecords();
    const branchCode = user.branch_code;
    

    const isEdit = navData?.mode === "edit";
    const titlePrefix = isEdit
      ? "Edit"
      : navData?.mode === "create"
        ? "Create"
        : "No Nav Data";

    const pageTitle = `${titlePrefix} Record`.trim();      
    
    if (!navData) {

      return <h1>No NavData</h1>;
    }

    
    const handleSave = () => {
      const destination = navData.returnTo;
      
      const recordData = {records_title: title, rec_description: description, rec_code: code, retention_period: retPeriod, remarks: remark}
      const checklistItems = checklist.split(',');
      createRecord(recordData, checklistItems);
      clearRouteData(); // ✅ Clear ONLY after successful action
      navigate(destination); // Go back
    };

    const checkFirst = (e) => {
      e.preventDefault();
      if (branchCode === code.trim() || branchCode.length > code.length) {
        toast.error("Code must have Values!");
        return;
      } else {
        handleSave();
      }
    };
    const handleUpdate = () => {
      let origItems = navData?.checklistData.map((i) => i.checklist_item);
      const destination = navData.returnTo;
      const recordData = {
        records_title: title,
        rec_description: description,
        rec_code: code,
        retention_period: retPeriod,
        remarks: remark,
      };
      const availItems = checklist.split(","); 
      const removedItems = origItems.filter(
        item=>!availItems.includes(item)
      );

      const addedItems = availItems.filter(
          item=> !origItems.includes(item)
      );

      const updatedChecklist = navData.checklistData.filter(
          item => !removedItems.includes(item.checklist_item)
      );

      addedItems.forEach(item => {
        updatedChecklist.push({
          chk_record_id: navData.checklistData[0]?.chk_record_id,
          checklist_id: null, // DB will generate this
          checklist_item: item
        });
      });

      
    //  console.log("🎯 Calling updateRecord with:", {
    //     recordData: { recordData /* ... */ },
    //     checklistItems: updatedChecklist, // ← Your actual checklist state variable
    //     checklistStateLength: updatedChecklist?.length,
    //     firstItem: updatedChecklist?.[0],
    //   });
      updateRecord(navData.recordId, recordData, updatedChecklist);  
      if (navData.fromTransEdit) {
        const sendData = {
          mode: "edit",
          data: navData.data,
          transId: navData.trans_id,
          returnTo: "/dashboard/home",
        };
        setRouteData(sendData);
      } else {
        clearRouteData();
      }
      navigate(destination); // Go back
    }

    const handleCancel = (e) => {
      const destination = navData.returnTo;
      e.preventDefault();
      if (navData.fromTransEdit) {
        const sendData = {
          mode: "edit",
          data: navData.data,
          transId: navData.trans_id,
          returnTo: "/dashboard/home",
        };
        setRouteData(sendData);
      }else{
        clearRouteData();
      }
      navigate(destination);
    };

    if (navData.mode === "edit") {
      useEffect(()=>{
        setTitle(navData?.data?.records_title);
        setCode(navData?.data?.rec_code);
        setDescription(navData?.data?.rec_description);
        // console.log(navData.checklistData);
        setChecklist(navData?.checklistData.map((i)=> i.checklist_item).join(","));
        setRetPeriod(navData?.data?.retention_period);
        setRemarks(navData?.data?.remarks);
      }, [])
    }

    if(navData.mode === "create"){
      useEffect(()=>{
        setCode(branchCode);
      },[])
    }
    
    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <h1 className="ceTitle">
          {navData.mode === "create" && <>Create</>}
          {navData.mode === "edit" && <>Edit</>} Record
        </h1>
        {navData.mode === "create" && (
          <div className="fade-in createBox">
            <form onSubmit={checkFirst} className="fade-in">
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
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
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
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                    placeholder={`${code}0000000000`}
                    required
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
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      required
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
                      value={checklist}
                      onChange={(e) => setChecklist(e.target.value)}
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
                      onChange={(e) => setRetPeriod(e.target.value)}
                      value={retPeriod}
                      required
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
                      onChange={(e) => setRemarks(e.target.value)}
                      value={remark}
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
                  <label htmlFor="recTitle" className="recLabel">
                    Title:
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="recTitle"
                    className="recInput"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
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
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
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
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
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
                      onChange={(e) => setChecklist(e.target.value)}
                      value={checklist}
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
                      onChange={(e) => setRetPeriod(e.target.value)}
                      value={retPeriod}
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
                      onChange={(e) => setRemarks(e.target.value)}
                      value={remark}
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
                  defaultValue="SAVE EDITS"
                  className="btnGreen"
                ></input>
                <button
                  className="btnCancel"
                  type="button"
                  onClick={handleCancel}
                >
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