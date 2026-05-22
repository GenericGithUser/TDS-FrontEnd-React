import '../styles/summary.css'
import { useAuth } from '../context/AuthContext';
function summaryBoard(){
    const { user } = useAuth();

    return (
      <>
        <div className="summaries">
          <div className="data">
            <div className={user.role != "receiver" ? "dataBox" : "dataBox2"}>
              <div className="dBox">
                <h2 className="boxDesc fin">Finished Transmissions</h2>
                <h1 className="finNum num" id="finNum">
                  10
                </h1>
              </div>
              <div className="dBox">
                <h2 className="boxDesc sen">Sent Transmissions</h2>
                <h1 className="finNum num" id="sentNum">
                  6
                </h1>
              </div>
              <div className="dBox">
                <h2 className="boxDesc inc">Incomplete Transmissions</h2>
                <h1 className="finNum num" id="incNum">
                  2
                </h1>
              </div>
              {user.role !== "receiver" && (
                <div className="dBox ">
                  <h2 className="boxDesc pen">Pending Transmissions</h2>
                  <h1 className="finNum num" id="penNum">
                    2
                  </h1>
                </div>
              )}
            </div>
          </div>
          <div className={user.role !== "receiver" ? "buttonGrid" : "buttonGrid2"}>
            <div className="viewButton">
              <button type="submit" className="btnFin btn">
                View Recent
              </button>
            </div>
            <div className="viewButton">
              <button type="submit" className="btnSen btn">
                View Recent
              </button>
            </div>
            <div className="viewButton">
              <button type="submit" className="btnInc btn">
                View Recent
              </button>
            </div>
            {user.role !== "receiver" && (
              <div className="viewButton">
                <button type="submit" className="btnPen btn">
                  View Recent
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
}

export default summaryBoard;

