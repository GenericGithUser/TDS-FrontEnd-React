import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigateB } from "../utils/navigation.js"; // ✅ Fix typo: utils, not utlis

export default function NavigationBridge() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigateB(navigate);
  }, [navigate]);

  return null; // This component renders nothing visible
}
