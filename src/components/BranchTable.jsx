import "../styles/tableTemp.css";
import "../styles/transtable.css";
import { useState, useMemo } from "react";
import UsableDialog from "./usableDialog";
import { GetBranch } from "../hooks/GetBranch";
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { TableSkeleton, ErrorMessage } from "./Loading";

function BranchTable() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);
    const [onRecords, setOnRecords] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { setRouteData } = useNavigationData();
    const { branches, branchError, branchLoading, refetch  } = GetBranch(searchQuery);

    const openDialog = (item, delBtn) => {
      
      setDialogData(item);
      
      setIsDialogOpen(true);
      
      setIsDeleteButton(delBtn);
      setOnRecords(false);
    };

    const closeDialog = () => {
      setIsDialogOpen(false);
      setIsDeleteButton(false);
    };

    const handleSearch = (e) => {
      e.preventDefault();
      setSearchQuery(searchInput);
    };

    const handleSearchChange = (e) => {
      setSearchInput(e.target.value);

      if (e.target.value === "") {
        setSearchQuery("");
      }
    };

    const handleEditBranch = (data) =>{
      const sendData = {
        mode: "edit",
        data: data,
        returnTo: "/dashboard/branches",
        callback: () => console.log("Success"),
      };
      setRouteData(sendData);
      navigate("edit");
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
        const sortedBranch = useMemo(() => {
          let sorted = [...branches];
          if (sortConfig.key) {
            sorted.sort((a, b) => {
              let valA = a[sortConfig.key];
              let valB = b[sortConfig.key];
    
              // Handle null/undefined values
              if (valA == null) valA = "";
              if (valB == null) valB = "";
              
              if (sortConfig.key === "user_id") {
                // Sort by the raw underlying number instead of the "MEM-XXXX" string
                valA = Number(a.user_id) || 0;
                valB = Number(b.user_id) || 0;
              }
              // Special handling for dates to ensure chronological sorting
              else if (sortConfig.key === "sent_date") {
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
        }, [branches, sortConfig]);
    

    
    return (
      <>
        <div className="searcherSorter">
          <form onSubmit={handleSearch}>
            <label htmlFor="searchBar">Search For a Branch</label>
            <input
              type="search"
              name="searchBar"
              id="searchBar"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search by Office/BusinessArea/ID"
            />
            <input type="submit" value="🔎Search" className="searchBtn" />
          </form>
        </div>
        <div className="transTable">
          <table className="actTransTable">
            <colgroup>
              <col style={{ width: "12vw" }} />
              <col style={{ width: "20vw" }} />
              <col style={{ width: "20vw" }} />
              <col style={{ width: "15vw" }} />
            </colgroup>
            <thead className="transTableHead">
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("branch_id")}
                >
                  Branch ID{getSortIndicator("branch_id")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("office_dept")}
                >
                  Office{getSortIndicator("office_dept")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("business_area")}
                >
                  Business Area{getSortIndicator("business_area")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("branch_code")}
                >
                  Branch Code{getSortIndicator("branch_code")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("employee_count")}
                >
                  Number of Employees{getSortIndicator("employee_count")}
                </th>

                {/* <th>Employee ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Office</th> */}
                <th>⠀⠀⠀⠀⠀⠀⠀⠀⠀</th>
              </tr>
            </thead>
            <tbody>
              {branchLoading ? (
                // Skeleton stays inside the table - no layout shift
                <TableSkeleton rowCount={5} colCount={8} />
              ) : branchError ? (
                <tr>
                  <td colSpan={8}>
                    <ErrorMessage message={branchError} />
                  </td>
                </tr>
              ) : branches.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <h1>No Data Available</h1>
                  </td>
                </tr>
              ) : (
                sortedBranch.map((data) => (
                  <tr key={data.branch_id} className="fade-in">
                    <td>{`MB-${String(data.branch_id).padStart(4, "0")}`}</td>
                    <td>{data.office_dept}</td>
                    <td>{data.business_area}</td>
                    <td>{data.branch_code}</td>
                    <td>{data.employee_count}</td>
                    <td>
                      <button
                        type="button"
                        className="btnView"
                        onClick={() => openDialog(data, false)}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        className="btnEdit"
                        onClick={() => handleEditBranch(data)}
                      >
                        Edit
                      </button>
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

export default BranchTable;
