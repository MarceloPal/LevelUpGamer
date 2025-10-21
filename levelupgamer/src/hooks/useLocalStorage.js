import { useState, useEffect } from "react";


//los hooks son funciones de react que hacen mas facil el manejo de estados y efectos secundarios
//Sirven para no repetir código y para automatizar tareas comunes.
//en este caso, este hook maneja la sincronización de un estado con localStorage

// Hook reutilizable para sincronizar un estado con localStorage
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error al guardar en localStorage", error);
    }
  }, [key, value]);

  return [value, setValue];
};