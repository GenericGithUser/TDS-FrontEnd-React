import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import toast from "react-hot-toast";

export function GetBranch(searchQuery = ''){
    const { user } = useAuth();
    const [branches, setBranches] = useState([]);
    const [branchLoading, setBranchLoading] = useState(true);
    const [branchError, setBranchError] = useState(null);

    const fetchBranches = useCallback(async () => {
        try {
            setBranchLoading(true);
            setBranchError(null);

            let result;
            if (searchQuery) {
                if (
                  searchQuery.includes("MB-") 
                ) {
                  searchQuery = parseInt(searchQuery.replace(/\D/g, ""));
                }
                result = await api.get(`/branches/search?q=${encodeURI(searchQuery)}`);
            }
            else{
                result = await api.get(`/branches`);
            }
            const actResult = result.data.map((item) => ({
              ...item,
              branchTableViewing: true,
            }));
            result.data = actResult;


            setBranches(result.data ?? []);
        } catch (error) {
            toast.error(error.message || "Failed to Fetch Branches");
            setBranchError(error);
            return { success: false, error: error.message}
        }
        finally{
            setBranchLoading(false);
        }
    }, [searchQuery, user.is_admin]);

    useEffect(()=>{
        fetchBranches();
    }, [fetchBranches]);

    const createBranch =  useCallback(async (branchData) => {
        try {
            const result = await api.post("/branches/", branchData);
            if (result.success) {
                toast.success(result.message || "Branch Successfully Created!");
                setBranches((prev)=> [result.data, ...prev]);
                return {success: true};
            }
        } catch (error) {
            toast.error(error.message || "Failed to Create Branch!");
            return {success: false, error: error.message};
        }
        
    }, []);

    const updateBranch = useCallback(async (branchId, branchData) => {
        try {
            const result = await api.put(`/branches/${branchId}`, branchData);
            if (result.success) {
                toast.success(result.message || "Branch Successfully Updated!");
                setBranches((prev)=> prev.map((r)=>(r.branch_id === branchId ? result.data : r)),);
                return {success: true};
            }
        } catch (error) {
           toast.error(error.message || "Failed to Update Branch!");
           return { success: false, error: error.message}; 
        }
    }, []);

    const softDeleteBranch = useCallback(async (branchId) => {
      try {
        const result = await api.patch(`/branches/disable/${branchId}`);

        if (result.success) {
          // Remove from list (or mark as deleted if showing deleted)
          toast.success(result.message || "Branch Disabled Successfully!");
          setBranches((prev) => prev.filter((u) => u.branch_id !== branchId));
          return { success: true };
        }
      } catch (err) {
        toast.error(err.message || "Failed to Disable Branch");
        return { success: false, error: err.message };
      }
    }, []);

    const restoreBranch = useCallback(
      async (branchId) => {
        try {
          const result = await api.patch(`/branches/re-enable/${branchId}`);

          if (result.success) {
            // Refetch to get updated list with restored employee
            toast.success(result.message || "Branch Restored Successfully!");
            await fetchBranches(true);
            return { success: true };
          }
        } catch (err) {
          toast.error(err.message || "Failed to Restore Branch");
          return { success: false, error: err.message };
        }
      },
      [fetchBranches],
    );

    return { branches, branchLoading, branchError, refetch: fetchBranches, createBranch, updateBranch, softDeleteBranch, restoreBranch };

}