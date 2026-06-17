import { use, useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { GetChecklistItems } from "../hooks/GetChecklistItems";
import { GetRecords } from "../hooks/GetRecords";
import { GetUsers } from "../hooks/GetUsers";
import { GetTransmissions } from "../hooks/GetTranssmissions";
import { Spinner } from "./Loading";
import toast from "react-hot-toast";
import api from "../api/client.js";
import '../styles/dialog.css'


function UsableDialog( {isOpen, onClose, data, isDeleteButton, onRecords, onRefetch } ){
    const dialogRef = useRef(null);
    const nestedDialogRef = useRef(null);
    const nestedSiblingDialogRef = useRef(null);
    const nnDialogRef = useRef(null);
    const [isNestedDialogOpen, setIsNestedDialogOpen] = useState(false);
    const [isNestedSiblingDialogOpen, setIsNestedSiblingDialogOpen] = useState(false);
    const [nnOpenDialog, setOpenNNDialog] =useState(false);
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const { user } = useAuth(); 
    const location = useLocation();
    const { checkItems, checkLoading, checkError, fetchChecklist, clearChecklist} = GetChecklistItems();
    const { updateFeedback, deleteRecord } = GetRecords();
    const [fullTrans, setFullTrans] = useState(null); // full transmission with records[]
    const [fetchError, setFetchError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [currentIdx, setCurrentIdx] = useState(0); 
    const [missingItemsMap, setMissingItemsMap] = useState({});
    const { getTransmissionById, updateStatusApprover, updateStatus, cancelTransmission, loading, error, deleteTransmission } = GetTransmissions();
    const [feedback, setFeedback] = useState('');
    const {softDeleteUser, restoreUser, getEmployeesByBranch} = GetUsers();
    const [users, setUsers] = useState([]);



    const fetchTrans = () =>{
      if (!data?.trans_id) return;

      const load = async () => {
        setIsFetching(true);
        setFetchError(null);
        setCurrentIdx(0); // reset to first record

        const result = await getTransmissionById(data.trans_id);

        if (result.success) {
          setFullTrans(result.data);
        } else {
          setFetchError(result.error);
        }
        setIsFetching(false);
      };

      load();
    }

    const receiverFetchTrans = () => {
       if (!data?.trans_id) return;

       const load = async () => {
         setIsFetching(true);
         setFetchError(null);
         setCurrentIdx(0);
         setMissingItemsMap({}); // reset missing items on new transmission

         const result = await getTransmissionById(data.trans_id);

         if (result.success) {
           setFullTrans(result.data);
           // Auto-fetch checklist for first record
           if (result.data?.records?.length > 0) {
             fetchChecklist(result.data.records[0].record_id);
             
           }
         } else {
           setFetchError(result.error);
         }

         setIsFetching(false);
       };

       load();
    }

    const fetchEmployees = () => {
        if (!data?.branch_id) {
          return;
        }
        const fetcher = async () =>{
            const dataUser = await getEmployeesByBranch(data?.branch_id);
            
            setUsers(dataUser.data);
            
        }


        fetcher();
    }
    
    const handleResetPassword = async (employeeId) => {
      try {
        const result = await api.post(`/users/${employeeId}/reset-password`);

        if (result.success) {
          // Show admin the temp password in a clear way
          toast.custom(
            (t) => (
              <div
                style={{
                  backgroundColor: "#96d9ad",
                  color: "#1a1a1a",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  minWidth: "320px",
                  maxWidth: "400px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {/* Message Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <strong style={{ fontSize: "16px" }}>
                    Password reset successfully!
                  </strong>
                  <span
                    style={{ fontSize: "14px" }}
                  >{`Employee: ${result.data.emp_name}`}</span>

                  {/* Highlighted Password Block */}
                  <span
                    style={{
                      fontSize: "14px",
                      fontFamily: "monospace",
                      background: "rgba(255, 255, 255, 0.5)",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      display: "inline-block",
                      width: "fit-content",
                      fontWeight: "600",
                    }}
                  >
                    {`Temp Password: ${result.data.temp_password}`}
                  </span>

                  <span
                    style={{
                      fontSize: "13px",
                      fontStyle: "italic",
                      marginTop: "4px",
                      lineHeight: "1.4",
                    }}
                  >
                    Please share this with the employee securely. They will be
                    prompted to change it on next login.
                  </span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button
                    onClick={() => {
                      // Copies just the password. Change to `fullMessage` if you prefer to copy everything.
                      navigator.clipboard.writeText(result.data.temp_password);
                      toast.success("Password copied!", { duration: 2000 });
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.9)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.6)")
                    }
                  >
                    📋 Copy Password
                  </button>

                  <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(0, 0, 0, 0.1)")
                    }
                  >
                    ✕ Dismiss
                  </button>
                </div>
              </div>
            ),
            {
              duration: 7000, // Your original duration
            },
          );
        }
        onClose();
      } catch (err) {
        toast.error(`Failed to reset password: ${err.message}`);
      }
    };

    
    useEffect(()=>{
        const dialog = dialogRef.current;

        if (!dialog) return;
        if(isOpen){
            if (data.record_status == "sent" && isDeleteButton === false && onRecords === false &&  user.usr_role === "RECEIVER") {
              receiverFetchTrans();
            }
            else{
              fetchTrans();
              
            }
            if (user.usr_role === "ADMIN" && data.branchTableViewing) {
              fetchEmployees();
            }
            dialog.showModal();
        }else{
            dialog.close();
        }
    }, [isOpen, data]);


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

     useEffect(()=>{
      const nnDialog = nnDialogRef.current;
      if (!nnDialog) return;

      if (nnOpenDialog) {
        nnDialog.showModal();
      }else{
        nnDialog.close();
      }
     }, [nnOpenDialog]);

     

     useEffect(() => {
        if (!data?.record_id) return;
          
          fetchChecklist(data.record_id);
            
     },[data?.record_id]);
    // Ensure the component still renders when `isOpen` is true so the
    // `dialogRef` can attach and `showModal()` can be called even if the
    // `data` prop arrives slightly after `isOpen` (state updates are async).
    if (!data && !isOpen) return null;
    
       
        

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

     const openNNDialog = ()=>{
      setOpenNNDialog(true);
     }

     const closeNNDialog = () =>{
      setOpenNNDialog(false);
     }

     const handleFeedbackSubmit = async () => {
       await updateFeedback(currentRecord.record_id, {
        feedback: feedback
       });
       setFeedback("");
       onRefetch();
     };

     const handleIncomplete = async () => {
       if (Object.keys(missingItemsMap).length === 0) {
         alert("No Missing Items");
         return;
       }

       try {
         // 1. Update transmission status to incomplete
         await updateStatus(data.trans_id, "incomplete", null);

         // 2. Update feedback for EACH record that has missing items
         for (const [recordId, missingItems] of Object.entries(
           missingItemsMap,
         )) {
           if (missingItems.length === 0) continue; // skip records with no missing items

           const message = `Missing Items: ${missingItems.join(", ")}`;

           await updateFeedback(Number(recordId), { feedback: message });
         }

         onClose();
         onRefetch()
       } catch (err) {
         alert(`Failed to mark incomplete: ${err.message}`);
       }
     };

     const handleComplete = async () =>{
        await updateStatus(data.trans_id, "received", user.employee_id);
        onClose();
        onRefetch();
     }

       const onMarkIncomplete = () => {
         handleIncomplete();
       };

       const onMarkComplete = () => {
         handleComplete();
       };

      const handleDeleteTrans = async () =>{
        await deleteTransmission(data.trans_id);
        closeNNDialog();
        onClose();
        onRefetch();
      } 

     const handleNestedDialogSubmit = async (onFeedback) => {
       // Handle the submit logic here
       console.log("Request edits submitted");
       if (onFeedback == 1) {
        await handleFeedbackSubmit();
        onRefetch();
       }else if (onFeedback == 2){
         await cancelTransmission(data.trans_id, "pending");
          onRefetch();
       }
       else if (onFeedback == 3){
         await softDeleteUser(data.user_id);
         onRefetch();
       }
       else if (onFeedback == 4){
        await restoreUser(data.user_id);
        onRefetch();
       }

       closeNestedDialog();
       // Optionally close the main dialog too
       onClose();
       onRefetch();
     };
     const handleNestedDialogResolve = (onFeedback) => {
       // Handle the submit logic here
       console.log("Request edits submitted");
       
       closeNestedDialog();
       // Optionally close the main dialog too
       onClose();
     };


     const handleReApprove = async () =>{
      await updateStatus(data.trans_id, "pending", null);
      onClose();
      onRefetch();
     }

     const handleDeletionRecord = async (e) =>{
        e.preventDefault();
        await deleteRecord(data.record_id);
        onClose();
        onRefetch();
     }

   

    const checkListButtonOpening = (recordId, type) =>{
        fetchChecklist(recordId);
        
        if (type === "received" || onRecords === true) {
          
          openNestedDialog();
        } 
        else if(type === "special") 
        {
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
      onClose();
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
      onClose();
    };

    const handleApproval = async () => {
        await updateStatusApprover(data.trans_id, "sent", user.employee_id);
        onClose();
        onRefetch();
    }
      const records = fullTrans?.records ?? [];
      const totalRecords = records.length;
      const currentRecord = records[currentIdx] ?? null;

      const currentMissing = missingItemsMap[currentRecord?.record_id] ?? [];

      // All missing items across ALL records (used for final submit)
      const allMissingItems = Object.values(missingItemsMap).flat();
      const hasAnyMissing = allMissingItems.length > 0;

      const goNext = () =>
        setCurrentIdx((i) => Math.min(i + 1, totalRecords - 1));
      const goPrev = () => setCurrentIdx((i) => Math.max(i - 1, 0));

      const goNextReceiver = async () => {
        const nextIdx = Math.min(currentIdx + 1, totalRecords - 1);
        setCurrentIdx(nextIdx);
        clearChecklist();
        await fetchChecklist(records[nextIdx].record_id);
      };

      const goPrevReceiver = async () => {
        const prevIdx = Math.max(currentIdx - 1, 0);
        setCurrentIdx(prevIdx);
        clearChecklist();
        await fetchChecklist(records[prevIdx].record_id);
      };

      // ── Missing item toggle per record ────────────────────────────────────────
   const addRemoveMissingItems = (itemName) => {
     const recordId = currentRecord?.record_id;
     if (!recordId) return;

     setMissingItemsMap((prev) => {
       const existing = prev[recordId] ?? [];
       const updated = existing.includes(itemName)
         ? existing.filter((i) => i !== itemName)
         : [...existing, itemName];
       return { ...prev, [recordId]: updated };
     });
   };


    

    if (!data) return null;

    if (data.record_status == "received" && isDeleteButton === false && onRecords === false ) {
        return (
          <>
            <dialog className="diagBox" ref={dialogRef}>
              <h1 className="diagTitle">View Transmission</h1>

              {isFetching ? (
                <Spinner text="Loading transmission..." />
              ) : fetchError ? (
                <p style={{ color: "red", padding: "20px" }}>{fetchError}</p>
              ) : (
                <div className="contents">
                  <table className="contentList">
                    <tbody>
                      {/* ── Transmission-level info (same for all records) ── */}
                      <tr>
                        <td className="titleD">Transmission ID:</td>
                        <td className="data">{`TR-${String(fullTrans?.trans_id).padStart(4, "0")}`}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Division:</td>
                        <td className="data">{fullTrans?.division}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Sent On:</td>
                        <td className="data">{fullTrans?.sent_date}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Prepared By:</td>
                        <td className="data">{fullTrans?.preparer_name}</td>
                        <td className="titleD">Approved By:</td>
                        <td className="data">{fullTrans?.approver_name}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Received By:</td>
                        <td className="data">
                          {fullTrans?.receiver_name ?? "—"}
                        </td>
                        <td className="titleD">Received On:</td>
                        <td className="data">
                          {fullTrans?.date_time_received ?? "—"}
                        </td>
                      </tr>

                      {/* ── Divider ── */}
                      <tr>
                        <td colSpan={4}>
                          <hr style={{ margin: "10px 0", opacity: 0.2 }} />
                        </td>
                      </tr>

                      {/* ── Record navigation header ── */}
                      {totalRecords > 0 && (
                        <tr>
                          <td colSpan={4}>
                            <div className="recordNav">
                              <button
                                className="btnCancel"
                                onClick={goPrev}
                                disabled={currentIdx === 0}
                              >
                                ‹ Prev
                              </button>
                              <span className="recordNavLabel">
                                Record {currentIdx + 1} of {totalRecords}
                              </span>
                              <button
                                className="btnCancel"
                                onClick={goNext}
                                disabled={currentIdx === totalRecords - 1}
                              >
                                Next ›
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* ── Record-level info (changes with navigation) ── */}
                      {currentRecord ? (
                        <>
                          <tr>
                            <td className="titleD">Item No.:</td>
                            <td className="data">{currentRecord.item_no}</td>
                            <td className="titleD">Record ID:</td>
                            <td className="data">{`SR-${String(fullTrans?.trans_id).padStart(4, "0")}`}</td>
                          </tr>
                          <tr>
                            <td className="titleD">Title:</td>
                            <td className="data" colSpan={3}>
                              {currentRecord.records_title}
                            </td>
                          </tr>
                          <tr>
                            <td className="titleD">Description:</td>
                            <td className="data" colSpan={3}>
                              {currentRecord.rec_description}
                            </td>
                          </tr>
                          <tr>
                            <td className="titleD">Code:</td>
                            <td className="data">{currentRecord.rec_code}</td>
                            <td className="titleD">Retention:</td>
                            <td className="data">
                              {currentRecord.retention_period}
                            </td>
                          </tr>
                          <tr>
                            <td className="titleD">Checklist Items:</td>
                            <td className="data spec" colSpan={3}>
                              <div
                                className="btnFin btnCancel restrictSizeBtn"
                                onClick={() =>
                                  checkListButtonOpening(
                                    currentRecord.record_id,
                                    "received",
                                  )
                                }
                              >
                                See Checklist Items
                              </div>
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            No records attached to this transmission
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              <button className="btnCancel" onClick={onClose}>
                OK
              </button>
            </dialog>
            <dialog className="diagEdit" ref={nestedDialogRef}>
              <h1 className="diagTitle">Checklist Items</h1>
              {error ? (
                <p>{error}</p>
              ) : loading ? (
                <Spinner text="Loading Items..." />
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
              <h1 className="diagTitle">View Transmission</h1>

              {isFetching ? (
                <Spinner text="Loading transmission..." />
              ) : fetchError ? (
                <p style={{ color: "red", padding: "20px" }}>{fetchError}</p>
              ) : (
                <div className="contents">
                  <table className="contentList">
                    <tbody>
                      {/* ── Transmission-level info (same for all records) ── */}
                      <tr>
                        <td className="titleD">Transmission ID:</td>
                        <td className="data">{`TR-${String(fullTrans?.trans_id).padStart(4, "0")}`}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Division:</td>
                        <td className="data">{fullTrans?.division}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Sent On:</td>
                        <td className="data">{fullTrans?.sent_date}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Prepared By:</td>
                        <td className="data">{fullTrans?.preparer_name}</td>
                        <td className="titleD">Approved By:</td>
                        <td className="data">{fullTrans?.approver_name}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Received By:</td>
                        <td className="data">
                          {fullTrans?.receiver_name ?? "—"}
                        </td>
                        <td className="titleD">Received On:</td>
                        <td className="data">
                          {fullTrans?.date_time_received ?? "—"}
                        </td>
                      </tr>

                      {/* ── Divider ── */}
                      <tr>
                        <td colSpan={4}>
                          <hr style={{ margin: "10px 0", opacity: 0.2 }} />
                        </td>
                      </tr>

                      {/* ── Record navigation header ── */}
                      {totalRecords > 0 && (
                        <tr>
                          <td colSpan={4}>
                            <div className="recordNav">
                              <button
                                className="btnCancel"
                                onClick={goPrev}
                                disabled={currentIdx === 0}
                              >
                                ‹ Prev
                              </button>
                              <span className="recordNavLabel">
                                Record {currentIdx + 1} of {totalRecords}
                              </span>
                              <button
                                className="btnCancel"
                                onClick={goNext}
                                disabled={currentIdx === totalRecords - 1}
                              >
                                Next ›
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* ── Record-level info (changes with navigation) ── */}
                      {currentRecord ? (
                        <>
                          <tr>
                            <td className="titleD">Item No.:</td>
                            <td className="data">{currentRecord.item_no}</td>
                            <td className="titleD">Record ID:</td>
                            <td className="data">{`TR-${String(currentRecord?.record_id).padStart(4, "0")}`}</td>
                          </tr>
                          <tr>
                            <td className="titleD">Title:</td>
                            <td className="data" colSpan={3}>
                              {currentRecord.records_title}
                            </td>
                          </tr>
                          <tr>
                            <td className="titleD">Description:</td>
                            <td className="data" colSpan={3}>
                              {currentRecord.rec_description}
                            </td>
                          </tr>
                          <tr>
                            <td className="titleD">Code:</td>
                            <td className="data">{currentRecord.rec_code}</td>
                            <td className="titleD">Retention:</td>
                            <td className="data">
                              {currentRecord.retention_period}
                            </td>
                          </tr>
                          <tr>
                            <td className="titleD">Checklist Items:</td>
                            <td className="data spec" colSpan={3}>
                              <div
                                className="btnFin btnCancel restrictSizeBtn"
                                onClick={() =>
                                  checkListButtonOpening(
                                    currentRecord.record_id,
                                    "special",
                                  )
                                }
                              >
                                See Checklist Items
                              </div>
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            No records attached to this transmission
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="buttons">
                <button onClick={onClose} className="btnCancel ">
                  OK
                </button>
                {user.usr_role === "APPROVER" || user.is_admin ? (
                  <button
                    className="btnRed btnCancel"
                    onClick={openNestedDialog}
                  >
                    CANCEL
                  </button>
                ) : (
                  ""
                )}
                {user.is_admin && (
                  <button
                    onClick={openNNDialog}
                    className="btnOrange btnCancel"
                  >
                    DELETE TRANSMISSION
                  </button>
                )}
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
                        {`TR-${String(data?.trans_id).padStart(4, "0")}`}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {`TR-${String(data?.record_id).padStart(4, "0")}`}
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
                  onClick={() => handleNestedDialogSubmit(2)}
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
                <Spinner text="Loading Items..." />
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
            <dialog className="delPrompt" ref={nnDialogRef}>
              <h1 className="diagTitle">Confirm Deletion</h1>
              <img src="/assets/warning.png" alt="warning" />
              <h3 className="confirmMesg">
                Are you sure you want to Delete this transmission?
              </h3>
              <div className="contents">
                <table className="contentList">
                  <tbody>
                    <tr>
                      <td className="titleD">TransmissionID: </td>
                      <td id="transIDData" className="data">
                        <td>{`TR-${String(data?.trans_id).padStart(4, "0")}`}</td>
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        <td>{`TR-${String(data?.record_id).padStart(4, "0")}`}</td>
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
                <button className="btnCancel" onClick={closeNNDialog}>
                  Go Back
                </button>
                <button
                  onClick={() => handleDeleteTrans()}
                  className="btnRed btnCancel"
                >
                  CANCEL TRANSMISSION
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

              {isFetching ? (
                <Spinner text="Loading transmission..." />
              ) : fetchError ? (
                <p style={{ color: "red", padding: "20px" }}>{fetchError}</p>
              ) : (
                <div className="contents">
                  <table className="contentList">
                    <tbody>
                      {/* ── Transmission-level info ── */}
                      <tr>
                        <td className="titleD">Transmission ID:</td>
                        <td className="data">{`TR-${String(fullTrans?.trans_id).padStart(4, "0")}`}</td>
                        <td className="titleD">Office:</td>
                        <td className="data">{fullTrans?.office_dept}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Division:</td>
                        <td className="data">{fullTrans?.division}</td>
                        <td className="titleD">Sent On:</td>
                        <td className="data">{fullTrans?.sent_date}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Prepared By:</td>
                        <td className="data">{fullTrans?.preparer_name}</td>
                        <td className="titleD">Approved By:</td>
                        <td className="data">{fullTrans?.approver_name}</td>
                      </tr>

                      {/* ── Divider + record navigation ── */}
                      <tr>
                        <td colSpan={4}>
                          <hr style={{ margin: "10px 0", opacity: 0.2 }} />
                        </td>
                      </tr>

                      {totalRecords > 0 && (
                        <tr>
                          <td colSpan={4}>
                            <div className="recordNav">
                              <button
                                className="btnCancel"
                                onClick={goPrevReceiver}
                                disabled={currentIdx === 0}
                              >
                                ‹ Prev
                              </button>
                              <span className="recordNavLabel">
                                Record {currentIdx + 1} of {totalRecords}
                                {/* Show missing indicator per record */}
                                {currentMissing.length > 0 && (
                                  <span className="missingBadge">
                                    {currentMissing.length} missing
                                  </span>
                                )}
                              </span>
                              <button
                                className="btnCancel"
                                onClick={goNextReceiver}
                                disabled={currentIdx === totalRecords - 1}
                              >
                                Next ›
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* ── Record-level info ── */}
                      {currentRecord ? (
                        <>
                          <tr>
                            <td className="titleD">Item No.:</td>
                            <td className="data">{currentRecord.item_no}</td>
                            <td className="titleD">Code:</td>
                            <td className="data">{currentRecord.rec_code}</td>
                          </tr>
                          <tr>
                            <td className="titleD">Title:</td>
                            <td className="data" colSpan={3}>
                              {currentRecord.records_title}
                            </td>
                          </tr>
                          <tr>
                            <td className="titleD">Description:</td>
                            <td className="data" colSpan={3}>
                              {currentRecord.rec_description}
                            </td>
                          </tr>
                          <tr>
                            <td className="titleD">Retention:</td>
                            <td className="data">
                              {currentRecord.retention_period}
                            </td>
                          </tr>

                          {/* ── Checklist + missing items side by side ── */}
                          <tr>
                            <td colSpan={4}>
                              <div className="checklistRow">
                                {/* Left - checklist items to check */}
                                <div className="checkCont">
                                  <span className="titleD">
                                    Checklist Items:
                                  </span>
                                  {checkLoading ? (
                                    <Spinner text="Loading checklist..." />
                                  ) : checkError ? (
                                    <p style={{ color: "red" }}>{checkError}</p>
                                  ) : checkItems.length === 0 ? (
                                    <p
                                      style={{
                                        color: "#888",
                                        fontSize: "13px",
                                      }}
                                    >
                                      No checklist items
                                    </p>
                                  ) : (
                                    checkItems.map((item) => (
                                      <div
                                        className="items"
                                        key={item.checklist_id}
                                      >
                                        <h4>{item.checklist_item}</h4>
                                        <button
                                          className={
                                            currentMissing.includes(
                                              item.checklist_item,
                                            )
                                              ? "limHeight btnEdit" // active = marked missing
                                              : "limHeight delBtn" // inactive = present
                                          }
                                          onClick={() =>
                                            addRemoveMissingItems(
                                              item.checklist_item,
                                            )
                                          }
                                        >
                                          {currentMissing.includes(
                                            item.checklist_item,
                                          )
                                            ? "✓ Missing"
                                            : "Missing"}
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>

                                {/* Right - missing items summary for this record */}
                                {currentMissing.length > 0 && (
                                  <div className="checkCont">
                                    <span className="titleD">
                                      Missing for this record:
                                    </span>
                                    <p className="messageBox">
                                      {currentMissing.map((item) => (
                                        <span key={item}>
                                          • {item}
                                          <br />
                                        </span>
                                      ))}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            No records attached to this transmission
                          </td>
                        </tr>
                      )}

                      {/* ── All missing items summary (shows across all records) ── */}
                      {hasAnyMissing && (
                        <tr>
                          <td colSpan={4}>
                            <hr style={{ margin: "10px 0", opacity: 0.2 }} />
                            <div className="checkCont">
                              <span className="titleD">All Missing Items:</span>
                              <p className="messageBox">
                                {Object.entries(missingItemsMap).map(
                                  ([recordId, items]) =>
                                    items.length > 0 ? (
                                      <span key={recordId}>
                                        <strong>
                                          Record{" "}
                                          {records.find(
                                            (r) =>
                                              r.record_id === Number(recordId),
                                          )?.records_title ?? recordId}
                                          :
                                        </strong>
                                        {items.map((item) => (
                                          <span key={item}> {item},</span>
                                        ))}
                                        <br />
                                      </span>
                                    ) : null,
                                )}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Action buttons ── */}
              <div className="buttons">
                {hasAnyMissing ? (
                  <button
                    onClick={onMarkIncomplete}
                    className="btnInc btnCancel"
                  >
                    Mark As Incomplete
                  </button>
                ) : (
                  <button onClick={onMarkComplete} className="btnFin btnCancel">
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
              <h1 className="diagTitle">View Transmission</h1>

              {isFetching ? (
                <Spinner text="Loading transmission..." />
              ) : fetchError ? (
                <p style={{ color: "red", padding: "20px" }}>{fetchError}</p>
              ) : (
                <div className="contents">
                  <table className="contentList">
                    <tbody>
                      {/* ── Transmission-level info (same for all records) ── */}
                      <tr>
                        <td className="titleD">Transmission ID:</td>
                        <td className="data">{`TR-${String(data?.trans_id).padStart(4, "0")}`}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Division:</td>
                        <td className="data">{fullTrans?.division}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Sent On:</td>
                        <td className="data">{fullTrans?.sent_date}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Prepared By:</td>
                        <td className="data">{fullTrans?.preparer_name}</td>
                        <td className="titleD">Approved By:</td>
                        <td className="data">{fullTrans?.approver_name}</td>
                      </tr>
                      <tr>
                        <td className="titleD">Received By:</td>
                        <td className="data">
                          {fullTrans?.receiver_name ?? "—"}
                        </td>
                        <td className="titleD">Received On:</td>
                        <td className="data">
                          {fullTrans?.date_time_received ?? "—"}
                        </td>
                      </tr>

                      {/* ── Divider ── */}
                      <tr>
                        <td colSpan={4}>
                          <hr style={{ margin: "10px 0", opacity: 0.2 }} />
                        </td>
                      </tr>

                      {/* ── Record navigation header ── */}
                      {totalRecords > 0 && (
                        <tr>
                          <td colSpan={4}>
                            <div className="recordNav">
                              <button
                                className="btnCancel"
                                onClick={goPrev}
                                disabled={currentIdx === 0}
                              >
                                ‹ Prev
                              </button>
                              <span className="recordNavLabel">
                                Record {currentIdx + 1} of {totalRecords}
                              </span>
                              <button
                                className="btnCancel"
                                onClick={goNext}
                                disabled={currentIdx === totalRecords - 1}
                              >
                                Next ›
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* ── Record-level info (changes with navigation) ── */}
                      {currentRecord ? (
                        <>
                          <tr>
                            <td className="titleD">Item No.:</td>
                            <td className="data">{currentRecord.item_no}</td>
                            <td className="titleD">Record ID:</td>
                            <td className="data">{`SR-${String(currentRecord?.record_id).padStart(4, "0")}`}</td>
                          </tr>
                          <tr>
                            <td className="titleD">Title:</td>
                            <td className="data" colSpan={3}>
                              {currentRecord.records_title}
                            </td>
                          </tr>
                          <tr>
                            <td className="titleD">Description:</td>
                            <td className="data" colSpan={3}>
                              {currentRecord.rec_description}
                            </td>
                          </tr>
                          <tr>
                            <td className="titleD">Code:</td>
                            <td className="data">{currentRecord.rec_code}</td>
                            <td className="titleD">Retention:</td>
                            <td className="data">
                              {currentRecord.retention_period}
                            </td>
                          </tr>
                          <tr>
                            <td className="titleD">Checklist Items:</td>
                            <td className="data spec" colSpan={3}>
                              <div
                                className="btnFin btnCancel restrictSizeBtn"
                                onClick={() =>
                                  checkListButtonOpening(
                                    currentRecord.record_id,
                                    "special",
                                  )
                                }
                              >
                                See Checklist Items
                              </div>
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            style={{ textAlign: "center", padding: "20px" }}
                          >
                            No records attached to this transmission
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="feedback">
                    {user.usr_role === "PREPARER" && (
                      <>
                        <p className="feedbackText">
                          <span className="blau">FeedBack: </span>
                          {currentRecord?.feedback === null
                            ? "Waiting for Approval"
                            : currentRecord?.feedback}
                        </p>
                      </>
                    )}
                    {user.usr_role === "APPROVER" ? (
                      <>
                        <p className="feedbackText">
                          <span className="blau">FeedBack: </span>
                          {currentRecord?.feedback === null
                            ? "All Good"
                            : `Waiting for Response on: ${currentRecord?.feedback}`}
                        </p>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
              {user.usr_role === "PREPARER" && (
                <div className="buttons">
                  <button onClick={onClose} className="btnCancel">
                    OK
                  </button>
                  <button onClick={openNNDialog} className="btnRed btnCancel">
                    CANCEL TRANSMISSION
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
              <h2>
                For Record:{" "}
                {`SR-${String(currentRecord?.record_id).padStart(4, "0")}`}
              </h2>
              <h2>Record Title: {currentRecord?.records_title}</h2>
              <h2></h2>
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
                <Spinner text="Loading Items..." />
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
            <dialog className="delPrompt" ref={nnDialogRef}>
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
                        <td>{`TR-${String(data?.trans_id).padStart(4, "0")}`}</td>
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        <td>{`TR-${String(data?.record_id).padStart(4, "0")}`}</td>
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
                <button className="btnCancel" onClick={closeNNDialog}>
                  Go Back
                </button>
                <button
                  onClick={() => handleDeleteTrans()}
                  className="btnRed btnCancel"
                >
                  CANCEL TRANSMISSION
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
            {isFetching ? (
              <Spinner text="Loading transmission..." />
            ) : fetchError ? (
              <p style={{ color: "red", padding: "20px" }}>{fetchError}</p>
            ) : (
              <div className="contents">
                <table className="contentList">
                  <tbody>
                    <tr>
                      <td className="titleD">TransmissionID: </td>
                      <td id="transIDData" className="data">
                        {`TR-${String(fullTrans?.trans_id).padStart(4, "0")}`}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {`TR-${String(currentRecord?.record_id).padStart(4, "0")}`}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Feedback: </td>
                      <td id="feedbackData" className="data">
                        {currentRecord?.feedback}
                      </td>
                    </tr>
                    {totalRecords > 0 && (
                      <tr>
                        <td colSpan={4}>
                          <div className="recordNav">
                            <button
                              className="btnCancel"
                              onClick={goPrev}
                              disabled={currentIdx === 0}
                            >
                              ‹ Prev
                            </button>
                            <span className="recordNavLabel">
                              Record {currentIdx + 1} of {totalRecords}
                            </span>
                            <button
                              className="btnCancel"
                              onClick={goNext}
                              disabled={currentIdx === totalRecords - 1}
                            >
                              Next ›
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="buttons">
                  <button
                    className="btnFin btnCancel"
                    onClick={handleReApprove}
                  >
                    Submit for Re-Approval
                  </button>
                  <button
                    className="btnInc btnCancel"
                    onClick={() => handleEditTrans(data)}
                  >
                    Edit Transmission
                  </button>
                  <button onClick={onClose} className="btnCancel">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </dialog>
        </>
      );
    }

    else if (data.record_status == "incomplete" && isDeleteButton === false && onRecords === false && user.usr_role === "RECEIVER" || user.usr_role === "APPROVER") {
      return (
        <>
          <dialog className="diagEdit" ref={dialogRef}>
            <h1 className="diagTitle">Resolve Transmission</h1>
            {isFetching ? (
              <Spinner text="Loading transmission..." />
            ) : fetchError ? (
              <p style={{ color: "red", padding: "20px" }}>{fetchError}</p>
            ) : (
              <div className="contents">
                <table className="contentList">
                  <tbody>
                    <tr>
                      <td className="titleD">TransmissionID: </td>
                      <td id="transIDData" className="data">
                        {`TR-${String(fullTrans?.trans_id).padStart(4, "0")}`}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">RecordID: </td>
                      <td id="recordIdData" className="data">
                        {`TR-${String(currentRecord?.trans_id).padStart(4, "0")}`}
                      </td>
                    </tr>
                    <tr>
                      <td className="titleD">Feedback: </td>
                      <td id="feedbackData" className="data">
                        {currentRecord?.feedback}
                        <p>
                          Waiting for{" "}
                          {user.usr_role == "RECEIVER" ? (
                            <>Branch</>
                          ) : (
                            <>Preparer</>
                          )}{" "}
                          Response...
                        </p>
                      </td>
                    </tr>
                    {totalRecords > 0 && (
                      <tr>
                        <td colSpan={4}>
                          <div className="recordNav">
                            <button
                              className="btnCancel"
                              onClick={goPrev}
                              disabled={currentIdx === 0}
                            >
                              ‹ Prev
                            </button>
                            <span className="recordNavLabel">
                              Record {currentIdx + 1} of {totalRecords}
                            </span>
                            <button
                              className="btnCancel"
                              onClick={goNext}
                              disabled={currentIdx === totalRecords - 1}
                            >
                              Next ›
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
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
            )}
          </dialog>
        </>
      );
    }
    

    if (isDeleteButton === true && onRecords === false ) {
      return (
        <>
          <dialog className="delPrompt" ref={dialogRef}>
            <h1 className="diagTitle">Confirm Deletion</h1>
            <img src="/assets/warning.png" alt="warning" />
            <h3 className="confirmMesg">
              Are you sure you want to delete this transmission?
            </h3>
            <div className="contents">
              <table className="contentList">
                <tbody>
                  <tr>
                    <td className="titleD">TransmissionID: </td>
                    <td id="transIDData" className="data">
                      {`TR-${String(data?.trans_id).padStart(4, "0")}`}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">RecordID: </td>
                    <td id="recordIdData" className="data">
                      {`TR-${String(data?.record_id).padStart(4, "0")}`}
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
                      <td>{`TR-${String(data?.record_id).padStart(4, "0")}`}</td>
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Title: </td>
                    <td id="titleIDData" className="data">
                      {data.records_title}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="buttons">
              <button className="btnCancel" onClick={onClose}>
                Cancel
              </button>
              <button type="button" onClick={handleDeletionRecord} className="btnRed btnCancel">
                DELETE RECORD
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
                      {data.records_title}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Description: </td>
                    <td id="descData" className="data">
                      {data.rec_description}
                    </td>
                  </tr>
                  <tr className="minHeight">
                    <td className="titleD">Checklist Items: </td>
                    <td id="checklistData" className="data spec">
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
              <Spinner text="Loading Items..." />
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
    
    if (user.usr_role === "ADMIN" && data.userTableViewing) {
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
                      {`MEM-${String(data.user_id).padStart(4, "0")}`}
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
                <button
                  className="btnInc btnCancel"
                  onClick={() => handleResetPassword(data.employee_id)}
                >
                  Reset Password
                </button>
                <button
                  onClick={() => handleEditUser(data)}
                  className="btnFin btnCancel"
                >
                  Edit
                </button>
                {data.is_deleted === "true" ? (
                  <button
                    className="btnInc btnCancel"
                    onClick={openNestedDialog}
                  >
                    Re-Enable
                  </button>
                ) : (
                  <button
                    className="btnRed btnCancel"
                    onClick={openNestedDialog}
                  >
                    DISABLE
                  </button>
                )}
              </div>
            </div>
          </dialog>
          <dialog className="delPrompt" ref={nestedDialogRef}>
            <h1 className="diagTitle">
              Confirm {data.is_deleted === "true" ? "Re-Enabling" : "Disabling"}
            </h1>
            {data.is_deleted === "true" ? (
              ""
            ) : (
              <img src="/assets/warning.png" alt="warning" />
            )}
            <h3 className="confirmMesg">
              Are you sure you want to{" "}
              {data.is_deleted === "true" ? "Re-Enable" : "Disable"} this User??
            </h3>
            <div className="contents">
              <table className="contentList">
                <tbody>
                  <tr>
                    <td className="titleD">Employee ID: </td>
                    <td id="transIDData" className="data">
                      {`MEM-${String(data.user_id).padStart(4, "0")}`}
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
              {data.is_deleted === "true" ? (
                <button
                  onClick={() => handleNestedDialogSubmit(4)}
                  className="btnInc btnCancel"
                >
                  RE-ENABLE
                </button>
              ) : (
                <button
                  onClick={() => handleNestedDialogSubmit(3)}
                  className="btnRed btnCancel"
                >
                  DISABLE
                </button>
              )}
            </div>
          </dialog>
        </>
      );
    }
    if (user.is_admin && data.branchTableViewing) {
      return (
        <>
          <dialog className="diagEdit" ref={dialogRef}>
            <h1 className="diagTitle">Branch Details</h1>
            <div className="contents">
              <table className="contentList">
                <tbody>
                  <tr>
                    <td className="titleD">Branch ID: </td>
                    <td id="transIDData" className="data">
                      {`MB-${String(data.branch_id).padStart(4, "0")}`}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Office Name: </td>
                    <td id="recordIdData" className="data">
                      {data.office_dept}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Business Area: </td>
                    <td id="feedbackData" className="data">
                      {data.business_area}
                    </td>
                  </tr>
                  <tr>
                    <td className="titleD">Employees: </td>
                    <td id="feedbackData" className="data">
                      {users.map((u) => (
                        <div className="empItem">{`MEM-${String(u.employee_id).padStart(4, "0")} | ${u.emp_name} | ${u.position}`}</div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="buttons">
                <button className="btnCancel" onClick={onClose}>
                  OK
                </button>
              </div>
            </div>
          </dialog>
        </>
      );
    }

    
}

export default UsableDialog
