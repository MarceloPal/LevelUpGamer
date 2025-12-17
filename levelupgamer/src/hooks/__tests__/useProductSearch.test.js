import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useProductSearch } from '../useProductSearch';
import { getAllProducts, getProductsByCategory } from '../../data/products';

// 1. Mocks con sintaxis Vitest
vi.mock('../../data/products');
// Usar instancias estables para evitar que el efecto de sincronización con URL
// sobreescriba `searchTerm` en cada render
const stableParams = new URLSearchParams();
const setStableParams = vi.fn();
vi.mock('react-router-dom', () => ({
  useSearchParams: () => [stableParams, setStableParams]
}));

describe('useProductSearch', () => {
  const mockProducts = [
    { id: '1', name: 'Mouse Gamer', brand: 'Logitech', price: 50000, category: 'mouse' },
    { id: '2', name: 'Teclado Mecánico', brand: 'Corsair', price: 80000, category: 'accesorios' },
    { id: '3', name: 'Mousepad RGB', brand: 'Razer', price: 25000, category: 'mousepad' }
  ];

  beforeEach(() => {
    // Configurar los mocks antes de cada test
    vi.mocked(getAllProducts).mockResolvedValue(mockProducts);
    vi.mocked(getProductsByCategory).mockResolvedValue(mockProducts.filter(p => p.category === 'mouse'));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar productos al inicializar', async () => {
    const { result } = renderHook(() => useProductSearch());

    // Estado inicial de carga
    expect(result.current.isLoading).toBe(true);

    // 2. REEMPLAZO DE waitForNextUpdate: Usamos waitFor para esperar el cambio de estado
    await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.filteredProducts.length).toBeGreaterThan(0);
  });

  it('debe filtrar productos por término de búsqueda', async () => {
    const { result } = renderHook(() => useProductSearch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updateSearchTerm('Mouse');
    });

    await waitFor(() => {
      const filteredProducts = result.current.filteredProducts;
      expect(filteredProducts.length).toBeGreaterThan(0);
      expect(filteredProducts.every(p => 
        p.name.toLowerCase().includes('mouse') || p.brand.toLowerCase().includes('mouse')
      )).toBe(true);
    });
  });

  it('debe normalizar búsqueda ignorando tildes', async () => {
    const productsWithAccents = [
      { id: '4', name: 'Ratón Gaming', brand: 'Logitech', price: 50000 },
      { id: '5', name: 'Teclado Mecánico', brand: 'Corsair', price: 80000 }
    ];

    vi.mocked(getAllProducts).mockResolvedValue(productsWithAccents);

    const { result } = renderHook(() => useProductSearch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updateSearchTerm('raton');
    });

    const filteredProducts = result.current.filteredProducts;
    expect(filteredProducts.length).toBeGreaterThan(0);
    expect(filteredProducts.some(p => p.name.includes('Ratón'))).toBe(true);
  });

  it('debe ordenar productos por nombre', async () => {
    const { result } = renderHook(() => useProductSearch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updateSortBy('name');
    });

    const products = result.current.filteredProducts;
    for (let i = 0; i < products.length - 1; i++) {
      expect(products[i].name.localeCompare(products[i + 1].name)).toBeLessThanOrEqual(0);
    }
  });

  it('debe ordenar productos por precio ascendente', async () => {
    const { result } = renderHook(() => useProductSearch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updateSortBy('price-asc');
    });

    const products = result.current.filteredProducts;
    for (let i = 0; i < products.length - 1; i++) {
      expect(products[i].price).toBeLessThanOrEqual(products[i + 1].price);
    }
  });

  it('debe limpiar todos los filtros', async () => {
    const { result } = renderHook(() => useProductSearch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

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
    const { result } = renderHook(() => useProductSearch());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const stats = result.current.searchStats;
    expect(stats).toHaveProperty('totalProducts');
    expect(stats).toHaveProperty('hasResults');
    expect(stats).toHaveProperty('isSearching');
    expect(stats).toHaveProperty('isFiltered');
  });
});