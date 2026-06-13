import '../styles/records.css'
import '../styles/createEdit.css'
import '../styles/loading.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import toast from 'react-hot-toast'

function ForgotPassword() {
    const [empId, setEmpId] = useState("");
    const [email, setEmail] = useState("");
    const [matched, setMatched] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth(); 

    const handleSave = async (e) => {
      e.preventDefault();
      const parsedId = parseInt(empId.replace(/^\D+/, ""), 10);
      const result = await api.post(`/reset/password/email`, {
        userId: parsedId,
        email,
      });

      if (result.success) {
        const sendReq = await api.patch(`/reset/password/request`, {userId: parsedId});
        if (sendReq.success) {
          toast.success("Your Request Has been Sent!");
          navigate("/login")
        }else{
          toast.error(sendReq.message);
        }
      }
      else{
        toast.error("No Users with that Credentials Found!")
      }

      
    };
    
    return (
      <>
        <Helmet>
          <title>Forgot Password</title>
        </Helmet>
        <div className="content">
          <div className="main">
            <div className="customCont fade-in">
              <h1 className="ceTitle">Forgot Password</h1>
              <div className="createBox">
                <form onSubmit={handleSave}>
                  <div className="r2">
                    <div className="item">
                      <label
                        htmlFor="newPasswordInput"
                        className="recLabel expander"
                      >
                        Enter Employee ID:
                      </label>
                      <input
                        type="text"
                        name="newPasswordInput"
                        id="newPasswordInput"
                        className="recInput"
                        value={empId}
                        onChange={(e) => setEmpId(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="r2">
                    <div className="item">
                      <label
                        htmlFor="newRePasswordInput"
                        className="recLabel expander"
                      >
                        Enter Employee Email:
                      </label>
                      <input
                        type="email"
                        name="newRePasswordInput"
                        id="newRePasswordInput"
                        className="recInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="r1">
                    <div className="item"></div>
                    <div className="item"></div>
                  </div>
                  <div className="buttonCont">
                    <input
                      type="submit"
                      value="Request Resetting"
                      className="btnFin btnCancel"
                    ></input>
                    <button type="button" formNoValidate onClick={()=>navigate('/login')} className='btnCancel'>
                        Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default ForgotPassword;