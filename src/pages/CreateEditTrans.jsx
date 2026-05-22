import "../styles/records.css";
import "../styles/createEdit.css";
import { useEffect, useState } from "react";
import dummyData from "../assets/dummyData.js";
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import IncRecordList from "../components/IncRecordList.jsx";
import RecordInput from "../components/RecordInput.jsx";
import { Helmet } from "react-helmet-async";

// Derive unique division list from data
const ALL_DIVISIONS = [...new Set(dummyData.map((r) => r.division))].sort();

function CreateEditTrans() {
  const { navData, clearRouteData } = useNavigationData();
  const navigate = useNavigate();

  const [includedRecords, setIncludedRecords] = useState([]);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [divisionInput, setDivisionInput] = useState("");

  const isEdit = navData?.mode === "edit";
  const titlePrefix =
    navData?.mode === "edit"
      ? "Edit"
      : navData?.mode === "create"
        ? "Create"
        : "No Nav Data";
  const pageTitle = `${titlePrefix} Transmission`.trim();

  // On edit mode: pre-populate records and divisions from transId
  useEffect(() => {
    console.log("navData:", navData);
    console.log("useEffect fired", isEdit, navData?.transId);
    if (isEdit && navData?.transId) {
      const matchingRecords = dummyData
        .filter((r) => r.transId === navData.transId)
        .map((r, index) => ({
          recordId: r.recordId,
          title: r.title,
          division: r.division,
          itemNum: index + 1,
        }));
      console.log("matchingRecords:", matchingRecords);
      setIncludedRecords(matchingRecords);

      // Pre-populate divisions from the matched records
      const divisions = [...new Set(matchingRecords.map((r) => r.division))];
      setSelectedDivisions(divisions);
    }
  }, [isEdit, navData?.transId]);

  if (!navData) {
    return <h1>No NavData</h1>;
  }

  // --- Division tag handlers ---
  const addDivision = (div) => {
    if (!div || selectedDivisions.includes(div)) return;
    setSelectedDivisions((prev) => [...prev, div]);
    setDivisionInput("");
  };

  const removeDivision = (div) => {
    setSelectedDivisions((prev) => prev.filter((d) => d !== div));
  };

  const handleDivisionKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDivision(divisionInput.trim());
    }
  };

  // --- Record handlers ---
  const addIncludedRecords = (recordsArray) => {
    if (!recordsArray?.length) return;
    setIncludedRecords((prev) => {
      const existings = new Set(prev.map((r) => r.recordId));
      const newUnique = recordsArray.filter((r) => !existings.has(r.recordId));
      const combined = [...prev, ...newUnique];
      return combined.map((record, index) => ({
        ...record,
        itemNum: index + 1,
      }));
    });
  };

  const delItm = (id) => {
    const items = includedRecords.filter((record) => record.recordId !== id);
    setIncludedRecords(
      items.map((record, index) => ({
        ...record,
        itemNum: index + 1,
      })),
    );
  };

  // Filter recordList by selected divisions (show all if none selected)
  const filteredRecordList =
    selectedDivisions.length > 0
      ? dummyData.filter((r) => selectedDivisions.includes(r.division))
      : dummyData;

  // --- Form actions ---
  const handleSave = (e) => {
    e.preventDefault();
    const destination = navData.returnTo;
    clearRouteData();
    navigate(destination);
  };

  const handleCancel = () => {
    const destination = navData.returnTo;
    clearRouteData();
    navigate(destination);
  };

  // Shared form JSX (used for both create and edit)
  const formContent = (
    <div className="createBox">
      <form id="createForm" method="post">
        {/* Division multi-select */}
        <div className="r2">
          <div className="item">
            <label className="transLabel">Division(s):</label>

            {/* Tag chips */}
            <div className="divisionTags">
              {selectedDivisions.map((div) => (
                <span key={div} className="divisionTag">
                  {div}
                  <button
                    type="button"
                    className="divisionTagRemove"
                    onClick={() => removeDivision(div)}
                    aria-label={`Remove ${div}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Dropdown + text input combo */}
            <div className="divisionInputRow">
              <input
                type="text"
                className="recInput"
                placeholder="Type or select a division..."
                value={divisionInput}
                onChange={(e) => setDivisionInput(e.target.value)}
                onKeyDown={handleDivisionKeyDown}
                list="divisionOptions"
                id="divisionInput"
              />
              <datalist id="divisionOptions">
                {ALL_DIVISIONS.filter(
                  (d) => !selectedDivisions.includes(d),
                ).map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
              <button
                type="button"
                className="btnCancel btnAddDiv"
                onClick={() => addDivision(divisionInput.trim())}
              >
                Add
              </button>
            </div>

            {selectedDivisions.length > 0 && (
              <p className="divisionHint">
                Showing records from:{" "}
                <strong>{selectedDivisions.join(", ")}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Record picker — filtered by selected divisions */}
        <div className="r2">
          <div className="item">
            <RecordInput
              recordList={filteredRecordList}
              addIncludedRecords={addIncludedRecords}
            />
          </div>
        </div>

        {/* Included records list */}
        <div className="r2">
          <IncRecordList includedRecords={includedRecords} delItm={delItm} />
        </div>

        <div className="r2">
          <div className="item"></div>
          <div className="item"></div>
        </div>

        <div className="buttonCont">
          <input
            type="submit"
            defaultValue="Send For Approval"
            className="btnGreen"
            onClick={handleSave}
          />
          <button className="btnCancel" type="button" onClick={handleCancel}>
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <h1 className="ceTitle">Send A Transmission</h1>
      {(navData.mode === "create" || navData.mode === "edit") && formContent}
    </>
  );
}

export default CreateEditTrans;
