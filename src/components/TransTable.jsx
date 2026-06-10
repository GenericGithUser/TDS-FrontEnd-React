import "../styles/tableTemp.css";
import '../styles/transtable.css';
import { useState, useMemo } from "react";
import UsableDialog from "./usableDialog";
// import dummyData from "../assets/dummyData.js";
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { useAuth } from "../context/AuthContext";
import { GetTransmissions } from "../hooks/GetTranssmissions";

import { TableSkeleton, ErrorMessage } from "./Loading.jsx";
import "../styles/loading.css";

function TransTable() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);  
    const [onRecords, setOnRecords] = useState(false);
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const { user } = useAuth();
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { transmissions, loading, error } = GetTransmissions(searchQuery);



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

    const handleSearch = (e) => {
      e.preventDefault();
      setSearchQuery(searchInput);
    };

    
    const handleSearchChange = (e) =>{
      setSearchInput(e.target.value);

      if (e.target.value === '') {
        setSearchQuery('');
      }
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
      if (sortConfig.key === key) {
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
        <div className="searcherSorter">
          <form onSubmit={handleSearch}>
            <label htmlFor="searchBar">Search For a Transmission</label>
            <input
              type="search"
              name="searchBar"
              value={searchInput}
              onChange={handleSearchChange}
              id="searchBar"
            />
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
                {(user.usr_role === "ADMIN" ||
                  user.usr_role === "RECEIVER") && (
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => requestSort("office_dept")}
                  >
                    TransmissionsID{getSortIndicator("office_dept")}
                  </th>
                )}
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
                {(user.usr_role === "ADMIN" ||
                  user.usr_role === "RECEIVER") && (
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => requestSort("date_time_received")}
                  >
                    Date Received{getSortIndicator("date_time_received")}
                  </th>
                )}

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
                <TableSkeleton rowCount={5} colCount={8} />
              ) : error ? (
                <tr>
                  <td colSpan={8}>
                    <ErrorMessage message={error} onRetry={refetch} />
                  </td>
                </tr>
              ) : transmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    <h1>
                      {searchInput ? "No Record of Found" : "No Data Available"}
                    </h1>
                  </td>
                </tr>
              ) : (
                sortedTransmissions.slice(0, 10).map((data) => (
                  <tr key={data.record_id} className="fade-in">
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
