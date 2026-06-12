import '../styles/tableTemp.css';
import "../styles/loading.css";
import { useState, useEffect, useMemo } from 'react';
import UsableDialog from './usableDialog';
// import dummyData from '../assets/dummyData.js'
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { useAuth } from '../context/AuthContext.jsx';
import { GetTransmissions } from "../hooks/GetTranssmissions.jsx";
import { TableSkeleton, ErrorMessage } from "./Loading.jsx";

function mostRecent(){
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);  
    const [onRecords, setOnRecords] = useState(false);
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const { user } = useAuth(); 
    const { transmissions, loading, error, refetch } = GetTransmissions();

    const handleEditTrans = async (data) => {
        // let chkData; 
        // if(!data?.record_id){
        //   return
        // }
        // else{
        //   chkData = await instantFetchChecklist(data.record_id);
        // }
        const sendData = { mode: 'edit', data: data, transId: data.trans_id, returnTo: "/dashboard/home",callback: ()=> console.log('Success') }
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

    const [sortConfig, setSortConfig] = useState({
      key: null,
      direction: "asc",
    });

    const requestSort = (key) => {
      let direction = "asc";
      // Toggle direction if the same column is clicked again
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
      
      if  (sortConfig.key === key ){
        return sortConfig.direction === "asc" ? " ▲" : " ▼";
      }
       return " ⇅";
    };

    // Sort the data before slicing it
    const sortedTransmissions = useMemo(() => {
      let sorted = [...transmissions];
      if (sortConfig.key) {
        sorted.sort((a, b) => {
          let valA = a[sortConfig.key];
          let valB = b[sortConfig.key];

          // Handle null/undefined values
          if (valA == null) valA = "";
          if (valB == null) valB = "";

          // Special handling for dates to ensure chronological sorting
          if (sortConfig.key === "sent_date") {
            const dateA = new Date(valA).getTime();
            const dateB = new Date(valB).getTime();
            if (!isNaN(dateA) && !isNaN(dateB)) {
              valA = dateA;
              valB = dateB;
            }
          } else {
            // Check if both are valid numbers to sort numerically
            const isNumA = !isNaN(valA) && String(valA).trim() !== "";
            const isNumB = !isNaN(valB) && String(valB).trim() !== "";

            if (isNumA && isNumB) {
              valA = Number(valA);
              valB = Number(valB);
            } else {
              // Fallback to alphabetical string comparison
              valA = String(valA).toLowerCase();
              valB = String(valB).toLowerCase();
            }
          }

          if (valA < valB) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (valA > valB) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
      return sorted;
    }, [transmissions, sortConfig]);
    
    
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
                {/* Added onClick and cursor style to make headers clickable */}
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("trans_id")}
                >
                  TransmissionsID{getSortIndicator("trans_id")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("record_id")}
                >
                  RecordID{getSortIndicator("record_id")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("division")}
                >
                  Division{getSortIndicator("division")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("item_no")}
                >
                  Item No.{getSortIndicator("item_no")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("record_titles")}
                >
                  Title{getSortIndicator("record_titles")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("sent_date")}
                >
                  Date Sent{getSortIndicator("sent_date")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("record_status")}
                >
                  Status{getSortIndicator("record_status")}
                </th>
                <th>⠀⠀⠀⠀⠀⠀⠀⠀⠀</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton stays inside the table - no layout shift
                <TableSkeleton rowCount={4} colCount={8} />
              ) : error ? (
                <tr>
                  <td colSpan={8}>
                    <ErrorMessage message={error} onRetry={refetch} />
                  </td>
                </tr>
              ) : transmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    <h1>No Data Available</h1>
                  </td>
                </tr>
              ) : (
                sortedTransmissions.slice(0, 4).map((data) => (
                  <tr key={data.record_id} className="fade-in">
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
            onRefetch={refetch}
          />
        </div>
      </>
    );
}

export default mostRecent;