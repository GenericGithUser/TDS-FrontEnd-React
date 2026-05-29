import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export function GetTransmissionStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result;
      // Branch staff get their own branch stats
      result = await api.get(
        `/transmissions/branch/stats/${parseInt(user.branch_id)}`,
      );
      setStats(result.data ?? []);
    } catch (err) {
      // FIXED: was 'error', referenced as 'err'
      setError(err.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, [user.branch_id, user.is_admin, user.is_head_office]); // FIXED: missing dependency array

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
