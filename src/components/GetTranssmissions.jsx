import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export function GetTransmissions(){
    const { user } = useAuth();
    const [transmissions, setTransmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   
     const fetchTransmissions = useCallback(async () => {
       try {
         setLoading(true);
         setError(null);

         let result;

         if (user.is_admin || user.is_head_office) {
           // Admin and head office see all transmissions
            result = await api.get("/transmissions");
         } else {
           // Branch staff only see their own branch
           result = await api.get(`/transmissions/branch/${user.branch_id}`);
         }

         // client.js interceptor already unwraps res.data
         // so result is { success, data } — not { data: { success, data } }
         setTransmissions(result.data ?? []);
       } catch (err) {
         setError(err.message || "Failed to load transmissions");
       } finally {
         setLoading(false);
       }
     }, [user.branch_id, user.is_admin, user.is_head_office]);

     useEffect(()=>{
      fetchTransmissions();
     }, [fetchTransmissions]);

   return { transmissions, loading, error, refetch: fetchTransmissions };
}