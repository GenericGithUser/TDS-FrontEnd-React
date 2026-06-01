import '../styles/recordItem.css'
import "../styles/tableTemp.css";
import "../styles/transtable.css";

import { useState, useRef, useEffect } from 'react';
function RecordInput({ recordList, addIncludedRecords }){
    const [diagOpen, setDiagOpen] = useState(false);
    const [selectedRecords, setSelectedRecords] = useState([])
    const diagRef = useRef(null);

    useEffect(()=>{
        const dialogNode = diagRef.current; 
        if (!dialogNode) return;

        if(diagOpen){
            dialogNode.showModal();
        }
        else{
            dialogNode.close();
        }
    }, [diagOpen])

    const handleOpens = () =>{
        setDiagOpen(true)
    }

    const handleCloses = () => {
        setDiagOpen(false)
        
    }

    const handleCheckbox = (item) => {
      setSelectedRecords(prev => {
        const newState = { ...prev };

        if (newState[item.record_id]) {
          delete newState[item.record_id];
        } else {
          newState[item.record_id] = item;
        }
        return newState;
      });
      
    }

    const selected = [...new Map(Object.values(selectedRecords).map(item=> [item.record_id, item])).values()];


    const handleSubmit = (e) =>{
        e.preventDefault();
        addIncludedRecords(selected);
        handleCloses();
        
    };
    
    

    return (
      <>
        <div className="btnInc btnCancel" onClick={handleOpens}>
          Add Records
        </div>
        <dialog className="inputDiag" ref={diagRef}>
          <h1 style={{ textAlign: "center" }}>Add Existing Record</h1>
          <div className="records">
            <div className="searcherSorter">
                <label htmlFor="searchBar">Search For a Record</label>
                <input type="search" name="searchBar" id="searchBar" />
                <input type="submit" value="🔎Search" className="searchBtn" onClick={(e)=> e.preventDefault()}/>
            </div>    
              <div className="transTable">
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
              {recordList.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    <h1>No Data Available</h1>
                  </td>
                </tr>
              ) : (
                recordList.slice(0, 10).map((records) => (
                  <tr key={records.record_id}>
                    <td>{records.record_id}</td>
                    <td>{records.records_title}</td>
                    <td><input type="checkbox" checked={!!selectedRecords[records.record_id]} onChange={()=> handleCheckbox(records)} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
          <div className="btnFrame">
            <input type="submit" value="SUBMIT" className='btnGreen' onClick={handleSubmit} />
            <button className="btnCancel" type='button' onClick={handleCloses}>
              Cancel
            </button>
          </div>
        </dialog>
      </>
    );

}

export default RecordInput;