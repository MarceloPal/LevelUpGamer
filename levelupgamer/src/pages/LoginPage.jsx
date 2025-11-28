import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // Ahora useAuth devuelve las funciones asíncronas login y register
  const { login, register, user, logout } = useAuth(); 
  const [activeForm, setActiveForm] = useState("login"); // "login" | "register" | "forget"
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmarPassword: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // Corregimos la declaración para usar y establecer el error
  const [error, setError] = useState(""); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  //Ahora es ASÍNCRONA y usa await
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Iniciando sesión...");
    setError("");

    // La función login ahora retorna { success: bool, message: string }
    const result = await login(form.email, form.password); 
    
    if (result.success) {
        setMessage("Inicio de sesión exitoso");
        navigate("/"); 
    } else {
        setError(result.message || "Error desconocido al iniciar sesión");
        setMessage("");
    }
  };


  // 🔄 Ahora es ASÍNCRONA y usa await
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      setMessage("");
      return;
    }

    setMessage("Creando cuenta...");
    setError("");

    // La función register ahora retorna { success: bool, message: string }
    const result = await register({ nombre: form.nombre, email: form.email, password: form.password });
    
    if (result.success) {
        setMessage("Cuenta creada exitosamente");
        navigate("/"); 
    } else {
        // El error viene directamente de la API si el email ya existe, etc.
        setError(result.message || "Error desconocido al crear la cuenta");
        setMessage("");
    }
  };

  if (user) {
    return (
      <main className="d-flex flex-column align-items-center justify-content-center text-center text-white" style={{ minHeight: "80vh" }}>
        <h3>¡Bienvenido, {user.nombre}!</h3>
        {/* Usamos user.email del estado global */}
        <p className="mb-3">{user.email}</p> 
        <button className="btn btn-outline-light" onClick={logout}>
          Cerrar sesión
        </button>
      </main>
    );
  }

  return (
    <main className="login-page-background d-flex justify-content-center align-items-center">
      <div className="login-card">
        <div className="card-body text-center">
          {/* FORMULARIO LOGIN */}
          {activeForm === "login" && (
            <>
              <h3 className="mb-4 text-white">Ingresar</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3 text-start">
                  <label className="form-label text-white">Correo electrónico</label>
                  <input type="email" name="email" className="form-control" placeholder="Ingresa tu correo" onChange={handleChange} required />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label text-white">Contraseña</label>
                  <input type="password" name="password" className="form-control" placeholder="********" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">Ingresar</button>
              </form>
              <div className="mt-3">
                <a href="#" className="text-info" onClick={() => setActiveForm("forget")}>¿Olvidaste tu contraseña?</a><br />
                <a href="#" className="text-info" onClick={() => setActiveForm("register")}>Crear cuenta nueva</a>
              </div>
            </>
          )}

          {/* FORMULARIO REGISTRO */}
          {activeForm === "register" && (
            <>
              <h3 className="mb-4 text-white">Crear Cuenta</h3>
              <form onSubmit={handleRegister}>
                <div className="mb-3 text-start">
                  <label className="form-label text-white">Nombre</label>
                  <input type="text" name="nombre" className="form-control" placeholder="Tu nombre" onChange={handleChange} required />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label text-white">Correo electrónico</label>
                  <input type="email" name="email" className="form-control" placeholder="tu@email.com" onChange={handleChange} required />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label text-white">Contraseña</label>
                  <input type="password" name="password" className="form-control" placeholder="********" onChange={handleChange} required />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label text-white">Confirmar Contraseña</label>
                  <input type="password" name="confirmarPassword" className="form-control" placeholder="********" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-success w-100 mt-3">Crear Cuenta</button>
              </form>
              <div className="mt-3">
                <a href="#" className="text-info" onClick={() => setActiveForm("login")}>¿Ya tienes cuenta? Inicia sesión</a>
              </div>
            </>
          )}

          {/* FORMULARIO OLVIDAR CONTRASEÑA */}
          {activeForm === "forget" && (
            <>
              <h3 className="mb-4 text-white">Recuperar Contraseña</h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3 text-start">
                  <label className="form-label text-white">Correo electrónico</label>
                  <input type="email" name="email" className="form-control" placeholder="tu@email.com" />
                </div>
                <button className="btn btn-warning w-100 mt-3">Enviar instrucciones</button>
              </form>
              <div className="mt-3">
                <a href="#" className="text-info" onClick={() => setActiveForm("login")}>¿Ya tienes cuenta? Inicia sesión</a>
              </div>
            </>
          )}

          {/* MENSAJES DE ESTADO */}
          {message && <p className={`mt-3 ${error ? 'text-danger' : 'text-warning'}`}>{message}</p>}
          {error && <p className="mt-3 text-danger">{error}</p>}
        </div>
      </div>
    </main>
  );
};

export default LoginPage;