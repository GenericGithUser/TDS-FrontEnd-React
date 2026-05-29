import '../styles/tableTemp.css'
import { useState } from 'react';
import UsableDialog from './usableDialog';
// import dummyData from '../assets/dummyData.js'
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { useAuth } from '../context/AuthContext.jsx';
import { GetTransmissions } from "../components/GetTranssmissions.jsx";

function mostRecent(){
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);  
    const [onRecords, setOnRecords] = useState(false);
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const { user } = useAuth(); 
    const { transmissions, loading, error } = GetTransmissions();

    const handleEditTrans = (data) => {
        const sendData = { mode: 'edit', data: data, returnTo: "/dashboard/home",callback: ()=> console.log('Success') }
        setRouteData(sendData);
        navigate("edit");

    }

    const openDialog = (item, delBtn) =>{
        setDialogData(item);
        setIsDialogOpen(true);
        setIsDeleteButton(delBtn);
        setOnRecords(false)
    };

    const closeDialog = () => {
      setIsDialogOpen(false);
      setIsDeleteButton(false);
    }

     if (loading) return <p>Loading transmissions...</p>;
     if (error) return <p>Error: {error}</p>;
    
    
    return (
      <>
        <div className="transTable">
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
              {transmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    <h1>No Data Available</h1>
                  </td>
                </tr>
              ) : (
                transmissions.slice(0, 4).map((data) => (
                  <tr key={data.record_id}>
                    <td>{data.trans_id}</td>
                    <td>{data.record_id}</td>
                    <td>{data.division}</td>
                    <td>{data.item_no}</td>
                    <td>{data.record_titles}</td>
                    <td>{data.sent_date}</td>
                    <td>
                      {data.record_status.toUpperCase() === "RECEIVED" && (
                        <span className="received">
                          {data.record_status.toUpperCase()}
                        </span>
                      )}
                      {data.record_status.toUpperCase() === "SENT" && (
                        <span className="sent">
                          {data.record_status.toUpperCase()}
                        </span>
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
                        <button
                          type="button"
                          className="btnView"
                          onClick={() => openDialog(data, false)}
                        >
                          View
                        </button>
                      )}
                      {data.record_status === "sent" && (
                        <button
                          type="button"
                          className="btnView"
                          onClick={() => openDialog(data, false)}
                        >
                          View
                        </button>
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
                          {user.usr_role === "PREPARER" && (
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

export default mostRecent;