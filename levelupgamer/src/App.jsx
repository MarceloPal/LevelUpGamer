import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartProvider"; 
import Navbar from "./components/layout/Navbar";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import Footer from "./components/layout/Footer";
import CartSidebar from "./components/CartSidebar";

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <CartSidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/carrito" element={<CartPage />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
