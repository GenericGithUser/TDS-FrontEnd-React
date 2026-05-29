import '../styles/login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

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

        const parsedId = parseInt(id.replace(/^\D+/, ""), 10);

        const result = await login(parsedId, password);

        if (result.success) {
            navigate('/dashboard');
        }
        else{
            setError(result.error);
        }

         setIsLoading(false);

    }

    return (
      <>
        <Helmet>
          <title>MRM-TDS | Login</title>
        </Helmet>
        <div className="content">
          <div className="main">
            <div className="loginForm">
              <img
                src="./assets/Maynilad2024.svg"
                alt="mayniladLogo"
                className="logoImg"
              />
              <h2 className="txtLogo">RECORDS TRANSMISSION SYSTEM</h2>
              <form onSubmit={handleSubmit} className="innerForm">
                {error && <p className="error">{error}</p>}
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
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="forgotPass"
                >
                  Forgot Password?
                </a>
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