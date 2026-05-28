import "../styles/tableTemp.css";
import "../styles/transtable.css";
import { useState } from "react";
import UsableDialog from "./usableDialog";
import dummyData from "../assets/dummyData.js";

function recordTable() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);
    const [onRecords, setOnRecords] = useState(false);

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
    
    return (
      <>
        <div className="searcherSorter">
          <form action="" method="get">
            <label htmlFor="searchBar">Search For a Record</label>
            <input type="search" name="searchBar" id="searchBar" />
            <input type="submit" value="🔎Search" className="searchBtn" />
          </form>
        </div>
        <div className="transTable extendWidth">
          <table className="actTransTable">
            <colgroup>
              {user.role === "admin" || user.role === "receiver" ? (
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
                <th>RecordID</th>
                {user.role === "receiver" || user.role === "admin" ? (
                  <th>Office</th>
                ) : (
                  ""
                )}
                <th>Title</th>
                <th>Description</th>
                <th>Code</th>
                <th>Retention Period</th>
                <th>Remarks</th>
                <th>Created At</th>
                <th>Modified At</th>
                <th>⠀⠀⠀⠀⠀⠀⠀⠀⠀</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <h1>No Data Available</h1>
                  </td>
                </tr>
              ) : (
                dummyData.slice(0, 10).map((data) => (
                  <tr key={data.id}>
                    <td>{data.recordId}</td>
                    {user.role === "receiver" || user.role === "admin" ? (
                      <td>{data.branch}</td>
                    ) : (
                      ""
                    )}
                    <td>{data.title}</td>
                    <td>{data.desc}</td>
                    <td>{data.code}</td>
                    <td>{data.retPeriod}</td>
                    <td>{data.remarks}</td>
                    <td>{data.creDate}</td>
                    <td>{data.modDate}</td>
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
