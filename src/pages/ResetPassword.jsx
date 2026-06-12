import '../styles/records.css'
import '../styles/createEdit.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNavigationData } from '../components/NavigationDataContext'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [newRePassword, setReNewPassword] = useState("");
    const [matched, setMatched] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth(); 


    if (!user) {
      return(
        <>
          <h1 style={{textAlign:"center"}}>You do not have access to this page!</h1>
        </>
      );
    }

    const handleSave = async (e) => {
      e.preventDefault();
      const result = await api.patch(`/users/${user.user_id}/password`, {
        newPassword
      });

      if (result.success) {
        // Update local user object to clear the flag
        const updatedUser = { ...user, must_change_password: false };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        navigate('/dashboard');
    }
    };
    
    return (
      <>
        <Helmet>
          <title>Reset Password</title>
        </Helmet>
        <div className="customCont">
          <h1 className="ceTitle">Reset Password</h1>
          <div className="createBox">
            <form onSubmit={handleSave}>
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
              <div className="r1">
                <div className="item"></div>
                <div className="item"></div>
              </div>
              <div className="buttonCont">
                <input
                  type="submit"
                  value="SAVE New Password"
                  className="btnCancel"
                  disabled={newPassword !== newRePassword}
                ></input>
              </div>
            </form>
          </div>
        </div>
      </>
    );
}

export default ResetPassword;