import { AuthContext } from "../contexts/AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

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
