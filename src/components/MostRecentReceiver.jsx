import '../styles/tableTemp.css'
import { useState } from 'react';
import UsableDialog from './usableDialog';
import dummyData from '../assets/dummyData.js'
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";


function mostRecentReceiver(){
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);  
    const [onRecords, setOnRecords] = useState(false);
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData(); 

    // const handleEditTrans = (data) => {
    //     const sendData = { mode: 'edit', data: data, returnTo: "/dashboard/home",callback: ()=> console.log('Success') }
    //     setRouteData(sendData);
    //     navigate("edit");

    // }

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
    
    
    return (
      <>
        <div className="transTable">
          <table className="actTransTable">
            <colgroup>
              <col style={{ width: "5vw" }} />
              <col style={{ width: "5vw" }} />
              <col style={{ width: "10vw" }} />
              <col style={{ width: "10vw" }} />
              <col style={{ width: "10vw" }} />
            </colgroup>
            <thead className="transTableHead">
              <tr>
                <th>TransmissionsID</th>
                <th>RecordID</th>
                <th>Office</th>
                <th>Division</th>
                <th>Item No.</th>
                <th>Title</th>
                <th>Date Sent</th>
                <th>Date Received</th>
                <th>Status</th>
                <th>⠀⠀⠀⠀⠀⠀⠀⠀⠀</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    <h1>No Data Available</h1>
                  </td>
                </tr>
              ) : (
                dummyData.filter(data=> data.type != "pending").slice(0, 4).map((data) => (
                  <tr key={data.id}>
                    <td>{data.transId}</td>
                    <td>{data.recordId}</td>
                    <td>{data.branch}</td>
                    <td>{data.division}</td>
                    <td>{data.itemNo}</td>
                    <td>{data.title}</td>
                    <td>{data.sentDate}</td>
                    <td>
                      {data.status === "RECEIVED" && (
                        <span className="received">FINISHED</span>
                      )}
                      {data.status === "SENT" && (
                        <span className="sent">INCOMING</span>
                      )}
                      {data.status === "INCOMPLETE" && (
                        <span className="incomplete">{data.status}</span>
                      )}
                    </td>
                    <td>{data.recDate}</td>
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
                          Review
                        </button>
                      )}
                      {data.type === "incomplete" && (
                        <button
                          type="button"
                          className="btnEdit"
                          onClick={() => openDialog(data, false)}
                        >
                          Pending
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

export default mostRecentReceiver;