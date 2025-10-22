import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./providers/CartProvider";
import { AuthProvider } from "./providers/AuthProvider";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CartSidebar from "./components/CartSidebar";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";    
import ProfilePage from "./pages/ProfilePage";
import CatalogPage from './pages/CatalogPage';
import LoyaltyPage from "./pages/LoyaltyPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
           <CartSidebar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/ingresar" element={<LoginPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/catalogo" element={<CatalogPage />} /> 
            <Route path="/puntos" element={<LoyaltyPage />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
