import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// Hook reutilizable para acceder al contexto
export const useAuth = () => useContext(AuthContext);
