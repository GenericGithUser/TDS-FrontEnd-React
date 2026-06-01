import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export function GetDivisions(searchQuery = ''){
    const { user } = useAuth();
    const [divisions, setDivisions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDivisions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let result;
            if (searchQuery) {
                result = await api.get(`/divisions/search?q=${encodeURIComponent(searchQuery)}`);
            }else{
                result = await api.get("/divisions");
            }

            setDivisions(result.data ?? []);

        } catch (error) {
            setError(error.message);
        } finally{
            setLoading(false);
        } 
    }, [searchQuery, user.is_admin, user.is_head_office]);

    useEffect(()=>{
        fetchDivisions();
    }, [fetchDivisions]);

    return { divisions, loading, error, refetch: fetchDivisions};
}