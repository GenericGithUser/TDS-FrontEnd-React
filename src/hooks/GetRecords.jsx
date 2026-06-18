import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import toast from "react-hot-toast";



export function GetRecords(searchQuery = '', branchId = null){
     const { user } = useAuth();
     const [records, setRecords] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     const fetchRecords = useCallback(async () => {
        try {
          setLoading(true);
          setError(null);

          let result;
          const effectiveBranch =
            branchId ?? // ← explicit branch override
            (user.is_admin || user.is_head_office ? null : user.branch_id);

          // if (searchQuery) {
          //   const params = new URLSearchParams({ q: searchQuery });
          //   if (user.is_admin || user.is_head_office) {
          //       result = await api.get(
          //         `/records/search?q=${encodeURIComponent(searchQuery)}&branchId=${branchId}`,
          //       );
          //   } else{
          //       result = await api.get(
          //         `/records/search?q=${encodeURIComponent(searchQuery)}&branchId=${user.branch_id}`,
          //       );
          //   }
            
          // } else if (user.is_admin || user.is_head_office) {
          //   result = await api.get(`/records?q=branchId=${branchId}`);
          // } else {
          //   // Branch staff only see their own branch's records
          //   result = await api.get(`/records/branch/${user.branch_id}`);
            
          // }
          if (searchQuery) {
            if (searchQuery.includes("TR-") || searchQuery.includes("SR-")) {
              searchQuery = parseInt(searchQuery.replace(/\D/g, ""));
            }
            const params = new URLSearchParams({ q: searchQuery });
            if (effectiveBranch) params.append("branchId", effectiveBranch);
            result = await api.get(`/records/search?${params}`);
          } else if (user.is_admin || user.is_head_office) {
            const params = new URLSearchParams();
            if (effectiveBranch) params.append("branchId", effectiveBranch);
            result = await api.get(
              `/records${params.toString() ? `?${params}` : ""}`,
            );
          } else {
            result = await api.get(`/records/branch/${effectiveBranch}`);
          }

          
          setRecords(result.data ?? []);
          
        } catch (err) {
          setError(err.message || "Failed to load records");
        } finally {
          setLoading(false);
        } 
     }, [ searchQuery, branchId,user.branch_id, user.is_admin, user.is_head_office]);
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

          const  result  = await api.post("/records/checklist", {
            ...recordData,
            checklist_items: formattedChecklist,
          });

          if (result.success) {
            toast.success(result.message || "Record Created Successfully!");
            setRecords((prev) => [result.data, ...prev]);
            return { success: true };
          }
        } catch (error) {
          toast.error(error.message || "Failed to Create Records");
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

        // console.log("📤 Sending update payload:", {
        //   recordId,
        //   recordDataKeys: Object.keys(recordData),
        //   checklistCount: formattedChecklist.length,
        //   sampleItem: formattedChecklist[0], // see structure
        //   hasIds: formattedChecklist.some((i) => i.checklist_id), // are IDs included?
        // });
        console.log("calling URL:", `/records/checklist/${recordId}`); //
        const result = await api.put(`/records/checklist/${recordId}`, {
          ...recordData,
          checklist_items: formattedChecklist,
        });
        if (result.success) {
          toast.success(result.message || "Record Updated Successfully!");
          setRecords((prev) =>
            prev.map((r) => (r.record_id === recordId ? result.data : r)),
          );
          return { success: true };
        }
      } catch (err) {
        toast.error(err.message || "Failed to Update Record");
        return { success: false, error: err.message };
      }
    }, []);

    const updateFeedback = useCallback(async (id, feedback) => {
      try {
        const result = await api.patch(`/records/feedback/${id}`, feedback);
        if (result.success) {
          toast.success(result.message || "Feedback Changed Successfully!");
          setRecords((prev) =>
            prev.map((r) =>
              r.record_id === id
                ? // FIXED: use spread with known feedbackData instead of result.data
                  // avoids crash if result.data is undefined or wrong shape
                  { ...r, ...feedback }
                : r,
            ),
          );
          return { success: true };
        }
      } catch (error) {
        toast.error(error.message || "Failed to Update Feedback");
        setError(error.message || "Failed to load records");
      }
      
    }, []);

    const deleteRecord = useCallback(async (recordId) => {
       try {
            const result = await api.delete(`/records/${recordId}`);
            if (result.success) {
              toast.success(result.message || "Record Deleted Successfully!");
                setRecords(prev => prev.filter(r => r.record_id !== recordId));
                return { success: true };
            }
            else if (result.id){
              toast(
                (t) => (
                  <div
                    style={{
                      background: t.visible ? "#a3dcea" : "#333",
                      color: t.visible ? "#ff5757" : "#fff",
                      padding: "16px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <b>Forbidden</b>
                    <p>{`${result.message} part of Transmission TR-${String(result.id).padStart(4, "0")}!`}</p>
                  </div>
                ),
                { position: "top-center" },
              );
            }
        } catch (err) {
          toast.error(err.message || "Failed to Delete Record");
            return { success: false, error: err.message };
        } 
    }, []);
    
    const fetchUnassignedRecords = useCallback(async () => {
      try {
        const result = await api.get("/records/unassigned");
        return { success: true, data: result.data ?? [] };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }, []);

     return {records, loading, error, refetch: fetchRecords, createRecord, updateRecord, updateFeedback, deleteRecord, fetchUnassignedRecords}
}