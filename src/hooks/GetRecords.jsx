import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";


export function GetRecords(searchQuery = ''){
     const { user } = useAuth();
     const [records, setRecords] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     const fetchRecords = useCallback(async () => {
        try {
          setLoading(true);
          setError(null);

          let result;

          if (searchQuery) {
            if (user.is_admin || user.is_head_office) {
                result = await api.get(
                  `/records/search?q=${encodeURIComponent(searchQuery)}`,
                );
            } else{
                result = await api.get(
                  `/records/search?q=${encodeURIComponent(searchQuery)}&branchId=${user.branch_id}`,
                );
            }
            
          } else if (user.is_admin || user.is_head_office) {
            result = await api.get("/records");
          } else {
            // Branch staff only see their own branch's records
            result = await api.get(`/records/branch/${user.branch_id}`);
            
          }
          
          setRecords(result.data ?? []);
          
        } catch (err) {
          setError(err.message || "Failed to load records");
        } finally {
          setLoading(false);
        } 
     }, [ searchQuery, user.branch_id, user.is_admin, user.is_head_office]);
     useEffect(()=>{
        fetchRecords();
     }, [fetchRecords]);
     
    const createRecord =  useCallback(async (recordData, checklistItems = []) => {
        try {
          const formattedChecklist = checklistItems
            .map((item) => ({
              checklist_item:
                item.text || item.item || item.checklist_item || item, // fallback chain
            }))
            .filter((item) => item.checklist_item?.trim()); // remove empty items

          const { result } = await api.post("/records/checklist", {
            ...recordData,
            checklist_items: formattedChecklist,
          });

          if (result.success) {
            setRecords((prev) => [result.data, ...prev]);
            return { success: true };
          }
        } catch (error) {
          return {success: false, error: error.message}
        }
    }, []);

    const updateRecord = useCallback(async (recordId, recordData, checklistItems=[]) => {
      try {
        const formattedChecklist = checklistItems
          .map((item) => ({
            checklist_item:
              item.text || item.item || item.checklist_item || item,
            ...(item.checklist_id && { checklist_id: item.checklist_id }), // fallback chain
          }))
          .filter((item) => item.checklist_item?.trim()); // remove empty items
        
        console.log("📤 Sending update payload:", {
          recordId,
          recordDataKeys: Object.keys(recordData),
          checklistCount: formattedChecklist.length,
          sampleItem: formattedChecklist[0], // see structure
          hasIds: formattedChecklist.some((i) => i.checklist_id), // are IDs included?
        });    

        const { result } = await api.put(`/records/checklist/${recordId}`, {
          ...recordData,
          checklist_items: formattedChecklist,
        });
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

    const updateFeedback = useCallback(async (id, feedback) => {
      try {
        const result = await api.patch(`/records/feedback/${id}`, feedback);
        if (result.success) {
          setRecords((prev) =>
            prev.map((r) => (r.record_id === id ? result.data : r)),
          );
          return { success: true };
        }
      } catch (error) {
        setError(error.message || "Failed to load records");
      }
      
    }, [])

     return {records, loading, error, refetch: fetchRecords, createRecord, updateRecord, updateFeedback}
}