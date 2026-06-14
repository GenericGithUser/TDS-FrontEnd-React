import '../styles/records.css'
import '../styles/createEdit.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigationData } from '../components/NavigationDataContext'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { GetUsers } from '../hooks/GetUsers'

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRePassword, setReNewPassword] = useState("");
    const [matched, setMatched] = useState(false);
    const [newMatch, setNewMatch] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { updatePassword, checkPassword } = GetUsers();


    if (!user) {
      return(
        <>
          <h1 style={{textAlign:"center"}}>You do not have access to this page!</h1>
        </>
      );
    }
    const handleCheckPassword = async (e) =>{

      // const checkPass = async () => {
      //   const pass = await checkPassword(user.employee_id, oldPassword);
      //   console.log(pass);
      //   setIsMatched(pass);
      // }
      // checkPass();

      // if (isMatched.success) {
      //   setMatched(true);
      // } else {
      //   setMatched(false);
      // }

      try {
        const pass = await checkPassword(user.employee_id, oldPassword);
        setMatched(pass.success);

      } catch (error) {
        setMatched(false);
      }

    }
    const handleOnKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    };



    const handleSave = (e) => {
      e.preventDefault();
      updatePassword(user.employee_id, newPassword);
      navigate("/dashboard/home"); // Go back
    };

   
    const handleCancel = (e) => {
      navigate("/dashboard/home");
    };

    
    return (
      <>
        <Helmet>
          <title>Change Password</title>
        </Helmet>
        <h1 className="ceTitle">Change Password</h1>
        <div className="createBox">
          <form onSubmit={handleSave} onKeyDown={handleOnKeyDown}>
            <div className="r2">
              <div className="item itemSpec">
                <label htmlFor="oldPass" className="recLabel expander">
                  Old Password:
                </label>
                <input
                  type="password"
                  name="oldPass"
                  id="recName"
                  className="recInput"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btnCancel btnSpecial"
                  onClick={() => handleCheckPassword()}
                  disabled={matched}
                >
                  Verify
                </button>
              </div>
            </div>
            {matched !== false ? (
              <>
                <div className="r2">
                  <div className="item">
                    <label
                      htmlFor="newPasswordInput"
                      className="recLabel expander"
                    >
                      New Password:
                    </label>
                    <input
                      type="password"
                      name="newPasswordInput"
                      id="newPasswordInput"
                      className="recInput"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                      Retype New Password:
                    </label>
                    <input
                      type="password"
                      name="newRePasswordInput"
                      id="newRePasswordInput"
                      className="recInput"
                      value={newRePassword}
                      onChange={(e) => setReNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {newPassword.length > 0 &&
                  newRePassword.length > 0 &&
                  (newPassword !== newRePassword ? (
                    <div className="r2">
                      <p className="warningPass">⚠ Password does not Match!</p>
                    </div>
                  ) : (
                    <div className="r2">
                      <p className="goodPass">✅ Password Matches!</p>
                    </div>
                  ))}
              </>
            ) : (
              ""
            )}
            <div className="r1">
              <div className="item"></div>
              <div className="item"></div>
            </div>
            <div className="buttonCont">
              {matched !== false && (
                <input
                  type="submit"
                  value="SAVE Changes"
                  className="btnGreen"
                  disabled={newPassword !== newRePassword}
                ></input>
              )}
              <button
                type="button"
                className="btnCancel"
                formNoValidate
                onClick={() => handleCancel()}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </>
    );
}

export default ChangePassword;