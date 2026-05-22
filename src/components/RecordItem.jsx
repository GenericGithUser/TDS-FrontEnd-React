import '../styles/recordItem.css'

function RecordItem({ recordData, delItm }){
    return (
      <>
        <div className="includedRecord">
          <div className="recordData">
            <span className="num1">{recordData.itemNum} </span>
            <span className="id">{recordData.recordId} </span>
            <span className="title">{recordData.title}</span>

            <button
              className="delItemBtn"
              onClick={() => delItm(recordData.recordId)}
            >
              <svg
                className="delItemBtnImg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="red"
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