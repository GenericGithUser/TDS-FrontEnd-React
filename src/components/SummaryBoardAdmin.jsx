import '../styles/summary.css'
import "../styles/loading.css";
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GetTransmissionStats } from "../hooks/GetTranssmissionsStats";
import { StatsSkeleton } from "../components/Loading";
function summaryBoardAdmin(){
    const { user } = useAuth();
    const { stats, loading, error } = GetTransmissionStats();

    return (
      <>
        <div className="summaries">
          <div className="data">
            <div className="dataBox">
              <div className="dBox">
                <h2 className="boxDesc fin">Total Transmissions</h2>
                <h1 className="finNum num fin" id="finNum">
                  {error ? (
                    <p>{error}</p>
                  ) : loading ? (
                    <StatsSkeleton count={1} />
                  ) : (
                    stats.total_transmissions
                  )}
                </h1>
              </div>
              <div className="dBox">
                <h2 className="boxDesc sen">Total Records</h2>
                <h1 className="finNum num sen" id="sentNum">
                  {error ? (
                    <p>{error}</p>
                  ) : loading ? (
                    <StatsSkeleton count={1} />
                  ) : (
                    stats.total_records_in_db
                  )}
                </h1>
              </div>
              <div className="dBox">
                <h2 className="boxDesc inc">Number of Employees</h2>
                <h1 className="finNum num inc" id="incNum">
                  {error ? (
                    <p>{error}</p>
                  ) : loading ? (
                    <StatsSkeleton count={1} />
                  ) : (
                    stats.total_empCount
                  )}
                </h1>
              </div>
              <div className="dBox ">
                <h2 className="boxDesc pen">Number of Branches</h2>
                <h1 className="finNum num pen" id="penNum">
                  {error ? (
                    <p>{error}</p>
                  ) : loading ? (
                    <StatsSkeleton count={1} />
                  ) : (
                    stats.total_branches
                  )}
                </h1>
              </div>
            </div>
          </div>
          <div className="buttonGrid">
            <div className="viewButton">
              <Link to={"/dashboard/transmissions"}>
                <button type="submit" className="btnFin btn">
                  View All
                </button>
              </Link>
            </div>
            <div className="viewButton">
              <Link to={"/dashboard/records"}>
                <button type="submit" className="btnSen btn">
                  View All
                </button>
              </Link>
            </div>
            <div className="viewButton">
              <Link to={"/dashboard/users"}>
              <button type="submit" className="btnInc btn">
                View Employees
              </button>
              </Link>
            </div>
            <div className="viewButton">
              <Link to={"/dashboard/branches"}>
                <button type="submit" className="btnPen btn">
                  View Branches
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
}

export default summaryBoardAdmin;

