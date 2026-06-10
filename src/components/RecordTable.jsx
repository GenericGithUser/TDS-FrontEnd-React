import "../styles/tableTemp.css";
import "../styles/transtable.css";
import "../styles/loading.css";
import { useState, useMemo } from "react";
import UsableDialog from "./usableDialog";
// import dummyData from "../assets/dummyData.js";
import { useAuth } from "../context/AuthContext";
import { GetRecords } from "../hooks/GetRecords";
import { TableSkeleton, ErrorMessage } from "./Loading.jsx";

function recordTable() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);
    const [onRecords, setOnRecords] = useState(false);
    const { user } = useAuth();
    const [searchInput, setSearchInput ] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { records, loading, error } = GetRecords(searchQuery);

    const openDialog = (item, delBtn) => {
      setDialogData(item);
      setIsDialogOpen(true);
      setIsDeleteButton(delBtn);
      setOnRecords(true);
    };

    const closeDialog = () => {
      setIsDialogOpen(false);
      setIsDeleteButton(false);
    };

    const handleSearch = (e) =>{
      
      e.preventDefault();
      setSearchQuery(searchInput);
    }

     const handleSearchChange = (e) => {
       setSearchInput(e.target.value);

       if (e.target.value === "") {
         setSearchQuery("");
       }
     };

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
    const sortedRecords = useMemo(() => {
      let sorted = [...records];
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
    }, [records, sortConfig]); 
    
    return (
      <>
        <div className="searcherSorter">
          <form onSubmit={handleSearch}>
            <label htmlFor="searchBar">Search For a Record</label>
            <input
              type="search"
              name="searchBar"
              id="searchBar"
              value={searchInput}
              onChange={handleSearchChange}
            />
            <input type="submit" value="🔎Search" className="searchBtn" />
          </form>
        </div>
        <div className="transTable extendWidth">
          <table className="actTransTable">
            <colgroup>
              {user.usr_role === "ADMIN" || user.usr_role === "RECEIVER" ? (
                <>
                  <col style={{ width: "6px" }} />
                  <col style={{ width: "9vw" }} />
                  <col style={{ width: "9vw" }} />
                  <col style={{ width: "13vw" }} />
                </>
              ) : (
                <>
                  <col style={{ width: "6px" }} />
                  <col style={{ width: "15vw" }} />
                  <col style={{ width: "18vw" }} />
                </>
              )}
            </colgroup>
            <thead className="transTableHead">
              <tr>
                {/* Added onClick and cursor style to make headers clickable */}
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("record_id")}
                >
                  RecordID{getSortIndicator("record_id")}
                </th>
                {user.usr_role === "RECEIVER" || user.usr_role === "ADMIN" ? (
                  <th
                    style={{ cursor: "pointer" }}
                    onClick={() => requestSort("office_dept")}
                  >
                    Office{getSortIndicator("office_dept")}
                  </th>
                ) : (
                  ""
                )}

                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("records_title")}
                >
                  Title{getSortIndicator("records_title")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("rec_description")}
                >
                  Description{getSortIndicator("rec_description")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("rec_code")}
                >
                  Code{getSortIndicator("rec_code")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("retention_period")}
                >
                  Retention Period{getSortIndicator("retention_period")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("remarks")}
                >
                  Remarks{getSortIndicator("remarks")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("created_at")}
                >
                  Created At{getSortIndicator("created_at")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("modified_at")}
                >
                  Modified At{getSortIndicator("modified_at")}
                </th>
                <th>⠀⠀⠀⠀⠀⠀⠀⠀⠀</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton stays inside the table - no layout shift
                <TableSkeleton rowCount={5} colCount={9} />
              ) : error ? (
                <tr>
                  <td colSpan={8}>
                    <ErrorMessage message={error} onRetry={refetch} />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <h1>
                      {searchInput ? "No Record of Found" : "No Data Available"}
                    </h1>
                  </td>
                </tr>
              ) : (
                sortedRecords.slice(0, 10).map((data) => (
                  <tr key={data.record_id} className="fade-in">
                    <td>{data.record_id}</td>
                    {user.usr_role === "RECEIVER" ||
                    user.usr_role === "ADMIN" ? (
                      <td>{data.office_dept}</td>
                    ) : (
                      ""
                    )}
                    <td>{data.records_title}</td>
                    <td>{data.rec_description}</td>
                    <td>{data.rec_code}</td>
                    <td>{data.retention_period}</td>
                    <td>{data.remarks}</td>
                    <td>{data.created_at}</td>
                    <td>{data.modified_at}</td>
                    <td>
                      <>
                        <button
                          type="button"
                          className="btnView"
                          onClick={() => openDialog(data, false)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="delBtn"
                          onClick={() => openDialog(data, true)}
                        >
                          Delete
                        </button>
                      </>
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

export default recordTable;
