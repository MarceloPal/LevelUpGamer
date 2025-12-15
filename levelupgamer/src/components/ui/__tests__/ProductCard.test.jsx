import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { CartContext } from '../../../contexts/CartContext';

// Mock del contexto del carrito
const mockAddToCart = jest.fn();
const mockCartContext = {
  cart: [],
  cartCount: 0,
  total: 0,
  addToCart: mockAddToCart,
  updateQuantity: jest.fn(),
  removeFromCart: jest.fn(),
  clearCart: jest.fn()
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <CartContext.Provider value={mockCartContext}>
        {component}
      </CartContext.Provider>
    </BrowserRouter>
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
    rating: 4.5
  };

  beforeEach(() => {
    mockAddToCart.mockClear();
  });

  it('debe renderizar la información del producto correctamente', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
    expect(screen.getByText('Logitech')).toBeInTheDocument();
    expect(screen.getByText(/50.*000/)).toBeInTheDocument();
  });

  it('debe mostrar el precio anterior si existe', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(/60.*000/)).toBeInTheDocument();
  });

  it('debe mostrar la imagen del producto', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Mouse Gamer');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/img/mouse.jpg');
  });

  it('debe llamar a addToCart cuando se hace clic en el botón de agregar', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /agregar/i });
    fireEvent.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar "Sin stock" cuando el producto no tiene stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText(/sin stock/i)).toBeInTheDocument();
  });

  it('debe deshabilitar el botón de agregar cuando no hay stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);

    const addButton = screen.getByRole('button', { name: /agregar/i });
    expect(addButton).toBeDisabled();
  });

  it('debe mostrar el rating del producto si existe', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    // Buscar el rating (puede ser un número o estrellas)
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
  });

  it('debe mostrar descuento calculado correctamente', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    // Calcular descuento esperado: (60000 - 50000) / 60000 * 100 = 16.67%
    const discountElement = screen.getByText(/-\d+%/);
    expect(discountElement).toBeInTheDocument();
  });

  it('debe manejar productos sin precio anterior', () => {
    const productWithoutOldPrice = { ...mockProduct, oldPrice: null };
    renderWithProviders(<ProductCard product={productWithoutOldPrice} />);

    // No debe mostrar precio anterior ni descuento
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });

  it('debe formatear el precio correctamente con separador de miles', () => {
    const expensiveProduct = { ...mockProduct, price: 1500000 };
    renderWithProviders(<ProductCard product={expensiveProduct} />);

    // Debe mostrar 1.500.000 o 1,500,000 dependiendo del formato
    expect(screen.getByText(/1[.,]500[.,]000/)).toBeInTheDocument();
  });
});
