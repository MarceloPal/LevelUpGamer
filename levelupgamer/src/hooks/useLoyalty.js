import { useContext } from "react";
import { LoyaltyContext } from "../contexts/LoyaltyContext";

export const useLoyalty = () => useContext(LoyaltyContext);