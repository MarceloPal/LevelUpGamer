import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoyaltyContext } from "../contexts/LoyaltyContext";

export const LoyaltyProvider = ({ children }) => {
  const { user } = useAuth();
  const STORAGE_KEY = "levelup_loyalty_v1";

  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { total: 0, level: "Bronce", history: [] };
  });

  // 🧠 Niveles automáticos
  const getLevel = (points) => {
    if (points >= 1000) return "Platino";
    if (points >= 600) return "Oro";
    if (points >= 300) return "Plata";
    return "Bronce";
  };

  // 💰 Agregar puntos tras cada compra
  const addPoints = (purchaseTotal) => {
    const earned = Math.floor(purchaseTotal / 1000) * 20;
    const newTotal = coins.total + earned;
    const newLevel = getLevel(newTotal);

    const updated = {
      total: newTotal,
      level: newLevel,
      history: [
        ...coins.history,
        {
          date: new Date().toISOString(),
          description: `Compra en Level-Up por $${purchaseTotal.toLocaleString()}`,
          earned,
        },
      ],
    };

    setCoins(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // 🏷️ Canjear puntos
  const redeemDiscount = (cost) => {
    if (coins.total < cost) return false;

    const updated = {
      ...coins,
      total: coins.total - cost,
      history: [
        ...coins.history,
        {
          date: new Date().toISOString(),
          description: `Canje de descuento (-${cost} coins)`,
          earned: -cost,
        },
      ],
    };

    setCoins(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  };

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(coins));
  }, [coins, user]);

  return (
    <LoyaltyContext.Provider value={{ coins, addPoints, redeemDiscount }}>
      {children}
    </LoyaltyContext.Provider>
  );
};
