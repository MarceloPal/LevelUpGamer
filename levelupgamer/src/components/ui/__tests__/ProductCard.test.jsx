import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductCard from '../ProductCard';
import { CartContext } from '../../../contexts/CartContext';

const mockAddToCart = vi.fn();
const mockCartContext = {
  cart: [],
  cartCount: 0,
  total: 0,
  addToCart: mockAddToCart,
  updateQuantity: vi.fn(),
  removeFromCart: vi.fn(),
  clearCart: vi.fn()
};

const renderWithCart = (ui) => {
  return render(
    <CartContext.Provider value={mockCartContext}>{ui}</CartContext.Provider>
  );
};

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Mouse Gamer',
    brand: 'Logitech',
    price: 50000,
    oldPrice: 60000,
    image: '/img/mouse.jpg',
    stock: 10,
    rating: 4
  };

  beforeEach(() => {
    mockAddToCart.mockClear();
  });

  it('renderiza el producto correctamente', () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
    // Precio formateado en CLP con separador de miles
    expect(screen.getByText(/50[.,]000/)).toBeInTheDocument();
  });

  it('llama a addToCart al hacer click en el botón', () => {
    renderWithCart(<ProductCard product={mockProduct} />);
    const button = screen.getByRole('button', { name: /agregar/i });
    fireEvent.click(button);
    // ProductCard transforma las props antes de enviarlas a addToCart
    expect(mockAddToCart).toHaveBeenCalledWith({
      id: mockProduct.id,
      nombre: mockProduct.name,
      precio: mockProduct.price,
      imagen: mockProduct.image,
      marca: mockProduct.brand
    });
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });
});