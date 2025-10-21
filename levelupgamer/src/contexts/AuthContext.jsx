import { createContext } from "react";

//los contextos permiten compartir datos entre componentes sin tener que 
// pasar props manualmente en cada nivel de la jerarquía de componentes.
//El sistema que recuerda quien eres y que compraste.
//son como cerebros centrales de datos para diferentes aspectos de la app.
//Guardan información importante que muchos componentes necesitan saber,
//sin tener que estar pasándola de uno a otro manualmente.

//auth context se usará para manejar la autenticación del usuario
//y compartir el estado de autenticación en toda la aplicación.

// Contexto de autenticación (sin lógica)
export const AuthContext = createContext(null);
