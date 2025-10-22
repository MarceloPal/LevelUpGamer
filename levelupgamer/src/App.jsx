import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CartSidebar from "./components/CartSidebar";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";    
import ProfilePage from "./pages/ProfilePage";
import CatalogPage from './pages/CatalogPage';
import LoyaltyPage from "./pages/LoyaltyPage";

function AppContent() {
  const location = useLocation();
  const hideLayoutRoutes = ["/ingresar"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {!hideLayout && <CartSidebar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/ingresar" element={<LoginPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/catalogo" element={<CatalogPage />} /> 
        <Route path="/puntos" element={<LoyaltyPage />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
