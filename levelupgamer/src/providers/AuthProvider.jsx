import { AuthContext } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import api from "../api/apiClient"; // <-- IMPORTAMOS EL NUEVO CLIENTE AXIOS

// ELIMINAR O COMENTAR las constantes antiguas, ya no son necesarias:
// const API_BASE_URL = "http://localhost:3000/api/auth";
// const TENANT_ID = "TU_TENANT_ID_AQUI"; 

// ELIMINAR la función 'authApiCall' completa.
/*
const authApiCall = async (endpoint, data) => {
  // ... lógica de fetch eliminada
};
*/

export const AuthProvider = ({ children }) => {
  // ... (el código de useState y useEffect se mantiene) ...
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("lu_user") || "null"));

  // Sincronizar el estado de usuario con localStorage para que persista
  useEffect(() => {
    if (user) {
        localStorage.setItem("lu_user", JSON.stringify(user));
    } else {
        localStorage.removeItem("lu_user");
    }
  }, [user]);


  // Iniciar sesión (usa la API real con Axios)
  const login = async (email, password) => {
    try {
      // Usamos api.post. La ruta del backend es /auth/login
      const response = await api.post("/auth/login", { email, password });
      
      // El backend devuelve: { data: { user: {...}, token: "..." } }
      const backendUser = response.data.data?.user || response.data.user;
      const backendToken = response.data.data?.token || response.data.token;
      
      const userData = { 
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: backendUser.role, // ✅ IMPORTANTE: Guardamos el rol
        isActive: backendUser.isActive,
        token: backendToken
      };
      
      setUser(userData);
      return { success: true, user: userData };

    } catch (error) {
      // Axios interceptor devuelve el error completo
      return { success: false, message: error.response?.data?.message || error.message || "Error de conexión" };
    }
  };


  // Registrar nuevo usuario (usa la API real con Axios)
  const register = async ({ nombre, email, password }) => {
    try {
        // Usamos api.post para llamar a /auth/register
        const response = await api.post("/auth/register", { name: nombre, email, password });
        
        // El backend devuelve: { data: { user: {...}, token: "..." } }
        const backendUser = response.data.data?.user || response.data.user;
        const backendToken = response.data.data?.token || response.data.token;
        
        const userData = { 
            id: backendUser.id,
            name: backendUser.name,
            email: backendUser.email,
            role: backendUser.role, // ✅ IMPORTANTE: Guardamos el rol
            isActive: backendUser.isActive,
            token: backendToken
        };

        setUser(userData);
        return { success: true, user: userData };

    } catch (error) {
        // Axios interceptor devuelve el error completo
        return { success: false, message: error.response?.data?.message || error.message || "Error de conexión" };
    }
  };


  // Cerrar sesión
  const logout = () => {
    setUser(null);
    // Limpiamos también el token del almacenamiento local
    localStorage.removeItem("lu_user");
  }

  // Actualizar usuario (útil después de editar perfil)
  const updateUserData = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("lu_user", JSON.stringify(updatedUser));
  }

  // Datos compartidos en toda la app
  const value = { user, login, register, logout, updateUserData };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};