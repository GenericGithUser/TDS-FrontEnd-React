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
                result = await api.get(`/branches/search?q=${encodeURI(searchQuery)}`);
            }
            else{
                result = await api.get(`/branches`);
            }

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

    return { branches, branchLoading, branchError, refetch: fetchBranches};

}