import "../styles/tableTemp.css";
import '../styles/transtable.css';
import { useState } from "react";
import UsableDialog from "./usableDialog";
import dummyData from "../assets/dummyData.js";
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { useAuth } from "../context/AuthContext";

function TransTable() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);  
    const [onRecords, setOnRecords] = useState(false);
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const { user } = useAuth();


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
        transId: data.transId,
        returnTo: "/dashboard/transmissions",
        callback: () => console.log("Success"),
      };
      setRouteData(sendData);
      navigate("edit");
    };

    const ddummyData = user.role != "receiver" ? dummyData : dummyData.filter(data=> data.type != "pending");
    

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
              <col style={{ width: "10px" }} />
              <col style={{ width: "10vw" }} />
              <col style={{ width: "16vw" }} />
              <col style={{ width: "5vw" }} />
              <col style={{ width: "20vw" }} />
            </colgroup>
            <thead className="transTableHead">
              <tr>
                <th>TransmissionsID</th>
                <th>RecordID</th>
                <th>Division</th>
                <th>Item No.</th>
                <th>Title</th>
                <th>Date Sent</th>
                <th>Status</th>
                <th>⠀⠀⠀⠀⠀⠀⠀⠀⠀</th>
              </tr>
            </thead>
            <tbody>
              {ddummyData.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    <h1>No Data Available</h1>
                  </td>
                </tr>
              ) : (
                ddummyData.slice(0, 10).map((data) => (
                  <tr key={data.id}>
                    <td>{data.transId}</td>
                    <td>{data.recordId}</td>
                    <td>{data.division}</td>
                    <td>{data.itemNo}</td>
                    <td>{data.title}</td>
                    <td>{data.sentDate}</td>
                    <td>
                      {data.status === "RECEIVED" && (
                        <span className="received">{data.status}</span>
                      )}
                      {data.status === "SENT" && (
                        <span className="sent">{data.status}</span>
                      )}
                      {data.status === "PENDING" && (
                        <span className="pending">{data.status}</span>
                      )}
                      {data.status === "INCOMPLETE" && (
                        <span className="incomplete">{data.status}</span>
                      )}
                    </td>
                    <td>
                      {data.type === "view" && (
                        <button
                          type="button"
                          className="btnView"
                          onClick={() => openDialog(data, false)}
                        >
                          View
                        </button>
                      )}
                      {data.type === "sent" && (
                        <button
                          type="button"
                          className="btnView"
                          onClick={() => openDialog(data, false)}
                        >
                          View
                        </button>
                      )}
                      {data.type === "pending" && (
                        <>
                          <button
                            type="button"
                            className="btnView"
                            onClick={() => openDialog(data, false)}
                          >
                            Check
                          </button>
                          {user.role === "preparer" && (
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
                      {data.type === "incomplete" && (
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
