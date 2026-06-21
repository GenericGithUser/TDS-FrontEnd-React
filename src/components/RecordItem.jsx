import '../styles/recordItem.css'
import '../styles/tabletemp.css'
import { GetChecklistItems } from "../hooks/GetChecklistItems";
import { useNavigate, useLocation } from "react-router-dom";
import { useNavigationData } from "../components/NavigationDataContext";
import { FaEdit } from "react-icons/fa";

function RecordItem({ recordData, delItm, transId }){
  const { checkItems, instantFetchChecklist } = GetChecklistItems();
  const { navData, clearRouteData, setRouteData } = useNavigationData();
  const navigate = useNavigate();
  const location = useLocation();
  const handleEditRecord = async (e) => {
    e.preventDefault();
    let chkData;
    // if(!recordData?.record_id){
    //   return
    // }
    // else{
      chkData = await instantFetchChecklist(recordData?.record_id);
    // }
    const sendData = {
      mode: "edit",
      data: recordData,
      recordId: recordData.record_id,
      trans_id: transId,
      checklistData: chkData,
      fromTransEdit: 1,
      returnTo: location,
    };
    setRouteData(sendData);
    navigate("/dashboard/home/edit/record");
  };
    return (
      <>
        <div className={`includedRecord ${recordData.feedback !== null ? "backRed": ""}`}>
          <div className="recordData">
            <span className="num1">{recordData.itemNum} </span>
            <span className="id">
              {`SR-${String(recordData.record_id).padStart(4, "0")}`}
            </span>
            <span className="title">{recordData.records_title}</span>

            <button className="editItemButton" onClick={handleEditRecord}>
              <FaEdit />
            </button>

            <button
              className="delItemBtn"
              onClick={() => delItm(recordData.record_id)}
            >
              <svg
                className="delItemBtnImg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </>
    );
}
export default RecordItem