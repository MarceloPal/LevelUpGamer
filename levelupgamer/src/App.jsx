import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./providers/CartProvider";
import { AuthProvider } from "./providers/AuthProvider";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/ingresar" element={<LoginPage />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
