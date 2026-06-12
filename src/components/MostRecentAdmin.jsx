import '../styles/tableTemp.css';
import "../styles/loading.css";
import { useState, useEffect } from 'react';
import { TableSkeleton, ErrorMessage } from "./Loading.jsx";
import api from '../api/client.js';


function MostRecentAdmin(){
    const [logs, setLogs] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
     const [errors, setError] = useState(null);

    // const handleEditTrans = (data) => {
    //     const sendData = { mode: 'edit', data: data, returnTo: "/dashboard/home",callback: ()=> console.log('Success') }
    //     setRouteData(sendData);
    //     navigate("edit");

    // }

      const loadLogs = async () => {
         try {
           // 2. Use the 'api' instance.
           // It automatically uses port 5000 and attaches the JWT token!
           // Note: We use '/admin/logs' because your baseURL already includes '/api'
           const result = await api.get("/admin/logs");

           // 3. Because of your response interceptor, 'result' is already unwrapped!
           // It is exactly: { success: true, count: X, data: [...] }
           setLogs(result.data || []);
           setIsLoading(false);
         } catch (error) {
          setError(error);
           // Your response interceptor already handles 401/403 errors and redirects!
           // If it reaches here, it's a network/server error.
           console.error("Failed to fetch logs:", error.message);
           setIsLoading(false);
         }
      };

      useEffect(() => {
        loadLogs(); // Initial fetch

        // Poll every 5 seconds for "live" updates
        const interval = setInterval(loadLogs, 5000);
        return () => clearInterval(interval); // Cleanup on unmount
      }, []);


    
    return (
      <>
        <div className="transTable">
          <table className="actTransTable">
            <colgroup>
              <col style={{ width: "5vw" }} />
              <col style={{ width: "20px" }} />
            </colgroup>
            <thead className="transTableHead">
              <tr>
                <th>Time</th>
                <th>Log Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton stays inside the table - no layout shift
                <TableSkeleton rowCount={4} colCount={2} />
              ) : errors ? (
                <tr>
                  <td colSpan={2}>
                    <ErrorMessage message={errors}/>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    <h1>No Logs Available</h1>
                  </td>
                </tr>
              ) : (
                logs.slice(0, 5).map((log) => (
                  <tr key={log.id} className="fade-in">
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>
                      
                        {log.rawLog}
                      
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </>
    );
}

export default MostRecentAdmin;