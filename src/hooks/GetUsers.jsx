import { useState, useEffect, useCallback} from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import toast from "react-hot-toast";


export function GetUsers(searchQuery = '', includeDeleted = false){
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
      if (!user.is_admin) return; 
        try {
          setLoading(true);
          setError(null);

          const params = new URLSearchParams();
          // FIXED: was referencing undefined 'searchTerm', should be 'searchQuery'
          if (searchQuery) {
            if (searchQuery.includes("MEM-")) {
              searchQuery = parseInt(searchQuery.replace(/\D/g, ""));
            }
            params.append("q", searchQuery); // ← was 'searchTerm'
          }

          if (includeDeleted) {
            params.append("includeDeleted", "true");
          }

          const endpoint = searchQuery ? "/users/search" : "/users";
          const query = params.toString() ? `?${params.toString()}` : "";

          let result = await api.get(`${endpoint}${query}`);
          const actResult = result.data.map(item=>({
            ...item,
            userTableViewing: true
          }));

          result.data = actResult;
          
        

          setUsers(result.data ?? []);
        } catch (error) {
            toast.error(error.message || "Failed to get Users");
            setError(error);
            return { success: false, error: error.message };
        } finally{
            setLoading(false);
        }
        
    }, [searchQuery, user.is_admin, includeDeleted]);

    useEffect(()=>{
        fetchUsers();
    }, [fetchUsers]);

     const createUser = useCallback(async (userData) => {
       try {
         // userData shape:
         // { emp_name, emp_branch_id, email, password, role, position }
         const result = await api.post("/users", userData);

         if (result.success) {
           toast.success(result.message || "User Created Successfully!");
           setUsers((prev) => [result.data, ...prev]);
           return { success: true, data: result.data };
         }
       } catch (err) {
        toast.error(err.message || "Failed to User");
         return { success: false, error: err.message };
       }
     }, []);

     // ── Update employee + user fields ─────────────────────────────────────────
     const updateUser = useCallback(async (employeeId, updateData) => {
       try {
         // updateData shape (all optional):
         // { emp_name, emp_branch_id, email, usr_role, position }
         const result = await api.put(`/users/${employeeId}`, updateData);

         if (result.success) {
            toast.success(result.message || "User Updated Successfully!");
           setUsers((prev) =>
             prev.map((u) => (u.employee_id === employeeId ? result.data : u)),
           );
           return { success: true, data: result.data };
         }
       } catch (err) {
        toast.error(err.message || "Failed to Update User");
         return { success: false, error: err.message };
       }
     }, []);

     const getEmployeesByBranch = useCallback(async (branchId) => {
        try {
          const result = await api.get(`/users/branch/${branchId}`);
          if (result.success){
            toast.success(result.success || "Employees Fetched");
            return{ success: true, data: result.data};
          }
        } catch (error) {
          toast.error(error.message || "Failed to Fetch Employees");
          return { success: false, error: err.message };
        }
     }, []);

     // ── Soft delete (sets is_deleted = true, deleted_at = NOW()) ─────────────
     const softDeleteUser = useCallback(async (employeeId) => {
       try {
         const result = await api.delete(`/users/${employeeId}`);

         if (result.success) {
           // Remove from list (or mark as deleted if showing deleted)
           toast.success(result.message || "User Disabled Successfully!");
           setUsers((prev) => prev.filter((u) => u.employee_id !== employeeId));
           return { success: true };
         }
       } catch (err) {
        toast.error(error.message || "Failed to Disable User");
         return { success: false, error: err.message };
       }
     }, []);

     // ── Restore soft deleted employee ─────────────────────────────────────────
     const restoreUser = useCallback(
       async (employeeId) => {
         try {
           const result = await api.patch(`/users/${employeeId}/restore`);

           if (result.success) {
             // Refetch to get updated list with restored employee
             toast.success(result.message || "User Restored Successfully!");
             await fetchUsers(true);
             return { success: true };
           }
         } catch (err) {
            toast.error(err.message || "Failed to Restore User");
           return { success: false, error: err.message };
         }
       },
       [fetchUsers],
     );

     // ── Update password ───────────────────────────────────────────────────────
     const updatePassword = useCallback(async (userId, newPassword) => {
       try {
         const result = await api.patch(`/users/${userId}/password`, {
           newPassword,
         });
         toast.success(result.message || "Password Updated Successfully!");
         return { success: result.success };
       } catch (err) {
        toast.error(err.message || "Failed to Update Password");
         return { success: false, error: err.message };
       }
     }, []);


     const checkPassword = useCallback(async (userId, oldPassword)=>{

        try {
          const result = await api.post(`/users/password`, {userId, oldPassword});

          if (result.success) {
            toast.success(result.message || "Password Matches!");
            return {success:result.message, data: result.data}
          }
        } catch (error) {
          toast.error(error.message || "Old Password does not Match!");
          return { success: false, error: error}
        }

     }, [])

     const fetchDisabledUsers = useCallback(async () => {
       try {
         setLoading(true);
         setError(null);
         const result = await api.get("/users/disabled");
         setUsers(result.data ?? []);
       } catch (err) {
         toast.error(err.message || "Failed to Fetch Users");
         setError(err.message || "Failed to load disabled users");
       } finally {
         setLoading(false);
       }
     }, []);



    return { users, loading, error, refetch: fetchUsers, createUser, updateUser, softDeleteUser, restoreUser, updatePassword, fetchDisabledUsers, getEmployeesByBranch, checkPassword};
}