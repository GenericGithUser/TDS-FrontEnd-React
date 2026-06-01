import '../styles/recordItem.css'
import RecordItem from "./RecordItem.jsx";

function IncRecordList({ includedRecords, delItm, transId }){
    return(
        <>
            <div className="recordBox">
                {includedRecords.map((recordItem)=>(
                    <RecordItem
                        key={recordItem.record_id} 
                        recordData={recordItem}
                        delItm={delItm}
                        transId={transId}
                    />
                ))}
            </div>
        </>
    );
}

export default IncRecordList;