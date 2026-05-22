import SummaryBoard from "../components/SummaryBoard";
import MostRecent from "../components/MostRecent";
import MostRecentReceiver from "../components/MostRecentReceiver";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";
import '../styles/home.css'

function Home(){
  const { user } = useAuth()

    return (
      <>
        <Helmet>
          <title>Dashboard | Home </title>
        </Helmet>
        <div className="container1">
          <h2 className="sTitle">SUMMARY DASHBOARD</h2>
          <SummaryBoard />
          <h2 className="sTitle">Most Recent Transmissions</h2>
          {user.role === "receiver" ? <MostRecentReceiver /> : <MostRecent />}
          <h1 className="total">
            Total Transmissions:{" "}
            <span className="fin" id="totalNum">
              20 Transmissions
            </span>
          </h1>
        </div>
      </>
    );
}

export default Home;