import "../styles/recordItem.css";
import "../styles/tableTemp.css";
import "../styles/transtable.css";

import { useState, useRef, useEffect } from "react";

function RecordInput({
  recordList,
  addIncludedRecords,
  includedRecords = [],
  isEdit = false,
}) {
  const [diagOpen, setDiagOpen] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const diagRef = useRef(null);

  useEffect(() => {
    const dialogNode = diagRef.current;
    if (!dialogNode) return;
    if (diagOpen) dialogNode.showModal();
    else dialogNode.close();
  }, [diagOpen]);

  const handleOpens = () => {
    setSelectedRecords({}); // clear previous selections on open
    setSearchTerm(""); // clear search on open
    setDiagOpen(true);
  };

  const handleCloses = () => {
    setDiagOpen(false);
  };

  const handleCheckbox = (item) => {
    setSelectedRecords((prev) => {
      const newState = { ...prev };
      if (newState[item.record_id]) {
        delete newState[item.record_id];
      } else {
        newState[item.record_id] = item;
      }
      return newState;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selected = Object.values(selectedRecords);
    if (selected.length === 0) return;
    addIncludedRecords(selected);
    handleCloses();
  };

  // Filter out records already in the included list
  const existingIds = new Set(includedRecords.map((r) => r.record_id));
  const availableRecords = recordList.filter(
    (r) => !existingIds.has(r.record_id),
  );

  // Apply search on top of the already-filtered list
  const displayedRecords = searchTerm.trim()
    ? availableRecords.filter(
        (r) =>
          r.records_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.rec_code?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : availableRecords;

  const selectedCount = Object.keys(selectedRecords).length;

  return (
    <>
      <div className="btnInc btnCancel" onClick={handleOpens}>
        Add Records
      </div>

      <dialog className="inputDiag shrinker" ref={diagRef}>
        <h1 style={{ textAlign: "center" }}>Add Existing Record</h1>

        <div className="records">
          <div className="searcherSorter">
            <div className="searchForm">
              <label htmlFor="searchBar">Search For a Record</label>
              <input
                type="search"
                name="searchBar"
                id="searchBar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or code..."
              />
            </div>
          </div>

          <div className="transTable shrinker">
            <table className="actTransTable">
              <colgroup>
                <col style={{ width: "10px" }} />
                <col style={{ width: "16vw" }} />
                <col style={{ width: "1vw" }} />
              </colgroup>
              <thead className="transTableHead">
                <tr>
                  <th>RecordID</th>
                  <th>Title</th>
                  <th>⠀⠀⠀⠀⠀⠀⠀⠀⠀</th>
                </tr>
              </thead>
              <tbody>
                {displayedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center" }}>
                      <h1>
                        {searchTerm
                          ? `No records found for "${searchTerm}"`
                          : availableRecords.length === 0
                            ? "All records have been added"
                            : "No Data Available"}
                      </h1>
                    </td>
                  </tr>
                ) : (
                  displayedRecords.slice(0, 10).map((record) => (
                    <tr key={record.record_id}>
                      <td>{`MEM-${String(record.record_id).padStart(4, "0")}`}</td>
                      <td>{record.records_title}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={!!selectedRecords[record.record_id]}
                          onChange={() => handleCheckbox(record)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="btnFrame">
          <input
            type="submit"
            value={selectedCount > 0 ? `SUBMIT (${selectedCount})` : "SUBMIT"}
            className="btnGreen"
            onClick={handleSubmit}
            disabled={selectedCount === 0}
          />
          <button className="btnCancel" type="button" onClick={handleCloses}>
            Cancel
          </button>
        </div>
      </dialog>
    </>
  );
}

export default RecordInput;
