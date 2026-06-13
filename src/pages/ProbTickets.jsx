import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";
import ticketData from "../assets/dummyTickets";
import UsableDialog from "../components/usableDialog";
import '../styles/probTickets.css'

function ProbTickets() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [isDeleteButton, setIsDeleteButton] = useState(false);
    const [onRecords, setOnRecords] = useState(false);

    const { user } = useAuth();
    const [openNum, setOpenNum] = useState(0);
    const [closeNum, setCloseNum] = useState(0);
    const [highNum, setHighNum] = useState(0);
    const [medNum, setMedNum] = useState(0);
    const [lowNum, setLowNum] = useState(0);


    useEffect(()=>{
        const openCount = ticketData.filter(item => item.record_status === 'Open').length;
        const closeCount = ticketData.filter(item=> item.record_status === 'Closed').length;
        const highCount = ticketData.filter(item=> item.urgency === 'High').length;
        const medCount = ticketData.filter(item=> item.urgency === 'Medium').length;
        const lowCount = ticketData.filter(item=> item.urgency === 'Low').length;
        setOpenNum(openCount);
        setCloseNum(closeCount);
        setHighNum(highCount);
        setMedNum(medCount);
        setLowNum(lowCount);
        console.log(closeNum);

    });

    if(user.usr_role !== "ADMINER"){
      const redirect = () => {
        navigate("/dashboard/home");
      }

      useEffect(() => {  
        setTimeout(redirect, 3000);

      }, [])

      return (
        <>
          <h1>You do not have Sufficient Permission to Access this page</h1>
          <h2>Redirecting to Home.......</h2>        
        </>
      );
    }

    const openDialog = (item, delBtn) => {
      setDialogData(item);
      setIsDialogOpen(true);
      setIsDeleteButton(delBtn);
      setOnRecords(false);
    };

    const closeDialog = () => {
      setIsDialogOpen(false);
      setIsDeleteButton(false);
    };


    return (
      <>
        <Helmet>
          <title>Dashboard | Tickets</title>
        </Helmet>

        <div className="container2">
          <div className="stats">
            <h1 className="titleProb">Problem Tickets</h1>
            <div className="statsTotal">
              <div className="statTems">
                <div className="actTick tickStat">
                  <h2 className="statName act">Open Tickets: </h2>
                  <h1 className="statNum">{openNum}</h1>
                </div>
                <div className="closeTick tickStat">
                  <h2 className="statName clo">Closed Tickets: </h2>
                  <h1 className="statNum">{closeNum}</h1>
                </div>
              </div>
              <div className="openCats">
                <p className="red cat">
                  High: <span className="catNum">{highNum}</span>
                </p>
                <p className="yellow cat">
                  Medium: <span className="catNum">{medNum}</span>
                </p>
                <p className="blue cat">
                  Low: <span className="catNum">{lowNum}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="tickCont">
            <div className="heading">
              <span>ID# </span>
              <span>TITLE </span>
              <span>URGENCY</span>
              <span>DATE SENT</span>
              <span>STATUS</span>
            </div>
            <div className="mainTickCont">
              {ticketData.map((item) => (
                <div className="tickItem">
                  <span className="tickId">{item.id}</span>
                  <span className="title">{item.record_titles}</span>
                  <div className="severity">
                    <div
                      className={`label ${item.urgency === "High" ? `red` : item.urgency === "Medium" ? `yellow` : `blue`}`}
                    >
                      {item.urgency}
                    </div>
                  </div>
                  <div className="dateSent">{item.date_sent}</div>
                  <div
                    className={`status ${item.record_status === "Open" ? `orangeBg` : `greenBg`}`}
                  >
                    {item.record_status}
                  </div>
                  <div className="buttons">
                    <div
                      className="btnView"
                      onClick={() => openDialog(item, false)}
                    >
                      View
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <UsableDialog
            isOpen={isDialogOpen}
            onClose={closeDialog}
            data={dialogData}
            isDeleteButton={isDeleteButton}
            onRecords={onRecords}
          />
        </div>
      </>
    );
}

export default ProbTickets;
