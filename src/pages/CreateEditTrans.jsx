import "../styles/records.css";
import "../styles/createEdit.css";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import IncRecordList from "../components/IncRecordList.jsx";
import RecordInput from "../components/RecordInput.jsx";
import { Helmet } from "react-helmet-async";
import { GetDivisions } from "../hooks/GetDivisions.jsx";
import { GetRecords } from "../hooks/GetRecords.jsx";
import { GetTransmissions } from "../hooks/GetTranssmissions.jsx";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/Loading.jsx";
import "../styles/loading.css";


function CreateEditTrans() {
  const { navData, clearRouteData } = useNavigationData();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { divisions } = GetDivisions();
  const { records, fetchUnassignedRecords } = GetRecords();
  const [unassignedRecords, setUnassignedRecords] = useState([]);

  // ── All API calls now come from the hook, no direct api imports needed ──────
  const {
    getTransmissionById,
    createTransmission,
    updateTransmission,
    addRecord,
    removeRecord,
    replaceRecords,
  } = GetTransmissions();

  const ALL_DIVISIONS = divisions.map((div) => div.division);

  // ── Form state ──────────────────────────────────────────────────────────────
  const [includedRecords, setIncludedRecords] = useState([]);

  // Store both id and name since DB needs division_id (int), UI shows name
  const [selectedDivision, setSelectedDivision] = useState({
    id: null,
    name: "",
  });
  const [divisionInput, setDivisionInput] = useState("");

  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const isEdit = navData?.mode === "edit";
  const titlePrefix = isEdit
    ? "Edit"
    : navData?.mode === "create"
      ? "Create"
      : "No Nav Data";
  const pageTitle = `${titlePrefix} Transmission`.trim();

  // ── Pre-populate on edit ────────────────────────────────────────────────────
  const loadTransmissionForEdit = useCallback(
    async (transId) => {
      try {
        setIsFetching(true);
        setFetchError(null);

        // Uses hook method instead of direct api call
        const result = await getTransmissionById(transId);

        if (!result.success) {
          setFetchError(result.error);
          return;
        }

        const trans = result.data;
        if (!trans) return;

        // Match division_id to get both id and name
        const match = divisions.find(
          (d) => d.division_id === trans.division_id,
        );
        if (match) {
          setSelectedDivision({ id: match.division_id, name: match.division });
          setDivisionInput(match.division);
        }

        // Pre-populate included records
        if (trans.records && trans.records.length > 0) {
          setIncludedRecords(
            trans.records.map((r, index) => ({
              ...r,
              itemNum: index + 1,
            })),
          );
        }
      } catch (err) {
        setFetchError(err.message || "Failed to load transmission data");
      } finally {
        setIsFetching(false);
      }
    },
    [divisions, getTransmissionById],
  );
  // divisions in deps so division matching works after they load

  useEffect(() => {
    if (isEdit && navData?.transId) {
      loadTransmissionForEdit(navData.transId);
    }
  }, [isEdit, navData?.transId, loadTransmissionForEdit]);

  // Fetch unassigned records on mount
  useEffect(() => {
    const load = async () => {
      const result = await fetchUnassignedRecords();
      if (!result.success) return;

      if (isEdit && navData?.transId) {
        // Get the current transmission's records to add back to the available list
        const transResult = await getTransmissionById(navData.transId);
        const currentRecords = transResult.data?.records ?? [];

        // Combine unassigned + records already in THIS transmission
        const combined = [...result.data, ...currentRecords];

        // Deduplicate by record_id
        const unique = [
          ...new Map(combined.map((r) => [r.record_id, r])).values(),
        ];
        setUnassignedRecords(unique);
      } else {
        setUnassignedRecords(result.data);
      }
    };
    load();
  }, [fetchUnassignedRecords, isEdit, navData?.transId]);

  if (!navData) return <h1>No NavData</h1>;
  if (isFetching) return <Spinner text="Fetching Records..." />;
  if (fetchError) return <p>Error: {fetchError}</p>;

  // ── Division handlers ───────────────────────────────────────────────────────
  const handleDivisionSelect = (divisionName) => {
    const match = divisions.find((d) => d.division === divisionName);
    if (match) {
      setSelectedDivision({ id: match.division_id, name: match.division });
      setDivisionInput(match.division);
    }
  };

  const handleDivisionKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleDivisionSelect(divisionInput.trim());
    }
  };

  const clearDivision = () => {
    setSelectedDivision({ id: null, name: "" });
    setDivisionInput("");
  };

  // ── Record handlers ─────────────────────────────────────────────────────────
  const addIncludedRecords = (recordsArray) => {
    if (!recordsArray?.length) return;
    setIncludedRecords((prev) => {
      const existing = new Set(prev.map((r) => r.record_id));
      const newUnique = recordsArray.filter((r) => !existing.has(r.record_id));
      const combined = [...prev, ...newUnique];
      return combined.map((record, index) => ({
        ...record,
        itemNum: index + 1,
      }));
    });
  };

  const delItm = (id) => {
    setIncludedRecords((prev) => {
      const filtered = prev.filter((record) => record.record_id !== id);
      return filtered.map((record, index) => ({
        ...record,
        itemNum: index + 1,
      }));
    });
  };

  // ── Form submission ─────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();

    if (!selectedDivision.id) {
      alert("Please select a valid division.");
      return;
    }

    if (includedRecords.length === 0) {
      alert("Please add at least one record.");
      return;
    }

    try {
      setIsSaving(true);

      if (isEdit) {
        // 1. Update division on the transmission
        const updateResult = await updateTransmission(navData.transId, {
          division_id: selectedDivision.id,
        });

        if (!updateResult.success) {
          alert(`Failed to update: ${updateResult.error}`);
          return;
        }

        // Single call replaces ALL records atomically
        // No need to manually delete then re-add one by one
        const replaceResult = await replaceRecords(
          navData.transId,
          includedRecords.map((r) => ({
            record_id: r.record_id,
            item_no: r.itemNum,
          })),
        );

        if (!replaceResult.success) {
          alert(`Failed to update records: ${replaceResult.error}`);
          return;
        }
      } else {
        // 1. Create the transmission
        const createResult = await createTransmission({
          sent_date: new Date().toISOString().split("T")[0],
          sd_branch_id: user.branch_id,
          division_id: selectedDivision.id, // send ID not name
          p_employee_id: user.employee_id,
        });

        if (!createResult.success) {
          alert(`Failed to create: ${createResult.error}`);
          return;
        }

        const newTransId = createResult.data.trans_id;

        // 2. Add all included records
        for (const record of includedRecords) {
          await addRecord(newTransId, record.record_id, record.itemNum);
        }
      }

      const destination = navData.returnTo;
      clearRouteData();
      navigate(destination);
    } catch (err) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const destination = navData.returnTo;
    clearRouteData();
    navigate(destination);
  };

  // ── Form JSX ────────────────────────────────────────────────────────────────
  const formContent = (
    <div className="createBox fade-in">
      <form id="createForm" method="post">
        {/* Division - single select */}
        <div className="r2">
          <div className="item">
            <label className="transLabel">Division:</label>
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
                {ALL_DIVISIONS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
              <button
                type="button"
                className="btnCancel btnAddDiv"
                onClick={() => handleDivisionSelect(divisionInput.trim())}
              >
                Set
              </button>
              {selectedDivision.id && (
                <button
                  type="button"
                  className="btnCancel btnAddDiv red"
                  onClick={clearDivision}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          {selectedDivision.name && (
            <>
              <p className="divisionHint">
                Division: <strong>{selectedDivision.name}</strong>
              </p>
            </>
          )}
        </div>

        {/* Record picker */}
        <div className="r2">
          <div className="item">
            <RecordInput
              recordList={unassignedRecords}
              addIncludedRecords={addIncludedRecords}
              isEdit={isEdit}
            />
          </div>
        </div>

        {/* Included records list */}
        <div className="r2">
          <IncRecordList
            includedRecords={includedRecords}
            delItm={delItm}
            transId={navData?.transId}
          />
        </div>

        <div className="buttonCont">
          <input
            type="submit"
            value={
              isSaving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Send For Approval"
            }
            className="btnGreen"
            onClick={handleSave}
            disabled={isSaving}
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
      <h1 className="ceTitle">
        {navData.mode === "create" ? "Send" : "Edit"} Transmission
      </h1>
      {(navData.mode === "create" || navData.mode === "edit") && formContent}
    </>
  );
}

export default CreateEditTrans;
