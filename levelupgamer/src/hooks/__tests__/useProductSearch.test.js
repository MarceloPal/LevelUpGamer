import { renderHook, act } from '@testing-library/react';
import { useProductSearch } from '../useProductSearch';
import { getAllProducts, getProductsByCategory } from '../../data/products';

// Mock de los módulos
jest.mock('../../data/products');
jest.mock('react-router-dom', () => ({
  useSearchParams: () => [new URLSearchParams(), jest.fn()]
}));

describe('useProductSearch', () => {
  const mockProducts = [
    { id: '1', name: 'Mouse Gamer', brand: 'Logitech', price: 50000, category: 'mouse' },
    { id: '2', name: 'Teclado Mecánico', brand: 'Corsair', price: 80000, category: 'accesorios' },
    { id: '3', name: 'Mousepad RGB', brand: 'Razer', price: 25000, category: 'mousepad' }
  ];

  beforeEach(() => {
    getAllProducts.mockResolvedValue(mockProducts);
    getProductsByCategory.mockResolvedValue(mockProducts.filter(p => p.category === 'mouse'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe cargar productos al inicializar', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useProductSearch());

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.filteredProducts.length).toBeGreaterThan(0);
  });

  it('debe filtrar productos por término de búsqueda', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useProductSearch());

    await act(async () => {
      await waitForNextUpdate();
    });

    act(() => {
      result.current.updateSearchTerm('Mouse');
    });

    const filteredProducts = result.current.filteredProducts;
    expect(filteredProducts.length).toBeGreaterThan(0);
    expect(filteredProducts.every(p => 
      p.name.toLowerCase().includes('mouse') || p.brand.toLowerCase().includes('mouse')
    )).toBe(true);
  });

  it('debe normalizar búsqueda ignorando tildes', async () => {
    const productsWithAccents = [
      { id: '4', name: 'Ratón Gaming', brand: 'Logitech', price: 50000 },
      { id: '5', name: 'Teclado Mecánico', brand: 'Corsair', price: 80000 }
    ];

    getAllProducts.mockResolvedValue(productsWithAccents);

    const { result, waitForNextUpdate } = renderHook(() => useProductSearch());

    await act(async () => {
      await waitForNextUpdate();
    });

    // Buscar "raton" (sin tilde) debe encontrar "Ratón" (con tilde)
    act(() => {
      result.current.updateSearchTerm('raton');
    });

    const filteredProducts = result.current.filteredProducts;
    expect(filteredProducts.length).toBeGreaterThan(0);
    expect(filteredProducts.some(p => p.name.includes('Ratón'))).toBe(true);
  });

  it('debe ordenar productos por nombre', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useProductSearch());

    await act(async () => {
      await waitForNextUpdate();
    });

    act(() => {
      result.current.updateSortBy('name');
    });

    const products = result.current.filteredProducts;
    for (let i = 0; i < products.length - 1; i++) {
      expect(products[i].name.localeCompare(products[i + 1].name)).toBeLessThanOrEqual(0);
    }
  });

  it('debe ordenar productos por precio ascendente', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useProductSearch());

    await act(async () => {
      await waitForNextUpdate();
    });

    act(() => {
      result.current.updateSortBy('price-asc');
    });

    const products = result.current.filteredProducts;
    for (let i = 0; i < products.length - 1; i++) {
      expect(products[i].price).toBeLessThanOrEqual(products[i + 1].price);
    }
  });

  it('debe limpiar todos los filtros', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useProductSearch());

    await act(async () => {
      await waitForNextUpdate();
    });

    act(() => {
      result.current.updateSearchTerm('Mouse');
      result.current.updateActiveCategory('accesorios');
      result.current.updateSortBy('price-desc');
    });

    act(() => {
      result.current.clearAllFilters();
    });

    expect(result.current.searchTerm).toBe('');
    expect(result.current.activeCategory).toBe('todo');
    expect(result.current.sortBy).toBe('name');
  });

  it('debe proporcionar estadísticas de búsqueda correctas', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useProductSearch());

    await act(async () => {
      await waitForNextUpdate();
    });

    const stats = result.current.searchStats;
    expect(stats).toHaveProperty('totalProducts');
    expect(stats).toHaveProperty('hasResults');
    expect(stats).toHaveProperty('isSearching');
    expect(stats).toHaveProperty('isFiltered');
  });
});
