import "../styles/tableTemp.css";
import "../styles/transtable.css";
import { useState, useMemo, useEffect } from "react";
import UsableDialog from "./usableDialog";
import DUMMY_USR from "../assets/dummyUserData";
import { GetUsers } from "../hooks/GetUsers";
import { TableSkeleton, ErrorMessage } from "./Loading";
import { Switch } from "@base-ui/react";

function UserTable() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);
    const [onRecords, setOnRecords] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const [onlyDeleted, setOnlyDeleted] = useState(false);
    const {users, loading, error, refetch, fetchDisabledUsers} = GetUsers(searchQuery, includeDeleted);

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

    const handleFetchDisabled = async (e) => {
      const checked = e.target.checked;
      setOnlyDeleted(checked);
      if (checked) {
        setIncludeDeleted(false); // ← uncheck "include disabled" when "only disabled" is checked
      }
    };
    
    useEffect(()=>{
      if (onlyDeleted === true) {
        fetchDisabledUsers();
      }else{
        refetch();
      }
    }, [onlyDeleted])
    const [sortConfig, setSortConfig] = useState({
          key: "request_reset",
          direction: "desc",
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
        const sortedUsers = useMemo(() => {
          let sorted = [...users];
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
        }, [users, sortConfig]);
    

    
    return (
      <>
        <div className="searcherSorter">
          <form onSubmit={handleSearch}>
            <label htmlFor="searchBar">Search For a User</label>
            <input
              type="search"
              name="searchBar"
              id="searchBar"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search By Name/ID"
            />
            <input type="submit" value="🔎Search" className="searchBtn" />
            <br />
            <label htmlFor="incDisabled" className="lblDis">
              Include Disabled?
            </label>
            <input
              type="checkbox"
              name="incDisabled"
              id="incDisabled"
              checked={includeDeleted}
              onChange={(e) => {
                setIncludeDeleted(e.target.checked);
                if (e.target.checked) {
                  setOnlyDeleted(false); // ← uncheck "only disabled" when "include disabled" is checked
                }
                refetch();
              }}
            />
          </form>
          <div className="opts">
            <p className="lblDis">Show Only Disabled?</p>
            <label htmlFor="onlyDisabled" className="lblDis toggle-switch">
              <input
                type="checkbox"
                name="onlyDisabled"
                id="onlyDisabled"
                className="toggle-input"
                checked={onlyDeleted}
                onChange={(e) => {
                  handleFetchDisabled(e);
                }}
              />
              <span className="toggle-slider"></span>
            </label>
            
          </div>
        </div>
        <div className="transTable">
          <table className="actTransTable">
            <colgroup>
              <col style={{ width: "10vw" }} />
              <col style={{ width: "15vw" }} />
              <col style={{ width: "10vw" }} />
            </colgroup>
            <thead className="transTableHead">
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("user_id")}
                >
                  Employee ID{getSortIndicator("user_id")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("emp_name")}
                >
                  Name{getSortIndicator("emp_name")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("usr_role")}
                >
                  Role{getSortIndicator("usr_role")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("office_dept")}
                >
                  Office{getSortIndicator("office_dept")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => requestSort("request_reset")}
                >
                  Needs Resetting{getSortIndicator("request_reset")}
                </th>

                {/* <th>Employee ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Office</th> */}
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
                    <ErrorMessage message={error} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <h1>No Data Available</h1>
                  </td>
                </tr>
              ) : (
                sortedUsers.map((data) => (
                  <tr key={data?.user_id} className="fade-in">
                    <td>{`MEM-${String(data?.user_id).padStart(4, "0")}`}</td>
                    <td>{data?.emp_name}</td>
                    <td>{data?.usr_role}</td>
                    <td>{data?.office_dept}</td>
                    <td>{data?.request_reset}</td>
                    <td>
                      <>
                        <button
                          type="button"
                          className="btnView"
                          onClick={() => openDialog(data, false)}
                        >
                          Details
                        </button>
                      </>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <UsableDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          data={dialogData}
          isDeleteButton={isDeleteButton}
          onRecords={onRecords}
          onRefetch={refetch}
        />
      </>
    );
}

export default UserTable;
