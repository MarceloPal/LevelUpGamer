import { createContext, useContext } from "react";

export const LoyaltyContext = createContext();

export const useLoyalty = () => useContext(LoyaltyContext);
