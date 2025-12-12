import { useState, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import api from "../api/apiClient"; 
import { toast } from "react-toastify";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [cartId, setCartId] = useState(null); 

 
  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      
      const data = response.data.data || response.data;
      const cartData = data.cart;
      
      if (cartData) {
        const formattedItems = cartData.items.map(item => ({
          id: item.product._id || item.product, 
          nombre: item.product.name || item.name,
          precio: item.price,
          imagen: item.product.image || item.image,
          cantidad: item.quantity
        }));
        setCart(formattedItems);
        setTotal(cartData.total);
        setCartId(cartData._id); 
      }
    } catch (error) {
      console.error("Error cargando carrito:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      await api.post('/cart/items', {
        productId: product.id, 
        quantity: 1
      });
      await fetchCart(); 
      toast.success("Producto agregado");
    } catch (error) {
      console.error(error);
      toast.error("Error al agregar al carrito");
    }
  };

  const updateQuantity = async (id, delta) => {
    try {
      const currentItem = cart.find(item => item.id === id);
      if (!currentItem) return;
      
      const newQuantity = currentItem.cantidad + delta;
      
      if (newQuantity > 0) {
        await api.put(`/cart/items/${id}`, { quantity: newQuantity });
      } else {
        await api.delete(`/cart/items/${id}`);
      }
      await fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/items/${id}`);
      await fetchCart();
      toast.info("Producto eliminado");
    } catch (error) {
      console.error(error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart([]);
      setTotal(0);
      setCartId(null); 
    } catch (error) {
      console.error(error);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId, 
        cartCount,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};