import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import toast from "react-hot-toast";


export function GetTransmissions(searchQuery = "", branchId = null) {
  const { user } = useAuth();
  const [transmissions, setTransmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      const effectiveBranch = branchId  // ← explicit branch override
                ?? (user.is_admin || user.is_head_office ? null : user.branch_id);
      
      if (searchQuery) {
        const params = new URLSearchParams({ q: searchQuery });
        if (effectiveBranch) params.append("branchId", effectiveBranch);
        result = await api.get(`/transmissions/search?${params}`);
      } else if (user.is_admin || user.is_head_office) {
        const params = new URLSearchParams();
        if (effectiveBranch) params.append("branchId", effectiveBranch);
        result = await api.get(
          `/transmissions/${params.toString() ? `?${params}` : ""}`,
        );
      } else {
        result = await api.get(`/transmissions/branch/${effectiveBranch}`);
      }

      // client.js interceptor already unwraps res.data
      // so result is { success, data } — not { data: { success, data } }
      setTransmissions(result.data ?? []);
    } catch (err) {
      setError(err.message || "Failed to load transmissions");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, branchId, user.branch_id, user.is_admin, user.is_head_office]);

  useEffect(() => {
    fetchTransmissions();
  }, [fetchTransmissions]);

  const createTransmission = useCallback(async (transmissionData) => {
    try {
      const result = await api.post("/transmissions", transmissionData);
      if (result.success) {
        toast.success(result.message || "Transmission Created Successfully!");
        setTransmissions((prev) => [result.data, ...prev]);
        return { success: true, data: result.data };
      }
    } catch (err) {
      toast.error(err.message || "Failed to Create Transmission");
      return { success: false, error: err.message };
    }
  }, []);

  // ── Get single transmission (for edit pre-population) ─────────────────────
  const getTransmissionById = useCallback(async (transId) => {
    try {
      const result = await api.get(`/transmissions/${transId}`);
      if (result.success) {
        
      }
      return { success: true, data: result.data };
    } catch (err) {
      toast.error(err.message || "Failed to Create Transmission");
      return { success: false, error: err.message };
    }
  }, []);

  // ── Update division (edit mode) ───────────────────────────────────────────
  const updateTransmission = useCallback(async (transId, updateData) => {
    try {
      const result = await api.put(`/transmissions/${transId}`, updateData);
      if (result.success) {
        toast.success(result.message || "Successfully Updated Division of Transmission!");
        setTransmissions((prev) =>
          prev.map((t) => (t.trans_id === transId ? result.data : t)),
        );
        return { success: true, data: result.data };
      }
    } catch (err) {
      toast.error(err.message || "Failed to Update Division");
      return { success: false, error: err.message };
    }
  }, []);

  // ── Update status ─────────────────────────────────────────────────────────
  const updateStatus = useCallback(
    async (transId, status, receiverId = null) => {
      try {
        const result = await api.patch(`/transmissions/${transId}/status`, {
          status,
          r_employee_id: receiverId,
        });
        if (result.success) {
          (receiverId == null ? toast.success(result.message || "Transmission Marked as Incomplete!") 
          :
          (toast.success(result.message || "Transmission Marked as Received!"))
        );
          setTransmissions((prev) =>
            prev.map((t) => (t.trans_id === transId ? result.data : t)),
          );
          return { success: true };
        }
      } catch (err) {
        toast.error(err.message || "Failed to Update Status!");
        return { success: false, error: err.message };
      }
    },
    [],
  );

  const cancelTransmission = useCallback(
    async (transId, status) => {
      try {
        const result = await api.patch(`/transmissions/${transId}/status/cancel`, {
          status
        });
        if (result.success) {
         toast.success(result.message || "Transmission Cancelled!");
          setTransmissions((prev) =>
            prev.map((t) => (t.trans_id === transId ? result.data : t)),
          );
          return { success: true };
        }
      } catch (err) {
        toast.error(err.message || "Failed to Update Status!");
        return { success: false, error: err.message };
      }
    },
    [],
  );

  const updateStatusApprover = useCallback(
    async (transId, status, approverId = null) => {
      try {
        const result = await api.patch(`/transmissions/approver/${transId}/`, {
          status,
          a_employee_id: approverId,
        });
        if (result.success) {
          toast.success(result.message || "Transmission Sent!");
          setTransmissions((prev) =>
            prev.map((t) => (t.trans_id === transId ? result.data : t)),
          );
          return { success: true };
        }
      } catch (err) {
        toast.error(err.message || "Failed to Send Transmission");
        return { success: false, error: err.message };
      }
    },
    [],
  );

  // ── Add record to transmission ────────────────────────────────────────────
  const addRecord = useCallback(async (transId, recordId, itemNo) => {
    try {
      const result = await api.post(`/transmissions/${transId}/records`, {
        recordId,
        itemNo,
      });
      if (result.success) {
        toast.success(result.message || "Successfully Added Record!");
      }
      return { success: result.success };
    } catch (err) {
      toast.error(err.message || "Failed to Create Transmission");
      return { success: false, error: err.message };
    }
  }, []);
  
  // GetTransmissions.jsx - add replaceRecords method
  const replaceRecords = useCallback(async (transId, items) => {
    try {
      const result = await api.put(`/transmissions/${transId}/records`, {
        items,
      });
      return { success: result.success };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // ── Remove record from transmission ───────────────────────────────────────
  const removeRecord = useCallback(async (transId, recordId) => {
    try {
      const result = await api.delete(
        `/transmissions/${transId}/records/${recordId}`,
      );
      if (result.success) {
        toast.success(result.message || "Successfully Removed a Record!");
      }
      return { success: result.success };
    } catch (err) {
      toast.error(err.message || "Failed to Remove Record");
      return { success: false, error: err.message };
    }
  }, []);

  // ── Delete transmission ───────────────────────────────────────────────────
  const deleteTransmission = useCallback(async (transId) => {
    try {
      const result = await api.delete(`/transmissions/${transId}`);
      if (result.success) {
        toast.success(result.message || "Successfully Deleted Transmission!");
        setTransmissions((prev) => prev.filter((t) => t.trans_id !== transId));
        return { success: true };
      }
    } catch (err) {
      toast.error(err.message || "Failed to Delete Transmission");
      return { success: false, error: err.message };
    }
  }, []);

  return {
    transmissions,
    loading,
    error,
    refetch: fetchTransmissions,
    getTransmissionById,
    createTransmission,
    updateTransmission,
    updateStatus,
    updateStatusApprover,
    addRecord,
    cancelTransmission,
    removeRecord,
    deleteTransmission,
    replaceRecords
  };
}