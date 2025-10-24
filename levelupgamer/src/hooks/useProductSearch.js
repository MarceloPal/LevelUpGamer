import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllProducts, getProductsByCategory } from '../data/products';

export const useProductSearch = (initialCategory = 'todo') => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Inicializar desde URL si existe, sino usar valores por defecto
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get('section') || initialCategory);
  const [sortBy, setSortBy] = useState('name');
  
  // Refs para evitar loops infinitos
  const isUpdatingFromUrl = useRef(false);
  const isUpdatingUrl = useRef(false);

  // Función para ordenar productos
  const sortProducts = (products, sortType) => {
    const productsArray = [...products];
    
    switch (sortType) {
      case 'name':
        return productsArray.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'name-desc':
        return productsArray.sort((a, b) => b.name.localeCompare(a.name));
      
      case 'price-asc':
        return productsArray.sort((a, b) => a.price - b.price);
      
      case 'price-desc':
        return productsArray.sort((a, b) => b.price - a.price);
      
      case 'rating':
        return productsArray.sort((a, b) => b.rating - a.rating);
      
      default:
        return productsArray;
    }
  };

  // Productos filtrados y ordenados
  const filteredProducts = useMemo(() => {
    let products;
    
    // Obtener productos según la categoría
    if (activeCategory === 'todo') {
      products = getAllProducts();
    } else {
      products = getProductsByCategory(activeCategory);
    }

    // Aplicar búsqueda por término si existe
    if (searchTerm && searchTerm.trim()) {
      products = products.filter(product => 
        product && product.name && product.brand &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Ordenar productos
    return sortProducts(products, sortBy);
  }, [searchTerm, activeCategory, sortBy]);

  // Estadísticas de búsqueda
  const searchStats = useMemo(() => ({
    totalProducts: filteredProducts.length,
    hasResults: filteredProducts.length > 0,
    isSearching: searchTerm.trim().length > 0,
    isFiltered: activeCategory !== 'todo'
  }), [filteredProducts.length, searchTerm, activeCategory]);

  // Funciones para actualizar estado
  const updateSearchTerm = (term) => {
    setSearchTerm(term || '');
  };

  const updateActiveCategory = (category) => {
    // Validar que la categoría existe
    const validCategories = ['todo', 'juegos', 'accesorios', 'consolas', 'computadores', 'sillas', 'mouse', 'mousepad', 'poleras', 'polerones'];
    if (validCategories.includes(category)) {
      setActiveCategory(category);
    } else {
      setActiveCategory('todo');
    }
  };

  const updateSortBy = (sort) => {
    setSortBy(sort);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveCategory('todo');
    setSortBy('name');
  };

  // Sincronizar estado con URL parameters - ESCUCHA los cambios de URL
  useEffect(() => {
    if (isUpdatingUrl.current) {
      isUpdatingUrl.current = false;
      return;
    }
    
    isUpdatingFromUrl.current = true;
    const categoryFromUrl = searchParams.get('section') || 'todo';
    const searchFromUrl = searchParams.get('search') || '';
    
    setActiveCategory(categoryFromUrl);
    setSearchTerm(searchFromUrl);
    
    setTimeout(() => {
      isUpdatingFromUrl.current = false;
    }, 0);
  }, [searchParams]);

  // Actualizar URL cuando cambian los filtros internamente
  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      return;
    }
    
    const timer = setTimeout(() => {
      isUpdatingUrl.current = true;
      const newParams = new URLSearchParams(searchParams);
      
      if (activeCategory !== 'todo') {
        newParams.set('section', activeCategory);
      } else {
        newParams.delete('section');
      }
      
      if (searchTerm && searchTerm.trim()) {
        newParams.set('search', searchTerm.trim());
      } else {
        newParams.delete('search');
      }

      const currentParams = searchParams.toString();
      const newParamsStr = newParams.toString();
      
      if (currentParams !== newParamsStr) {
        setSearchParams(newParams, { replace: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, searchTerm, searchParams, setSearchParams]);

  return {
    // Estado
    searchTerm,
    activeCategory,
    sortBy,
    
    // Datos
    filteredProducts,
    searchStats,
    
    // Acciones
    updateSearchTerm,
    updateActiveCategory,
    updateSortBy,
    clearAllFilters,
    
    // Utilidades
    sortProducts
  };
};