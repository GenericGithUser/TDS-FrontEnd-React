import "../styles/tableTemp.css";
import "../styles/transtable.css";
import { useState } from "react";
import UsableDialog from "./usableDialog";
import DUMMY_USR from "../assets/dummyUserData";

function UserTable() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);
    const [onRecords, setOnRecords] = useState(false);

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
    
    return (
      <>
        <div className="searcherSorter">
          <form action="" method="get">
            <label htmlFor="searchBar">Search For a User</label>
            <input type="search" name="searchBar" id="searchBar" />
            <input type="submit" value="🔎Search" className="searchBtn" />
          </form>
        </div>
        <div className="transTable">
          <table className="actTransTable">
            <colgroup>
              <col style={{ width: "10vw" }} />
              <col style={{ width: "18vw" }} />
              <col style={{ width: "10vw" }} />
            </colgroup>
            <thead className="transTableHead">
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Office</th>
                <th>⠀⠀⠀⠀⠀⠀⠀⠀⠀</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_USR.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <h1>No Data Available</h1>
                  </td>
                </tr>
              ) : (
                DUMMY_USR.slice(0, 10).map((data) => (
                  <tr key={data.id}>
                    <td>{data.id}</td>
                    <td>{data.name}</td>
                    <td>{data.role.toUpperCase()}</td>
                    <td>{data.branch}</td>
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

export default UserTable;
