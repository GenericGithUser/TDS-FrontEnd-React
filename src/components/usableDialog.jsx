import { use, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { GetChecklistItems } from "../hooks/GetChecklistItems";
import { GetRecords } from "../hooks/GetRecords";
import { GetTransmissions } from "../hooks/GetTranssmissions";
import '../styles/dialog.css'


function UsableDialog( {isOpen, onClose, data, isDeleteButton, onRecords } ){
    const dialogRef = useRef(null);
    const nestedDialogRef = useRef(null);
    const nestedSiblingDialogRef = useRef(null);
    const [isNestedDialogOpen, setIsNestedDialogOpen] = useState(false);
    const [isNestedSiblingDialogOpen, setIsNestedSiblingDialogOpen] = useState(false);
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const [missingItems, setMissingItems] = useState([]);
    const { user } = useAuth(); 
    const location = useLocation();
    const { checkItems, loading, error, fetchChecklist } = GetChecklistItems();
    const { updateFeedback } = GetRecords();
    const { updateStatusApprover, updateStatus } = GetTransmissions();
    const [feedback, setFeedback] = useState('');


    
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

     useEffect(()=>{
      const nestedSiblingDialog = nestedSiblingDialogRef.current;
      if(!nestedSiblingDialog) return;

      if(isNestedSiblingDialogOpen){
        nestedSiblingDialog.showModal();
      }else{
        nestedSiblingDialog.close();
      }
     }, [isNestedSiblingDialogOpen]);

     

     useEffect(() => {
        if (!data?.record_id) return;
          
          fetchChecklist(data.record_id);
            
     },[data?.record_id]);
     if (!data) return;
    
       
        

     const openNestedDialog = () => {
       setIsNestedDialogOpen(true);
     };

     const closeNestedDialog = () => {
       setIsNestedDialogOpen(false);
     };

     const openSiblingNestedDialog = () => {
        setIsNestedSiblingDialogOpen(true);
     }

     const closeSiblingNestedDialog = () => {
       setIsNestedSiblingDialogOpen(false);
     };

     const handleFeedbackSubmit = () => {
       updateFeedback(data.record_id, {
        feedback: feedback
       });
       setFeedback("");
     };

     const handleIncomplete = () => {
        if (missingItems.length < 0) {
            alert("No Missing Items");
            return
        }
        const message = `Missing Items: ${missingItems.map((i) => i).join(",")}`;
        updateStatus(data.trans_id, "incomplete", null);
        updateFeedback(data.record_id, {feedback: message});
        setFeedback("");
        onClose();
     }

     const handleComplete = () =>{
        updateStatus(data.trans_id, "received", user.employee_id);
        onClose();
     }

     const handleNestedDialogSubmit = (onFeedback) => {
       // Handle the submit logic here
       console.log("Request edits submitted");
       if (onFeedback == 1) {
        handleFeedbackSubmit();
       }
       closeNestedDialog();
       // Optionally close the main dialog too
       // onClose();
     };
     const handleNestedDialogResolve = (onFeedback) => {
       // Handle the submit logic here
       console.log("Request edits submitted");
       
       closeNestedDialog();
       // Optionally close the main dialog too
       onClose();
     };

     const handleReTransmit = () =>{

     }

     const handleReApprove = () =>{
      updateStatus(data.trans_id, "pending", null);
      onClose();
     }

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

    const checkListButtonOpening = (recordId, type) =>{
        fetchChecklist(recordId);
        
        if (type === "received" || onRecords === true) {
          
          openNestedDialog();
        } 
        else if(type === "special") return;
        else{
          openSiblingNestedDialog();
        }
    }

    const handleEditTrans = (data) => {
      const chkData = checkItems;
      const sendData = {
        mode: "edit",
        data: data,
        transId: data.trans_id,
        recordId: data.record_id,
        checklistData: chkData,
        returnTo: location,
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

    const handleApproval = () => {
        updateStatusApprover(data.trans_id, "sent", user.employee_id);
        console.log("Success?");
        onClose();
    }

    

    if (!data) return null;

    if (data.record_status == "received" && isDeleteButton === false && onRecords === false ) {
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
                        {data.trans_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {data.record_id}
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
                        {data.item_no}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Title: </td>
                      <td id="titleIDData" className="data">
                        {data.record_titles}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Description: </td>
                      <td id="descData" className="data">
                        {data.rec_description}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Checklist Items: </td>
                      <td id="checklistData" className="data">
                        <div
                          className="btnFin btnCancel restrictSizeBtn"
                          onClick={() =>
                            checkListButtonOpening(data.record_id, "received")
                          }
                        >
                          See Checklist Items
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Code </td>
                      <td id="codeData" className="data">
                        {data.rec_code}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Retention Period: </td>
                      <td id="retentionData" className="data">
                        {data.retention_period}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Prepared By: </td>
                      <td id="prepData" className="data">
                        {data.preparer_name}
                      </td>
                      <td className="titleD">Approved By: </td>
                      <td id="apprData" className="data">
                        {data.approver_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Received By: </td>
                      <td id="receivrData" className="data">
                        {data.receiver_name}
                      </td>
                      <td className="titleD">Received On: </td>
                      <td id="recDateData" className="data">
                        {data.recDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Sent On: </td>
                      <td id="sent_date" className="data">
                        {data.sent_date}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="btnCancel" onClick={onClose}>
                OK
              </button>
            </dialog>
            <dialog className="diagEdit" ref={nestedDialogRef}>
              <h1 className="diagTitle">Checklist Items</h1>
              {error ? (
                <p>{error}</p>
              ) : loading ? (
                <p>Loading</p>
              ) : (
                checkItems.map((item) => (
                  <div className="chkItem">{item.checklist_item}</div>
                ))
              )}
              <div className="buttons">
                <button onClick={closeNestedDialog} className="btnCancel">
                  OK
                </button>
              </div>
            </dialog>
          </>
        );
    }
    else if (data.record_status == "sent" && isDeleteButton === false && onRecords === false &&  user.usr_role != "RECEIVER"){
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
                        {data.trans_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {data.record_id}
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
                        {data.record_titles}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Description: </td>
                      <td id="descData" className="data">
                        {data.rec_description}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Checklist Items: </td>
                      <td id="checklistData" className="data">
                        <div
                          className="btnFin btnCancel restrictSizeBtn"
                          onClick={() =>
                            checkListButtonOpening(data.record_id, "")
                          }
                        >
                          See Checklist Items
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Code </td>
                      <td id="codeData" className="data">
                        {data.rec_code}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Retention Period: </td>
                      <td id="retentionData" className="data">
                        {data.retention_period}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Prepared By: </td>
                      <td id="prepData" className="data">
                        {data.preparer_name}
                      </td>
                      <td className="titleD">Approved By: </td>
                      <td id="apprData" className="data">
                        {data.approver_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Received By: </td>
                      <td id="receiverData" className="data">
                        {data.receiver_name}
                      </td>
                      <td className="titleD">Received On: </td>
                      <td id="recDateData" className="data">
                        {data.date_time_received}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Sent On: </td>
                      <td id="sent_date" className="data">
                        {data.sent_date}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="buttons">
                <button onClick={onClose} className="btnCancel ">
                  OK
                </button>
                <button
                  className="btnFin btnCancel"
                  onClick={() => handleEditTrans(data)}
                >
                  EDIT
                </button>
                <button className="btnRed btnCancel" onClick={openNestedDialog}>
                  CANCEL
                </button>
              </div>
            </dialog>
            <dialog className="delPrompt" ref={nestedDialogRef}>
              <h1 className="diagTitle">Confirm Cancellation</h1>
              <img src="/assets/warning.png" alt="warning" />
              <h3 className="confirmMesg">
                Are you sure you want to Cancel this transmission?
              </h3>
              <div className="contents">
                <table className="contentList">
                  <tbody>
                    <tr>
                      <td className="titleD">TransmissionID: </td>
                      <td id="transIDData" className="data">
                        {data.trans_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {data.record_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Title: </td>
                      <td id="titleIDData" className="data">
                        {data.record_titles}
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
                  CANCEL TRANSMISSION
                </button>
              </div>
            </dialog>
            <dialog className="diagEdit" ref={nestedSiblingDialogRef}>
              <h1 className="diagTitle">Checklist Items</h1>
              {error ? (
                <p>{error}</p>
              ) : loading ? (
                <p>Loading</p>
              ) : (
                checkItems.map((item) => (
                  <div className="chkItem">{item.checklist_item}</div>
                ))
              )}
              <div className="buttons">
                <button
                  onClick={closeSiblingNestedDialog}
                  className="btnCancel"
                >
                  OK
                </button>
              </div>
            </dialog>
          </>
        );
    }
    else if (data.record_status == "sent" && isDeleteButton === false && onRecords === false &&  user.usr_role === "RECEIVER"){
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
                        {data.trans_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {data.record_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Office: </td>
                      <td id="recordIdData" className="data">
                        {data.office_dept}
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
                        {data.record_titles}
                      </td>
                      <td colSpan={2}>
                        <div className="checkCont">
                          <span className="titleD">Checklist Items: </span>
                          {}
                          {checkItems.map((item) => (
                            <div className="items" key={item.checklist_id}>
                              <h4>{item.checklist_item}</h4>
                              <button
                                className={
                                  missingItems.includes(item.checklist_item)
                                    ? "limHeight btnEdit"
                                    : "limHeight delBtn"
                                }
                                onClick={() => addRemoveMissingItems(item.checklist_item)}
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
                        {data.rec_description}
                      </td>
                      {missingItems.length > 0 && (
                        <td colSpan={2}>
                          <div className="checkCont">
                            <span className="titleD">Missing Message: </span>
                            <br />
                            <p className="messageBox">
                              Missing Items:
                              {missingItems.map((item) => (
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
                        {data.rec_code}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Retention Period: </td>
                      <td id="retentionData" className="data">
                        {data.retention_period}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Prepared By: </td>
                      <td id="prepData" className="data">
                        {data.preparer_name}
                      </td>
                      <td className="titleD">Approved By: </td>
                      <td id="apprData" className="data">
                        {data.approver_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Sent On: </td>
                      <td id="sent_date" className="data">
                        {data.sent_date}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="buttons">
                {missingItems.length > 0 ? (
                  <button onClick={handleIncomplete} className="btnInc btnCancel ">
                    Mark As Incomplete
                  </button>
                ) : (
                  <button onClick={handleComplete} className="btnFin btnCancel ">
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
    else if (data.record_status == "pending" && isDeleteButton === false && onRecords === false ){
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
                        {data.trans_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {data.record_id}
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
                        {data.record_titles}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Description: </td>
                      <td id="descData" className="data">
                        {data.rec_description}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Checklist Items: </td>
                      <td id="checklistData" className="data">
                        <div
                          className="btnFin btnCancel restrictSizeBtn"
                          onClick={openSiblingNestedDialog}
                        >
                          See Checklist Items
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Code </td>
                      <td id="codeData" className="data">
                        {data.rec_code}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Retention Period: </td>
                      <td id="retentionData" className="data">
                        {data.retention_period}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Prepared By: </td>
                      <td id="prepData" className="data">
                        {data.preparer_name}
                      </td>
                      <td className="titleD">Approved By: </td>
                      <td id="apprData" className="data">
                        {data.approver_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Received By: </td>
                      <td id="receivrData" className="data">
                        {data.receiver_name}
                      </td>
                      <td className="titleD">Received On: </td>
                      <td id="recDateData" className="data">
                        {data.recDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Sent On: </td>
                      <td id="sent_date" className="data">
                        {data.sent_date}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="feedback">
                  {user.usr_role === "PREPARER" && (
                    <>
                      <p className="feedbackText">
                        <span className="blau">FeedBack: </span>
                        {data.feedback === null
                          ? "Waiting for Approval"
                          : data.feedback}
                      </p>
                    </>
                  )}
                  {user.usr_role === "APPROVER" ? (
                    <>
                      <p className="feedbackText">
                        <span className="blau">FeedBack: </span>
                        {data.feedback === null
                          ? "All Good"
                          : `Waiting for Response on: ${data.feedback}`}
                      </p>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {user.usr_role === "PREPARER" && (
                <div className="buttons">
                  <button onClick={onClose} className="btnCancel">
                    OK
                  </button>
                </div>
              )}
              {user.usr_role === "ADMIN" && (
                <div className="buttons">
                  <button onClick={onClose} className="btnCancel">
                    OK
                  </button>
                </div>
              )}
              {user.usr_role === "APPROVER" && (
                <div className="buttons">
                  <button className="btnFin btnCancel" onClick={handleApproval}>
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
                <textarea
                  name="changeForm"
                  id="changeForm"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
              </form>
              <div className="buttons">
                <button
                  className="btnInc btnCancel"
                  onClick={() => handleNestedDialogSubmit(1)}
                >
                  Send Requests
                </button>
                <button onClick={closeNestedDialog} className="btnCancel">
                  Cancel
                </button>
              </div>
            </dialog>
            <dialog className="diagEdit" ref={nestedSiblingDialogRef}>
              <h1 className="diagTitle">Checklist Items</h1>
              {error ? (
                <p>{error}</p>
              ) : loading ? (
                <p>Loading</p>
              ) : (
                checkItems.map((item) => (
                  <div className="chkItem">{item.checklist_item}</div>
                ))
              )}
              <div className="buttons">
                <button
                  onClick={closeSiblingNestedDialog}
                  className="btnCancel"
                >
                  OK
                </button>
              </div>
            </dialog>
          </>
        );
    }
    else if (data.record_status == "incomplete" && isDeleteButton === false && onRecords === false && user.usr_role != "RECEIVER" && user.usr_role != "APPROVER") {
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
                      {data.trans_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">RecordID: </td>
                    <td id="recordIdData" className="data">
                      {data.record_id}
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
                <button className="btnFin btnCancel" onClick={handleReApprove}>
                  Submit for Re-Approval
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

    else if (data.record_status == "incomplete" && isDeleteButton === false && onRecords === false && user.usr_role === "RECEIVER" || user.usr_role === "APPROVER") {
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
                      {data.trans_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">RecordID: </td>
                    <td id="recordIdData" className="data">
                      {data.record_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Feedback: </td>
                    <td id="feedbackData" className="data">
                      {data.feedback}
                      <p>Waiting for {user.usr_role == "RECEIVER" ? <>Branch</> : <>Preparer</>} Response...</p>
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
                      {data.trans_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">RecordID: </td>
                    <td id="recordIdData" className="data">
                      {data.record_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Title: </td>
                    <td id="titleIDData" className="data">
                      {data.record_titles}
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
                      {data.record_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Title: </td>
                    <td id="titleIDData" className="data">
                      {data.record_titles}
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
                      {data.record_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Title: </td>
                    <td id="titleIDData" className="data">
                      {data.record_titles}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Description: </td>
                    <td id="descData" className="data">
                      {data.rec_description}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Checklist Items: </td>
                    <td id="checklistData" className="data">
                      <div
                        className="btnFin btnCancel restrictSizeBtn"
                        onClick={openNestedDialog}
                      >
                        See Checklist Items
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Code </td>
                    <td id="codeData" className="data">
                      {data.rec_code}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Retention Period: </td>
                    <td id="retentionData" className="data">
                      {data.retention_period}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Created On: </td>
                    <td id="prepData" className="data">
                      {data.created_at}
                    </td>
                    <td className="titleD">Modified On: </td>
                    <td id="apprData" className="data">
                      {data.modified_at}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="buttons">
              <button
                className="btnFin btnCancel"
                onClick={() => handleEditTrans(data)}
              >
                EDIT
              </button>
              <button className="btnCancel" onClick={onClose}>
                CANCEL
              </button>
            </div>
          </dialog>
          <dialog className="diagEdit" ref={nestedDialogRef}>
            <h1 className="diagTitle">Checklist Items</h1>
            {error ? (
              <p>{error}</p>
            ) : loading ? (
              <p>Loading</p>
            ) : (
              checkItems.map((item) => (
                <div className="chkItem">{item.checklist_item}</div>
              ))
            )}
            <div className="buttons">
              <button onClick={closeNestedDialog} className="btnCancel">
                OK
              </button>
            </div>
          </dialog>
        </>
      );
    }
    
    if (user.usr_role === "ADMIN" && /MEM/.test(data.id)) {
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
                      {data.emp_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Role: </td>
                    <td id="feedbackData" className="data">
                      {data.usr_role}
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
                      {data.emp_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Role: </td>
                    <td id="titleIDData" className="data">
                      {data.usr_role}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Branch: </td>
                    <td id="titleIDData" className="data">
                      {data.office_dept}
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

    if (user.usr_role === "ADMIN" && /#PT/.test(data.id) ) {
      return (
        <>
          <dialog className="diagEdit extender" ref={dialogRef}>
            <h1 className="diagTitle">
              {data.record_status === "Open" ? "Resolve" : "View"} Ticket
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
                      {data.record_titles}
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
                {data.record_status === "Open" ? (
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
