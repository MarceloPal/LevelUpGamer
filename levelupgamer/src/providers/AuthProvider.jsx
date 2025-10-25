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
  const [isAdmin, setIsAdmin] = useLocalStorage('lu_isAdmin', false);

  // Iniciar sesión
  const login = (email, password) => {

       // Verificar si es el admin
    if (email === "admin@levelup.com" && password === "admin123") {
      const adminUser = {
        email,
        name: "Administrador",
        role: "admin",
      };
      setUser(adminUser);
      setIsAdmin(true);
      return { success: true };
    }

    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (existingUser) {
      setUser(existingUser);
      // if stored user has role attribute, respect it for admin flag
      setIsAdmin(existingUser.role === 'admin');
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
  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  // Datos compartidos en toda la app
  const value = { user, users, login, register, logout, isAdmin, setIsAdmin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
