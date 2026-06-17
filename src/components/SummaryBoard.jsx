import '../styles/summary.css'
import '../styles/loading.css'
import { useAuth } from '../context/AuthContext';
import { GetTransmissionStats } from '../hooks/GetTranssmissionsStats';
import { StatsSkeleton } from "../components/Loading";
function summaryBoard( { sendFilter }  ){
    const { user } = useAuth();
    const { stats, loading, error } = GetTransmissionStats();


    return (
      <>
        <div className="summaries">
          <div className="data">
            <div
              className={user.usr_role != "RECEIVER" ? "dataBox" : "dataBox2"}
            >
              <div className="dBox fade-in">
                <h2 className="boxDesc fin">Finished Transmissions</h2>
                <h1 className="finNum num" id="finNum">
                  {error ? (
                    <p>{error}</p>
                  ) : loading ? (
                    <StatsSkeleton count={1} />
                  ) : (
                    stats.Finished
                  )}
                </h1>
              </div>
              <div className="dBox fade-in">
                <h2 className="boxDesc sen">Sent Transmissions</h2>
                <h1 className="finNum num" id="sentNum">
                  {error ? (
                    <p>{error}</p>
                  ) : loading ? (
                    <StatsSkeleton count={1} />
                  ) : (
                    stats.Sent
                  )}
                </h1>
              </div>
              <div className="dBox fade-in">
                <h2 className="boxDesc inc">Incomplete Transmissions</h2>
                <h1 className="finNum num" id="incNum">
                  {error ? (
                    <p>{error}</p>
                  ) : loading ? (
                    <StatsSkeleton count={1} />
                  ) : (
                    stats.Incomplete
                  )}
                </h1>
              </div>
              {user.usr_role !== "RECEIVER" && (
                <div className="dBox fade-in">
                  <h2 className="boxDesc pen">Pending Transmissions</h2>
                  <h1 className="finNum num" id="penNum">
                    {error ? (
                      <p>{error}</p>
                    ) : loading ? (
                      <StatsSkeleton count={1} />
                    ) : (
                      stats.Pending
                    )}
                  </h1>
                </div>
              )}
            </div>
          </div>
          <div
            className={
              user.usr_role !== "RECEIVER" ? "buttonGrid" : "buttonGrid2"
            }
          >
            <div className="viewButton">
              <button
                type="submit"
                className="btnFin btn"
                onClick={() => sendFilter("received")}
              >
                View Recent
              </button>
            </div>
            <div className="viewButton">
              <button
                type="submit"
                className="btnSen btn"
                onClick={() => sendFilter("sent")}
              >
                View Recent
              </button>
            </div>
            <div className="viewButton">
              <button
                type="submit"
                className="btnInc btn"
                onClick={() => sendFilter("incomplete")}
              >
                View Recent
              </button>
            </div>
            {user.usr_role !== "RECEIVER" && (
              <div className="viewButton">
                <button
                  type="submit"
                  className="btnPen btn"
                  onClick={() => sendFilter("pending")}
                >
                  View Recent
                </button>
              </div>
            )}
          </div>
          {user.is_head_office && (
            <div className="summaries">
              <div className="dataBox3">
                <div className="dBoxSpecc fade-in restrictor">
                  <div>
                    <h2 className="boxDesc fin">Most Active Branch</h2>
                    <h1 className="finText num" id="finNum">
                      {error ? (
                        <p>{error}</p>
                      ) : loading ? (
                        <StatsSkeleton count={1} />
                      ) : (
                        stats[0]?.office_dept || "N/A"
                      )}
                    </h1>
                  </div>
                  <h2 className="specText">
                    Total Transmissions:
                    {error ? (
                      <p>{error}</p>
                    ) : loading ? (
                      <StatsSkeleton count={1} />
                    ) : (
                      stats[0]?.total_transmissions || "N/A"
                    )}
                  </h2>
                </div>

                <div className="dBoxSpec fade-in ">
                  <div className="statRecent restrictor">
                    <h2 className="boxDescSpec fin">Received Today</h2>
                    <h1 className="finNum num" id="finNum">
                      {error ? (
                        <p>{error}</p>
                      ) : loading ? (
                        <StatsSkeleton count={1} />
                      ) : (
                        stats.today
                      )}
                    </h1>
                  </div>
                  <div className="statRecent restrictor">
                    <h2 className="boxDescSpec fin">Received This Week</h2>
                    <h1 className="finNum num" id="finNum">
                      {error ? (
                        <p>{error}</p>
                      ) : loading ? (
                        <StatsSkeleton count={1} />
                      ) : (
                        stats.this_week
                      )}
                    </h1>
                  </div>

                  <div className="statRecent restrictor">
                    <h2 className="boxDescSpec fin">Received This Month</h2>
                    <h1 className="finNum num" id="finNum">
                      {error ? (
                        <p>{error}</p>
                      ) : loading ? (
                        <StatsSkeleton count={1} />
                      ) : (
                        stats.this_month
                      )}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
}

export default summaryBoard;

