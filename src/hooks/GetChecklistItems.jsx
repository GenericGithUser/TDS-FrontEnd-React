import { useCallback, useState } from "react";
import api from "../api/client";

export function GetChecklistItems(){
    const [checkItems, setCheckItems] = useState([]);
    const [checkLoading, setCheckLoading] = useState(false);
    const [checkError, setCheckError] = useState(null);

    const fetchChecklist = useCallback(
        async (recordId) => {
            try {
                setCheckLoading(true);
                setCheckError(null);
                let result = await api.get(`/checklists/record/${recordId}`);
                
                setCheckItems(result.data ?? []);
            } catch (error) {
                setCheckError(error.message);
            } finally{
                setCheckLoading(false);
            }
            
        }, []
    );

     const instantFetchChecklist = useCallback(async (recordId) => {
       if (!recordId) return []; // guard against undefined
       try {
         setCheckLoading(true);
         setCheckError(null);
         const result = await api.get(`/checklists/record/${recordId}`);
         const data = result.data ?? [];
         setCheckItems(data);
         return data; // ← caller can use this directly
       } catch (err) {
         setCheckError(err.message);
         return [];
       } finally {
         setCheckLoading(false);
       }
     }, []);

    const createChecklist = useCallback(async (checklistData) => {
         try {
           const result = await api.post("/checklists", checklistData);
           if (result.success) {
             setRecords((prev) => [result.data, ...prev]);
             return { success: true };
           }
         } catch (error) {
           return { success: false, error: error.message };
         }
    }, []);

    const updateChecklist = useCallback(async (checkItemId, checklistData) => {
      try {
        const result = await api.put(`/checklists/${checkItemId}`, checklistData);
        if (result.success) {
          setRecords((prev) =>
            prev.map((r) => (r.record_id === recordId ? result.data : r)),
          );
          return { success: true };
        }
      } catch (err) {
        return { success: false, error: err.message };
      }
    }, []);

     const clearChecklist = useCallback(() => {
       setCheckItems([]);
       setCheckError(null);
     }, []);
    return { checkItems, checkLoading, checkError, fetchChecklist, createChecklist, updateChecklist, instantFetchChecklist, clearChecklist}

}