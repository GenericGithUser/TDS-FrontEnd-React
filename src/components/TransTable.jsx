import "../styles/tableTemp.css";
import '../styles/transtable.css';
import { useState } from "react";
import UsableDialog from "./usableDialog";
// import dummyData from "../assets/dummyData.js";
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { useAuth } from "../context/AuthContext";
import { GetTransmissions } from "./GetTranssmissions.jsx";

function TransTable() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);  
    const [onRecords, setOnRecords] = useState(false);
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const { user } = useAuth();
    const { transmissions, loading, error } = GetTransmissions();



   const recStatus = (user.usr_role === "ADMIN" || user.usr_role === "RECEIVER") ? "FINISHED" : "RECEIVED";
   const sentStatus = (user.usr_role === "RECEIVER") ? "INCOMING" : "SENT";
        

    const openDialog = (item, delBtn) => {
       setDialogData(item);
       setIsDialogOpen(true)
       setIsDeleteButton(delBtn);
       setOnRecords(false)

    };

    const closeDialog = () => {
       setIsDialogOpen(false);
       setIsDeleteButton(false);
    };

    const handleEditTrans = (data) => {
      const sendData = {
        mode: "edit",
        data: data,
        transId: data.trans_id,
        returnTo: "/dashboard/transmissions",
        callback: () => console.log("Success"),
      };
      setRouteData(sendData);
      navigate("edit");
    };

    // const ddummyData = user.usr_role != "RECEIVER" ? dummyData : dummyData.filter(data=> data.type != "pending");
     if (loading) return <p>Loading transmissions...</p>;
     if (error) return <p>Error: {error}</p>;
    

    return (
      <>
        <div className="searcherSorter">
          <form action="" method="get">
            <label htmlFor="searchBar">Search For a Transmission</label>
            <input type="search" name="searchBar" id="searchBar" />
            <input type="submit" value="🔎Search" className="searchBtn" />
          </form>
        </div>
        <div className="transTable extendWidth">
          <table className="actTransTable">
            <colgroup>
              {user.usr_role === "ADMIN" || user.usr_role === "RECEIVER" ? (
                <>
                  <col style={{ width: "10px" }} />
                  <col style={{ width: "10px" }} />
                  <col style={{ width: "10vw" }} />
                  <col style={{ width: "10vw" }} />
                  <col style={{ width: "5vw" }} />
                  <col style={{ width: "16vw" }} />
                </>
              ) : (
                <>
                  <col style={{ width: "10px" }} />
                  <col style={{ width: "10vw" }} />
                  <col style={{ width: "16vw" }} />
                  <col style={{ width: "5vw" }} />
                  <col style={{ width: "20vw" }} />
                </>
              )}
            </colgroup>
            <thead className="transTableHead">
              <tr>
                <th>TransmissionsID</th>
                <th>RecordID</th>
                {(user.usr_role === "ADMIN" ||
                  user.usr_role === "RECEIVER") && <th>Office</th>}
                <th>Division</th>
                <th>Item No.</th>
                <th>Title</th>
                <th>Date Sent</th>
                {(user.usr_role === "ADMIN" ||
                  user.usr_role === "RECEIVER") && <th>Date Received</th>}
                <th>Status</th>
                <th>⠀⠀⠀⠀⠀⠀⠀⠀⠀</th>
              </tr>
            </thead>
            <tbody>
              {transmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    <h1>No Data Available</h1>
                  </td>
                </tr>
              ) : (
                transmissions.slice(0, 10).map((data) => (
                  <tr key={data.record_id}>
                    <td>{data.trans_id}</td>
                    <td>{data.record_id}</td>
                    {user.usr_role === "ADMIN" ||
                    user.usr_role === "RECEIVER" ? (
                      <td>{data.office_dept}</td>
                    ) : (
                      ""
                    )}
                    <td>{data.division}</td>
                    <td>{data.item_no}</td>
                    <td>{data.record_titles}</td>
                    <td>{data.sent_date}</td>
                    {(user.usr_role === "ADMIN" ||
                      user.usr_role === "RECEIVER") && (
                      <td>{data.date_time_received}</td>
                    )}
                    <td>
                      {data.record_status.toUpperCase() === "RECEIVED" && (
                        <span className="received">{recStatus}</span>
                      )}
                      {data.record_status.toUpperCase() === "SENT" && (
                        <span className="sent">{sentStatus}</span>
                      )}
                      {data.record_status.toUpperCase() === "PENDING" && (
                        <span className="pending">
                          {data.record_status.toUpperCase()}
                        </span>
                      )}
                      {data.record_status.toUpperCase() === "INCOMPLETE" && (
                        <span className="incomplete">
                          {data.record_status.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td>
                      {data.record_status === "received" && (
                        <>
                          <button
                            type="button"
                            className="btnView"
                            onClick={() => openDialog(data, false)}
                          >
                            View
                          </button>
                          {user.usr_role === "ADMIN" && (
                            <button
                              type="button"
                              className="btnEdit"
                              onClick={() => handleEditTrans(data)}
                            >
                              Edit
                            </button>
                          )}
                        </>
                      )}
                      {data.record_status === "sent" && (
                        <>
                          <button
                            type="button"
                            className="btnView"
                            onClick={() => openDialog(data, false)}
                          >
                            View
                          </button>
                          {user.usr_role === "ADMIN" && (
                            <button
                              type="button"
                              className="btnEdit"
                              onClick={() => handleEditTrans(data)}
                            >
                              Edit
                            </button>
                          )}
                        </>
                      )}
                      {data.record_status === "pending" && (
                        <>
                          <button
                            type="button"
                            className="btnView"
                            onClick={() => openDialog(data, false)}
                          >
                            Check
                          </button>
                          {user.usr_role === "PREPARER" ||
                          user.usr_role === "ADMIN" ? (
                            <button
                              type="button"
                              className="btnEdit"
                              onClick={() => handleEditTrans(data)}
                            >
                              Edit
                            </button>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                      {data.record_status === "incomplete" && (
                        <button
                          type="button"
                          className="btnEdit"
                          onClick={() => openDialog(data, false)}
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <UsableDialog
            isOpen={isDialogOpen}
            onClose={closeDialog}
            data={dialogData}
            isDeleteButton={isDeleteButton}
            onRecords={onRecords}
          />
        </div>
      </>
    );

}

export default TransTable;
