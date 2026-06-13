import '../styles/login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../styles/loading.css'
import toast from 'react-hot-toast';

function Login(){

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!id.toUpperCase().startsWith("MEM-")) {
          setError("Invalid ID");
          toast.error(error, {
            position: "top-center",
            background: "#f89d9d",
            color: "#ff5757",
          });
          setIsLoading(false);
          return;
        }

        const parsedId = parseInt(id.replace(/^\D+/, ""), 10);

        const result = await login(parsedId, password);
        console.log("result from AuthContext login:", result);
        console.log("mustChangePassword:", result.mustChangePassword);
        if (result.success) {
            if (result.mustChangePassword) {
              navigate("/change-password"); // ← special route
            } else {
              // navigate("/dashboard");
            }
        }
        else{
            setError(result.error);
            toast.error(error, {
              position: "top-center",
              background: "#f89d9d",
              color: "#ff5757",
            });
        }

        setIsLoading(false);

    }

    return (
      <>
        <Helmet>
          <title>MRM-TDS | Login</title>
        </Helmet>
        <div className="content fade-in">
          <div className="main">
            <div className="loginForm fade-in">
              <img
                src="./assets/Maynilad2024.svg"
                alt="mayniladLogo"
                className="logoImg"
              />
              <h2 className="txtLogo">RECORDS TRANSMISSION SYSTEM</h2>
              <form onSubmit={handleSubmit} className="innerForm">
                <label htmlFor="idInput" className="lblInput">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="idInput"
                  className="inputs"
                  placeholder="MEM-0000"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                />
                <label
                  htmlFor="passwordInput"
                  className="lblInput"
                  style={{ marginTop: "10px" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="passwordInput"
                  className="inputs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Link className="forgotPass" to={"/forgot-password"}>Forgot Password?</Link>
                <input
                  type="submit"
                  value={isLoading ? "LOGGING IN..." : "LOG-IN"}
                  className="logButton"
                  disabled={isLoading}
                />
              </form>
            </div>
          </div>
        </div>
      </>
    );
}

export default Login