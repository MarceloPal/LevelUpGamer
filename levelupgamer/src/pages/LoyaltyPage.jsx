import { useContext, useState } from "react";
import { LoyaltyContext } from "../contexts/LoyaltyContext";

export default function LoyaltyPage() {
  const { coins } = useContext(LoyaltyContext);
  const [activeSection, setActiveSection] = useState("beneficios");

  //Calcular progreso de nivel
  const nextLevelThreshold =
    coins.level === "Bronce" ? 300 :
    coins.level === "Plata" ? 600 :
    coins.level === "Oro" ? 1000 :
    null;

  const progressPercent = Math.min((coins.total / nextLevelThreshold) * 100, 100);
  const nextLevelName =
    coins.level === "Bronce" ? "Plata" :
    coins.level === "Plata" ? "Oro" :
    coins.level === "Oro" ? "Platino" : "Máximo nivel";

  return (
    <div className="loyalty-page py-5">
      <div className="container">
        <div className="row g-4 align-items-start">
          {/* 🔹 Sidebar Izquierdo */}
          <div className="col-md-3">
            <div className="bg-white p-3 rounded-4 shadow-sm d-flex flex-column gap-3 " style={{ top: "100px" }}>
              <h4 className="fw-bold mb-3 text-center">Tus Puntos</h4>
              <div className="text-center mb-2">
                <p className="mb-1 text-muted small">Nivel actual:</p>
                <p className="fw-bold">{coins.level}</p>
                <p className="text-muted small mb-1">Coins totales:</p>
                <p className="fw-bold">{coins.total}</p>
              </div>

              <button
                className={`btn btn-gradient ${activeSection === "beneficios" ? "active" : ""}`}
                onClick={() => setActiveSection("beneficios")}
              >
            Beneficios
              </button>
              <button
                className={`btn btn-gradient ${activeSection === "historial" ? "active" : ""}`}
                onClick={() => setActiveSection("historial")}
              >
            Historial
              </button>
              <button
                className={`btn btn-gradient ${activeSection === "progreso" ? "active" : ""}`}
                onClick={() => setActiveSection("progreso")}
              >
            Progreso
              </button>
              <button
                className={`btn btn-gradient ${activeSection === "info" ? "active" : ""}`}
                onClick={() => setActiveSection("info")}
              >
            Información
              </button>
            </div>
          </div>

          {/*Contenido Principal */}
          <div className="col-md-9">
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <h1 className="fw-bold mb-4" style={{ color: "#4a007e" }}>
                Programa de Puntos Level-Up
              </h1>

              {activeSection === "beneficios" && (
                <div>
                  <h3 className="fw-bold mb-3">Beneficios por Nivel</h3>
                  <ul>
                    <li><strong>Bronce:</strong> acceso a cupones mensuales.</li>
                    <li><strong>Plata:</strong> 5% extra en coins por compra.</li>
                    <li><strong>Oro:</strong> 10% extra en coins + sorteos mensuales.</li>
                    <li><strong>Platino:</strong> 15% extra en coins + envíos gratis.</li>
                  </ul>
                </div>
              )}

              {activeSection === "historial" && (
                <div>
                  <h3 className="fw-bold mb-3">Historial de Actividad</h3>
                  {coins.history?.length ? (
                    <ul className="list-group">
                      {coins.history.slice().reverse().map((item, i) => (
                        <li
                          key={i}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>
                              {new Date(item.date).toLocaleDateString("es-CL")}
                            </strong>{" "}
                            — {item.description}
                          </div>
                          <span
                            className={`fw-bold ${item.earned > 0 ? "text-success" : "text-danger"}`}
                          >
                            {item.earned > 0 ? "+" : ""}
                            {item.earned}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-secondary">Aún no tienes actividad registrada.</p>
                  )}
                </div>
              )}

              {activeSection === "progreso" && (
                <div>
                  <h3 className="fw-bold mb-3">Progreso de Nivel</h3>
                  <p>
                    Nivel actual: <strong>{coins.level}</strong>
                  </p>
                  <p>
                    Coins totales: <strong>{coins.total}</strong>
                  </p>
                  <div className="progress my-3" style={{ height: "15px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${progressPercent}%`,
                        background: "linear-gradient(90deg, #d746fb 0%, #fdf040 100%)",
                      }}
                    ></div>
                  </div>
                  {nextLevelThreshold && (
                    <p className="small text-secondary">
                      Te faltan{" "}
                      <strong>{Math.max(nextLevelThreshold - coins.total, 0)}</strong> coins
                      para subir al nivel <strong>{nextLevelName}</strong>.
                    </p>
                  )}
                </div>
              )}

              {activeSection === "info" && (
                <div>
                  <h3 className="fw-bold mb-3">Información y Condiciones</h3>
                  <ul className="mb-0">
                    <li>Por cada $1.000 CLP en compras, ganas 20 coins.</li>
                    <li>Los puntos expiran a los 24 meses desde su obtención.</li>
                    <li>Los puntos no son canjeables por dinero en efectivo.</li>
                    <li>Level-Up se reserva el derecho de modificar las condiciones del programa.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
