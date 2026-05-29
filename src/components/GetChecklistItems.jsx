import { useCallback, useState } from "react";
import api from "../api/client";

export function GetChecklistItems(){
    const [checkItems, setCheckItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchChecklist = useCallback(
        async (recordId) => {
            try {
                setLoading(true);
                setError(null);
                let result = await api.get(`/checklists/record/${recordId}`);
                setCheckItems(result.data ?? []);
            } catch (error) {
                setError(error.message);
            } finally{
                setLoading(false);
            }
            
        }, []
    );

    return { checkItems, loading, error, fetchChecklist}

}