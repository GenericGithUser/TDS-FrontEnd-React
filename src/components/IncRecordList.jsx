import '../styles/recordItem.css'
import RecordItem from "./RecordItem.jsx";

function IncRecordList({ includedRecords, delItm }){
    return(
        <>
            <div className="recordBox">
                {includedRecords.map((recordItem)=>(
                    <RecordItem
                        key={recordItem.record_id} 
                        recordData={recordItem}
                        delItm={delItm}
                    />
                ))}
            </div>
        </>
    );
}

export default IncRecordList;