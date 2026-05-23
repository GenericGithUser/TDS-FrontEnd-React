import '../styles/summary.css'
import { useAuth } from '../context/AuthContext';
function summaryBoardAdmin(){
    const { user } = useAuth();

    return (
      <>
        <div className="summaries">
          <div className="data">
            <div className='dataBox'>
              <div className="dBox">
                <h2 className="boxDesc fin">Total Transmissions</h2>
                <h1 className="finNum num" id="finNum">
                  20
                </h1>
              </div>
              <div className="dBox">
                <h2 className="boxDesc sen">Total Records</h2>
                <h1 className="finNum num" id="sentNum">
                  21
                </h1>
              </div>
              <div className="dBox">
                <h2 className="boxDesc inc">Password Resets</h2>
                <h1 className="finNum num" id="incNum">
                  0
                </h1>
              </div>
              <div className="dBox ">
                <h2 className="boxDesc pen">Problem Tickets</h2>
                <h1 className="finNum num" id="penNum">
                    0
                </h1>
              </div>
            </div>
          </div>
          <div className='buttonGrid'>
            <div className="viewButton">
              <button type="submit" className="btnFin btn">
                View All
              </button>
            </div>
            <div className="viewButton">
              <button type="submit" className="btnSen btn">
                View All
              </button>
            </div>
            <div className="viewButton">
              <button type="submit" className="btnInc btn">
                View Latest
              </button>
            </div>
            <div className="viewButton">
                <button type="submit" className="btnPen btn">
                  View Tickets
                </button>
            </div>
          </div>
        </div>
      </>
    );
}

export default summaryBoardAdmin;

