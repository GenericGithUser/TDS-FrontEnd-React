import SummaryBoard from "../components/SummaryBoard";
import SummaryBoardAdmin from "../components/SummaryBoardAdmin";
import MostRecent from "../components/MostRecent";
import MostRecentReceiver from "../components/MostRecentReceiver";
import MostRecentAdmin from "../components/MostRecentAdmin";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";
import { GetTransmissionStats } from "../hooks/GetTranssmissionsStats";
import '../styles/home.css'

function Home(){
  const { user } = useAuth();
  const { stats, loading, error } = GetTransmissionStats();

    return (
      <>
        <Helmet>
          <title>Dashboard | Home </title>
        </Helmet>
        <div className="container1">
          <h2 className="sTitle">
            {user.usr_role === "ADMIN" && <>ADMIN </>}SUMMARY DASHBOARD
          </h2>
          {user.usr_role !== "ADMIN" ? <SummaryBoard /> : <SummaryBoardAdmin />}
          <h2 className="sTitle">
            Most Recent {user.usr_role === "ADMIN" ? "Events" : "Transmissions"}
          </h2>
          {user.usr_role === "RECEIVER" ? (
            <MostRecentReceiver />
          ) : user.usr_role === "ADMIN" ? (
            <MostRecentAdmin />
          ) :
            <MostRecent />
          }
          <h1 className="total">
            Total Transmissions:{" "}
            <span className="fin" id="totalNum">
              {error ? (
                <p>{error}</p>
              ) : loading ? (
                "0 Transmissions"
              ) : (
                `${stats.total_transmissions} Transmissions`
              )}
            </span>
          </h1>
        </div>
      </>
    );
}

export default Home;