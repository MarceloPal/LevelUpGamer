import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CartSidebar from "./components/CartSidebar";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";    
import ProfilePage from "./pages/ProfilePage";
import CatalogPage from './pages/CatalogPage';
import LoyaltyPage from "./pages/LoyaltyPage";
import { AdminPage } from "./pages/AdminPage";
import TestBackendPage from "./pages/TestBackendPage";
import TestOrdersPage from "./pages/TestOrdersPage";
import DiagnosticPage from "./pages/DiagnosticPage";
import TermsPage from "./pages/TermsPage";
import LegalBasesPage from "./pages/LegalBasesPage";
import ComplaintChannelPage from "./pages/ComplaintChannelPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import { useAuth } from "./hooks/useAuth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const hideLayoutRoutes = ["/ingresar", "/admin"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

    // Redireccionar si no es admin
  const isAdminRoute = location.pathname === "/admin";
  if (isAdminRoute && (!user || user.role !== "admin")) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {!hideLayout && <Navbar />}
      {!hideLayout && <CartSidebar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/ingresar" element={<LoginPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/catalogo" element={<CatalogPage />} /> 
        <Route path="/puntos" element={<LoyaltyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/test-backend" element={<TestBackendPage />} />
        <Route path="/test-orders" element={<TestOrdersPage />} />
        <Route path="/diagnostic" element={<DiagnosticPage />} />
        <Route path="/terminos-condiciones" element={<TermsPage />} />
        <Route path="/bases-legales" element={<LegalBasesPage />} />
        <Route path="/canal-denuncias" element={<ComplaintChannelPage />} />
        <Route path="/politica-privacidad" element={<PrivacyPolicyPage />} />
      </Routes>

      {!hideLayout && <Footer />}
      {/* Global toast container for actions */}
      <ToastContainer position="bottom-right" autoClose={3500} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
