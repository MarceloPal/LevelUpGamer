import { useState, useEffect } from "react";

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