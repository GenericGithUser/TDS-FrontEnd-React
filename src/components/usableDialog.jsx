import { use, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";

import '../styles/dialog.css'


function UsableDialog( {isOpen, onClose, data, isDeleteButton, onRecords } ){
    const dialogRef = useRef(null);
    const nestedDialogRef = useRef(null);
    const [isNestedDialogOpen, setIsNestedDialogOpen] = useState(false);
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const [missingItems, setMissingItems] = useState([]);
    const { user } = useAuth(); 
    const location = useLocation();


    
    useEffect(()=>{
        const dialog = dialogRef.current;

        if (!dialog) return;
        if(isOpen){
            dialog.showModal();
        }else{
            dialog.close();
        }
    }, [isOpen]);


     useEffect(() => {
       const nestedDialog = nestedDialogRef.current;
       if (!nestedDialog) return;

       if (isNestedDialogOpen) {
         nestedDialog.showModal();
       } else {
         nestedDialog.close();
       }
     }, [isNestedDialogOpen]);

     const openNestedDialog = () => {
       setIsNestedDialogOpen(true);
     };

     const closeNestedDialog = () => {
       setIsNestedDialogOpen(false);
     };

     const handleNestedDialogSubmit = () => {
       // Handle the submit logic here
       console.log("Request edits submitted");
       closeNestedDialog();
       // Optionally close the main dialog too
       // onClose();
     };
     const handleNestedDialogResolve = () => {
       // Handle the submit logic here
       console.log("Request edits submitted");
       closeNestedDialog();
       // Optionally close the main dialog too
       onClose();
     };

    const addRemoveMissingItems = (item) => {
        setMissingItems((prev) => {
          if (!prev.includes(item)){
            return [...prev, item];
          }
          else{
            return prev.filter((itm)=> itm !== item);
          }
        })
    };

    const handleEditTrans = (data) => {

      const sendData = {
        mode: "edit",
        data: data,
        returnTo: location,
        callback: () => console.log("Success"),
      };
      setRouteData(sendData);
      navigate("edit");
    };

    const handleEditUser = (data) => {
      const sendData = {
        mode: "edit",
        data: data,
        returnTo: location,
        callback: () => console.log("Success"),
      };
      setRouteData(sendData);
      navigate("edit");
    };

    if (!data) return null;

    if (data.type == "view" && isDeleteButton === false && onRecords === false ) {
        return (
          <>
            <dialog className="diagBox" ref={dialogRef}>
              <h1 className="diagTitle">View Transmission</h1>
              <div className="contents">
                <table className="contentList">
                  <tbody>
                    <tr>
                      <td className="titleD">TransmissionID: </td>
                      <td id="transIDData" className="data">
                        {data.transId}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {data.recordId}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Division: </td>
                      <td id="divData" className="data">
                        {data.division}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Item No.: </td>
                      <td id="itemData" className="data">
                        {data.itemNo}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Title: </td>
                      <td id="titleIDData" className="data">
                        {data.title}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Description: </td>
                      <td id="descData" className="data">
                        {data.desc}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Checklist Items: </td>
                      <td id="checklistData" className="data">
                        {data.checkList.join(", ")}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Code </td>
                      <td id="codeData" className="data">
                        {data.code}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Retention Period: </td>
                      <td id="retentionData" className="data">
                        {data.retPeriod}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Prepared By: </td>
                      <td id="prepData" className="data">
                        {data.prepName}
                      </td>
                      <td className="titleD">Approved By: </td>
                      <td id="apprData" className="data">
                        {data.apprName}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Received By: </td>
                      <td id="receivrData" className="data">
                        {data.recName}
                      </td>
                      <td className="titleD">Received On: </td>
                      <td id="recDateData" className="data">
                        {data.recDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Sent On: </td>
                      <td id="sentDate" className="data">
                        {data.sentDate}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="btnCancel" onClick={onClose}>
                OK
              </button>
            </dialog>
          </>
        );
    }
    else if (data.type == "sent" && isDeleteButton === false && onRecords === false &&  user.role != "receiver"){
        return (
          <>
            <dialog className="diagBox" ref={dialogRef}>
              <h1 className="diagTitle">Check Transmission</h1>
              <div className="contents">
                <table className="contentList">
                  <tbody>
                    <tr>
                      <td className="titleD">TransmissionID: </td>
                      <td id="transIDData" className="data">
                        {data.transId}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {data.recordId}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Division: </td>
                      <td id="divData" className="data">
                        {data.division}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Title: </td>
                      <td id="titleIDData" className="data">
                        {data.title}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Description: </td>
                      <td id="descData" className="data">
                        {data.desc}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Checklist Items: </td>
                      <td id="checklistData" className="data">
                        {data.checkList.join(",")}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Code </td>
                      <td id="codeData" className="data">
                        {data.code}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Retention Period: </td>
                      <td id="retentionData" className="data">
                        {data.retPeriod}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Prepared By: </td>
                      <td id="prepData" className="data">
                        {data.prepName}
                      </td>
                      <td className="titleD">Approved By: </td>
                      <td id="apprData" className="data">
                        {data.apprName}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Received By: </td>
                      <td id="receivrData" className="data">
                        {data.recName}
                      </td>
                      <td className="titleD">Received On: </td>
                      <td id="recDateData" className="data">
                        {data.recDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Sent On: </td>
                      <td id="sentDate" className="data">
                        {data.sentDate}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="buttons">
                <button onClick={onClose} className="btnCancel ">
                  OK
                </button>
                <button className="btnFin btnCancel" onClick={()=> handleEditTrans(data)}>EDIT</button>
                <button className="btnRed btnCancel" onClick={openNestedDialog}>CANCEL</button>
              </div>
            </dialog>
             <dialog className="delPrompt" ref={nestedDialogRef}>
              <h1 className="diagTitle">Confirm Cancellation</h1>
              <img src="/assets/warning.png" alt="warning"  />
              <h3 className="confirmMesg">
                Are you sure you want to Cancel this transmission?
              </h3>
              <div className="contents">
                <table className="contentList">
                  <tbody>
                    <tr>
                      <td className="titleD">TransmissionID: </td>
                      <td id="transIDData" className="data">
                        {data.transId}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {data.recordId}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Title: </td>
                      <td id="titleIDData" className="data">
                        {data.title}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="buttons">
                <button className="btnCancel" onClick={closeNestedDialog}>
                  Go Back
                </button>
                <button onClick={handleNestedDialogSubmit} className="btnRed btnCancel">
                  CANCEL TRANSMISSION
                </button>
              </div>
            </dialog>
          </>
        );
    }
    else if (data.type == "sent" && isDeleteButton === false && onRecords === false &&  user.role === "receiver"){
        return (
          <>
            <dialog className="diagBox" ref={dialogRef}>
              <h1 className="diagTitle">Review Transmission</h1>
              <div className="contents">
                <table className="contentList">
                  <tbody>
                    <tr>
                      <td className="titleD">TransmissionID: </td>
                      <td id="transIDData" className="data">
                        {data.transId}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {data.recordId}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Office: </td>
                      <td id="recordIdData" className="data">
                        {data.branch}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Division: </td>
                      <td id="divData" className="data">
                        {data.division}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Title: </td>
                      <td id="titleIDData" className="data">
                        {data.title}
                      </td>
                      <td colSpan={2}>
                        <div className="checkCont">
                          <span className="titleD">Checklist Items: </span>
                          {data.checkList.map((item) => (
                            <div className="items" key={item}>
                              <h4>{item}</h4>
                              <button
                                className={
                                  missingItems.includes(item)
                                    ? "limHeight btnEdit"
                                    : "limHeight delBtn"
                                }
                                onClick={() => addRemoveMissingItems(item)}
                              >
                                Missing
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Description: </td>
                      <td id="descData" className="data">
                        {data.desc}
                      </td>
                      {missingItems.length > 0 && (
                        <td colSpan={2}>
                          <div className="checkCont">
                            <span className="titleD">Missing Message: </span><br />
                            <p className="messageBox">Missing Items: 
                              {missingItems.map((item)=>(
                                <span key={item}> {item}, </span>
                              ))}
                            </p>
                          </div>
                        </td>
                      )}
                    </tr>
                    <tr>
                      <td className="titleD">Code </td>
                      <td id="codeData" className="data">
                        {data.code}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Retention Period: </td>
                      <td id="retentionData" className="data">
                        {data.retPeriod}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Prepared By: </td>
                      <td id="prepData" className="data">
                        {data.prepName}
                      </td>
                      <td className="titleD">Approved By: </td>
                      <td id="apprData" className="data">
                        {data.apprName}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Sent On: </td>
                      <td id="sentDate" className="data">
                        {data.sentDate}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="buttons">
                {missingItems.length > 0 ? (
                  <button onClick={onClose} className="btnInc btnCancel ">
                    Mark As Incomplete
                  </button>
                ) : (
                  <button onClick={onClose} className="btnFin btnCancel ">
                    Mark As Finished
                  </button>
                )}
                <button className="btnCancel" onClick={onClose}>
                  CANCEL
                </button>
              </div>
            </dialog>
          </>
        );
    }
    else if (data.type == "pending" && isDeleteButton === false && onRecords === false ){
        return (
          <>
            <dialog className="diagBox" ref={dialogRef}>
              <h1 className="diagTitle">Review Transmission</h1>
              <div className="contents">
                <table className="contentList">
                  <tbody>
                    <tr>
                      <td className="titleD">TransmissionID: </td>
                      <td id="transIDData" className="data">
                        {data.transId}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {data.recordId}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Division: </td>
                      <td id="divData" className="data">
                        {data.division}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Title: </td>
                      <td id="titleIDData" className="data">
                        {data.title}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Description: </td>
                      <td id="descData" className="data">
                        {data.desc}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Checklist Items: </td>
                      <td id="checklistData" className="data">
                        {data.checkList.join(",")}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Code </td>
                      <td id="codeData" className="data">
                        {data.code}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Retention Period: </td>
                      <td id="retentionData" className="data">
                        {data.retPeriod}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Prepared By: </td>
                      <td id="prepData" className="data">
                        {data.prepName}
                      </td>
                      <td className="titleD">Approved By: </td>
                      <td id="apprData" className="data">
                        {data.apprName}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Received By: </td>
                      <td id="receivrData" className="data">
                        {data.recName}
                      </td>
                      <td className="titleD">Received On: </td>
                      <td id="recDateData" className="data">
                        {data.recDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Sent On: </td>
                      <td id="sentDate" className="data">
                        {data.sentDate}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="feedback">
                  {user.role === "preparer" && (
                    <>  
                      <p className="feedback">{data.feedback.toLowerCase() === "none" ? "Waiting for Approval": data.feedback }</p>
                    </>
                  )}
                </div>
              </div>
              {user.role === "preparer" && (
                <div className="buttons">
                  <button onClick={onClose} className="btnCancel">
                    OK
                  </button>
                </div>
              )}
              {user.role === "approver" && (
                <div className="buttons">
                  <button className="btnFin btnCancel" onClick={onClose}>
                    APPROVE FOR TRANSMISSION
                  </button>
                  <button
                    className="btnInc btnCancel"
                    onClick={openNestedDialog}
                  >
                    Request Edits
                  </button>
                  <button onClick={onClose} className="btnCancel">
                    Cancel
                  </button>
                </div>
              )}
            </dialog>
            <dialog className="diagEdit" ref={nestedDialogRef}>
              <h1 className="diagTitle">Request Edits</h1>
              <form action="" method="post" className="changes">
                <label htmlFor="changeForm">Enter Edits to be made:</label>
                <textarea name="changeForm" id="changeForm"></textarea>
              </form>
              <div className="buttons">
                <button
                  className="btnInc btnCancel"
                  onClick={handleNestedDialogSubmit}
                >
                  Send Requests
                </button>
                <button onClick={closeNestedDialog} className="btnCancel">
                  Cancel
                </button>
              </div>
            </dialog>
          </>
        );
    }
    else if (data.type == "incomplete" && isDeleteButton === false && onRecords === false && user.role != "receiver" && user.role != "approver") {
      return (
        <>
          <dialog className="diagEdit" ref={dialogRef}>
            <h1 className="diagTitle">Resolve Transmission</h1>
            <div className="contents">
              <table className="contentList">
                <tbody>
                  <tr>
                    <td className="titleD">TransmissionID: </td>
                    <td id="transIDData" className="data">
                      {data.transId}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">RecordID: </td>
                    <td id="recordIdData" className="data">
                      {data.recordId}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Feedback: </td>
                    <td id="feedbackData" className="data">
                      {data.feedback}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="buttons">
                <button className="btnFin btnCancel" onClick={onClose}>
                  Re-Transmit
                </button>
                <button className="btnInc btnCancel" onClick={()=> handleEditTrans(data)}>Edit Transmission</button>
                <button onClick={onClose} className="btnCancel">
                  Cancel
                </button>
              </div>
            </div>
          </dialog>
        </>
      );
    }

    else if (data.type == "incomplete" && isDeleteButton === false && onRecords === false && user.role === "receiver" || user.role === "approver") {
      return (
        <>
          <dialog className="diagEdit" ref={dialogRef}>
            <h1 className="diagTitle">Resolve Transmission</h1>
            <div className="contents">
              <table className="contentList">
                <tbody>
                  <tr>
                    <td className="titleD">TransmissionID: </td>
                    <td id="transIDData" className="data">
                      {data.transId}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">RecordID: </td>
                    <td id="recordIdData" className="data">
                      {data.recordId}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Feedback: </td>
                    <td id="feedbackData" className="data">
                      {data.feedback}
                      <p>Waiting for {user.role == "receiver" ? <>Branch</> : <>Preparer</>} Response...</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="buttons">
                <button className="btnFin btnCancel" onClick={onClose}>
                  OK
                </button>
                <button onClick={onClose} className="btnCancel">
                  Cancel
                </button>
              </div>
            </div>
          </dialog>
        </>
      );
    }
    

    if (isDeleteButton === true && onRecords === false ) {
      return (
        <>
          <dialog className="delPrompt" ref={dialogRef}>
            <h1 className="diagTitle">Confirm Deletion</h1>
            <img src="/assets/warning.png" alt="warning"  />
            <h3 className="confirmMesg">
              Are you sure you want to delete this transmission?
            </h3>
            <div className="contents">
              <table className="contentList">
                <tbody>
                  <tr>
                    <td className="titleD">TransmissionID: </td>
                    <td id="transIDData" className="data">
                      {data.transId}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">RecordID: </td>
                    <td id="recordIdData" className="data">
                      {data.recordId}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Title: </td>
                    <td id="titleIDData" className="data">
                      {data.title}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="buttons">
              <button className="btnCancel" onClick={onClose}>
                Cancel
              </button>
              <button onClick={onClose} className="btnRed btnCancel">
                DELETE TRANSMISSION
              </button>
            </div>
          </dialog>
          <dialog className="diagEdit" ref={nestedDialogRef}>
              <h1 className="diagTitle">Request Edits</h1>
              <form action="" method="post" className="changes">
                <label htmlFor="changeForm">Enter Edits to be made:</label>
                <textarea name="changeForm" id="changeForm"></textarea>
              </form>
              <div className="buttons">
                <button
                  className="btnInc btnCancel"
                  onClick={handleNestedDialogSubmit}
                >
                  Send Requests
                </button>
                <button onClick={closeNestedDialog} className="btnCancel">
                  Cancel
                </button>
              </div>
            </dialog>
        </>
      );
    } else if (isDeleteButton === true && onRecords === true ){
      return (
        <>
          <dialog className="delPrompt" ref={dialogRef}>
            <h1 className="diagTitle">Confirm Deletion</h1>
            <img src="/assets/warning.png" alt="warning"  />
            <h3 className="confirmMesg">
              Are you sure you want to delete this Record?
            </h3>
            <div className="contents">
              <table className="contentList">
                <tbody>
                  <tr>
                    <td className="titleD">RecordID: </td>
                    <td id="recordIdData" className="data">
                      {data.recordId}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Title: </td>
                    <td id="titleIDData" className="data">
                      {data.title}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="buttons">
              <button className="btnCancel" onClick={onClose}>
                Cancel
              </button>
              <button onClick={onClose} className="btnRed btnCancel">
                DELETE TRANSMISSION
              </button>
            </div>
          </dialog>
        </>
      );
    }

    if (onRecords === true ) {
      return (
        <>
          <dialog className="diagBox" ref={dialogRef}>
            <h1 className="diagTitle">View Record</h1>
            <div className="contents">
              <table className="contentList">
                <tbody>
                  <tr>
                    <td className="titleD">RecordID: </td>
                    <td id="recordIdData" className="data">
                      {data.recordId}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Title: </td>
                    <td id="titleIDData" className="data">
                      {data.title}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Description: </td>
                    <td id="descData" className="data">
                      {data.desc}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Checklist Items: </td>
                    <td id="checklistData" className="data">
                      {data.checkList.join(",")}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Code </td>
                    <td id="codeData" className="data">
                      {data.code}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Retention Period: </td>
                    <td id="retentionData" className="data">
                      {data.retPeriod}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Created On: </td>
                    <td id="prepData" className="data">
                      {data.creDate}
                    </td>
                    <td className="titleD">Modified On: </td>
                    <td id="apprData" className="data">
                      {data.modDate}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="buttons">
              <button className="btnFin btnCancel" onClick={()=> handleEditTrans(data)}>EDIT</button>
              <button className="btnCancel" onClick={onClose}>
                CANCEL
              </button>
            </div>
          </dialog>
        </>
      );
    }
    
    if (user.role === "admin" && /MEM/.test(data.id)) {
      return (
        <>
          <dialog className="diagEdit" ref={dialogRef}>
            <h1 className="diagTitle">User Details</h1>
            <div className="contents">
              <table className="contentList">
                <tbody>
                  <tr>
                    <td className="titleD">Employee ID: </td>
                    <td id="transIDData" className="data">
                      {data.id}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Name: </td>
                    <td id="recordIdData" className="data">
                      {data.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Role: </td>
                    <td id="feedbackData" className="data">
                      {data.role}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Email: </td>
                    <td id="feedbackData" className="data">
                      {data.email}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="buttons">
                <button className="btnCancel" onClick={onClose}>
                  OK
                </button>
                <button className="btnInc btnCancel" onClick={onClose}>
                  Reset Password
                </button>
                <button
                  onClick={() => handleEditUser(data)}
                  className="btnFin btnCancel"
                >
                  Edit
                </button>
                <button className="btnRed btnCancel" onClick={openNestedDialog}>
                  DELETE
                </button>
              </div>
            </div>
          </dialog>
          <dialog className="delPrompt" ref={nestedDialogRef}>
            <h1 className="diagTitle">Confirm Deletion</h1>
            <img src="/assets/warning.png" alt="warning"  />
            <h3 className="confirmMesg">
              Are you sure you want to Delete this User??
            </h3>
            <div className="contents">
              <table className="contentList">
                <tbody>
                  <tr>
                    <td className="titleD">Employee ID: </td>
                    <td id="transIDData" className="data">
                      {data.id}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Name: </td>
                    <td id="recordIdData" className="data">
                      {data.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Role: </td>
                    <td id="titleIDData" className="data">
                      {data.role}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Branch: </td>
                    <td id="titleIDData" className="data">
                      {data.branch}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="buttons">
              <button className="btnCancel" onClick={closeNestedDialog}>
                Go Back
              </button>
              <button
                onClick={handleNestedDialogSubmit}
                className="btnRed btnCancel"
              >
                DELETE
              </button>
            </div>
          </dialog>
        </>
      );
    }

    if (user.role === "admin" && /#PT/.test(data.id) ) {
      return (
        <>
          <dialog className="diagEdit extender" ref={dialogRef}>
            <h1 className="diagTitle">
              {data.status === "Open" ? "Resolve" : "View"} Ticket
            </h1>
            <div className="contents">
              <table className="contentList">
                <tbody>
                  <tr>
                    <td className="titleD">TicketID: </td>
                    <td id="transIDData" className="data dataOverride">
                      {data.id}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Title: </td>
                    <td id="recordIdData" className="data dataOverride">
                      {data.title}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Urgency: </td>
                    <td id="recordIdData" className="data dataOverride">
                      {data.urgency}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Date Sent: </td>
                    <td id="recordIdData" className="data dataOverride">
                      {data.date_sent}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Message: </td>
                    <td id="feedbackData" className="data dataOverride">
                      {data.message}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="buttons">
                {data.status === "Open" ? (
                  <>
                    <button
                      className="btnFin btnCancel"
                      onClick={openNestedDialog}
                    >
                      Resolve
                    </button>
                    <button onClick={onClose} className="btnCancel">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={onClose} className="btnCancel">
                    OK
                  </button>
                )}
              </div>
            </div>
          </dialog>
          <dialog className="diagEdit" ref={nestedDialogRef}>
            <h1 className="diagTitle">Resolved Message</h1>
            <form action="" method="post" className="changes">
              <label htmlFor="changeForm">Enter Resolve Message:</label>
              <textarea name="changeForm" id="changeForm"></textarea>
            </form>
            <div className="buttons">
              <button
                className="btnInc btnCancel"
                onClick={handleNestedDialogResolve}
              >
                Send Resolve Message and Close
              </button>
              <button onClick={closeNestedDialog} className="btnCancel">
                Cancel
              </button>
            </div>
          </dialog>
        </>
      );
    }
}

export default UsableDialog
