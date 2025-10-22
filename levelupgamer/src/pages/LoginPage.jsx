import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, register, user, logout } = useAuth();
  const [activeForm, setActiveForm] = useState("login"); // "login" | "register" | "forget"
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmarPassword: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleLogin = (e) => {
    e.preventDefault();
    const result = login(form.email, form.password); 
    if (result.success) {
        // Redirige al perfil si la autenticación es exitosa
        navigate("/"); 
        setMessage("Inicio de sesión exitoso");
        setError("");
    } else {
        setError(result.message);
        setError("");
    }
    };


  const handleRegister = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmarPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }
    const result = register({ nombre: form.nombre, email: form.email, password: form.password });
        if (result.success) {
        // Redirige al perfil si la autenticación es exitosa
        navigate("/perfil"); 
        setMessage("Cuenta creada exitosamente");
        setError("");
    } else {
        setError(result.message);
        setError("");
    }
  };

  if (user) {
    return (
      <main className="d-flex flex-column align-items-center justify-content-center text-center text-white" style={{ minHeight: "80vh" }}>
        <h3>¡Bienvenido, {user.nombre}!</h3>
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
                  <input type="email" name="email" className="form-control" placeholder="Ingresa tu correo" onChange={handleChange} />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label text-white">Contraseña</label>
                  <input type="password" name="password" className="form-control" placeholder="********" onChange={handleChange} />
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
                  <input type="text" name="nombre" className="form-control" placeholder="Tu nombre" onChange={handleChange} />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label text-white">Correo electrónico</label>
                  <input type="email" name="email" className="form-control" placeholder="tu@email.com" onChange={handleChange} />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label text-white">Contraseña</label>
                  <input type="password" name="password" className="form-control" placeholder="********" onChange={handleChange} />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label text-white">Confirmar Contraseña</label>
                  <input type="password" name="confirmarPassword" className="form-control" placeholder="********" onChange={handleChange} />
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

          {/* MENSAJE */}
          {message && <p className="mt-3 text-warning">{message}</p>}
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
