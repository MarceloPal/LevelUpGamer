import { useState, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import { useAuth } from "../hooks/useAuth";

export const CartProvider = ({ children }) => {
  const STORAGE_KEY = "levelup_cart_v1";
  const GUEST_CART_KEY = "levelup_guest_cart";
  
  const { user } = useAuth();

  // Función para obtener la key correcta según el usuario
  const getStorageKey = () => {
    return user ? `${STORAGE_KEY}_${user.id}` : GUEST_CART_KEY;
  };

  const [cart, setCart] = useState(() => {
    const storageKey = user ? `${STORAGE_KEY}_${user.id}` : GUEST_CART_KEY;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Sincronizar carrito cuando cambia el usuario (login/logout)
  useEffect(() => {
    const newStorageKey = getStorageKey();
    const savedCart = localStorage.getItem(newStorageKey);
    
    if (savedCart) {
      // Si hay un carrito guardado para este usuario, cargarlo
      setCart(JSON.parse(savedCart));
    } else if (user && cart.length > 0) {
      // Si el usuario acaba de hacer login y tiene items en el carrito de invitado,
      // transferir esos items al carrito del usuario
      const guestCart = localStorage.getItem(GUEST_CART_KEY);
      if (guestCart) {
        const guestItems = JSON.parse(guestCart);
        if (guestItems.length > 0) {
          setCart(guestItems);
          // Limpiar el carrito de invitado
          localStorage.removeItem(GUEST_CART_KEY);
        }
      }
    } else if (!user) {
      // Si se hace logout, cargar el carrito de invitado si existe
      const guestCart = localStorage.getItem(GUEST_CART_KEY);
      setCart(guestCart ? JSON.parse(guestCart) : []);
    }
  }, [user]);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, user]);

  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        return [...prev, { ...product, cantidad: 1 }];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + delta } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};