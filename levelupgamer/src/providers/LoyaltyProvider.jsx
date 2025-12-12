import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { LoyaltyContext } from "../contexts/LoyaltyContext";
import api from "../api/apiClient"; 

export const LoyaltyProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Estado inicial
  const [coins, setCoins] = useState({ 
    total: 0, 
    level: "Bronce", 
    history: [] 
  });

  const [loading, setLoading] = useState(false);

 
  const fetchLoyaltyAccount = useCallback(async () => {
    if (!user) {
      setCoins({ total: 0, level: "Bronce", history: [] });
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/loyalty/account');
      

      const data = response.data.data || response.data;
      const account = data.account;

      if (account) {

        const tierMap = {
          bronze: "Bronce",
          silver: "Plata",
          gold: "Oro",
          platinum: "Platino"
        };

        setCoins({
          total: account.points,
          level: tierMap[account.tier] || "Bronce",
          history: [] 
        });
      }
    } catch (error) {
      console.error("Error cargando puntos:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  
  useEffect(() => {
    fetchLoyaltyAccount();
  }, [fetchLoyaltyAccount]);


  const addPoints = () => {
    fetchLoyaltyAccount();
  };

 const redeemDiscount = async (cost) => {
    if (coins.total < cost) return false;

   
    setCoins(prev => ({
      ...prev,
      total: prev.total - cost
    }));
    return true;
  };

  return (
    <LoyaltyContext.Provider 
      value={{ 
        coins, 
        loading,        
        addPoints, 
        redeemDiscount, 
        refreshPoints: fetchLoyaltyAccount 
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};