import { AuthContext } from "../contexts/AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";


//Los providers son componentes que usan el contexto para compartir datos y funciones
//con todos los componentes que están dentro de ellos en la jerarquía de React.
//Son como los enchufes que activan los contextos.
//Envuelven tu aplicación y hacen que los datos del contexto estén disponibles para todos los componentes dentro.

// Proveedor de autenticación
// Este componente envuelve la aplicación y proporciona
// el estado y las funciones de autenticación a través del contexto.
// Implementa funciones de login, registro y logout
//le da acceso a los datos de usuario y autenticación a toda la app de manera centralizada.

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("lu_user", null);
  const [users, setUsers] = useLocalStorage("lu_users", []);

  // Iniciar sesión
  const login = (email, password) => {
    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (existingUser) {
      setUser(existingUser);
      return { success: true };
    }
    return { success: false, message: "Usuario o contraseña incorrectos" };
  };

  // Registrar nuevo usuario
  const register = (newUser) => {
    const exists = users.some((u) => u.email === newUser.email);
    if (exists)
      return { success: false, message: "El correo ya está registrado" };

    setUsers([...users, newUser]);
    setUser(newUser);
    return { success: true };
  };

  // Cerrar sesión
  const logout = () => setUser(null);

  // Datos compartidos en toda la app
  const value = { user, users, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
