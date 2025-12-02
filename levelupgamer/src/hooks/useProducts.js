import { useState, useEffect } from 'react';
import productService from '../services/productService';
import { clearCache } from '../data/products';

/**
 * Hook para manejar operaciones CRUD de productos con el backend
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos desde el backend
  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await productService.getAllProducts({ limit: 1000 });
      if (result.success) {
        setProducts(result.products);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);

  // Crear producto
  const createProduct = async (productData) => {
    try {
      const result = await productService.createProduct(productData);
      if (result.success) {
        clearCache();
        await loadProducts(); // Recargar lista
        return { success: true, product: result.product, message: result.message };
      }
      return { success: false, message: result.message };
    } catch (err) {
      return { success: false, message: 'Error al crear producto' };
    }
  };

  // Actualizar producto
  const updateProduct = async (id, productData) => {
    try {
      const result = await productService.updateProduct(id, productData);
      if (result.success) {
        clearCache();
        await loadProducts(); // Recargar lista
        return { success: true, product: result.product, message: result.message };
      }
      return { success: false, message: result.message };
    } catch (err) {
      return { success: false, message: 'Error al actualizar producto' };
    }
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    try {
      const result = await productService.deleteProduct(id);
      if (result.success) {
        clearCache();
        await loadProducts(); // Recargar lista
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message };
    } catch (err) {
      return { success: false, message: 'Error al eliminar producto' };
    }
  };

  // Actualizar stock
  const updateStock = async (id, stockData) => {
    try {
      const result = await productService.updateStock(id, stockData);
      if (result.success) {
        clearCache();
        await loadProducts(); // Recargar lista
        return { success: true, product: result.product, message: result.message };
      }
      return { success: false, message: result.message };
    } catch (err) {
      return { success: false, message: 'Error al actualizar stock' };
    }
  };

  // Subir imagen
  const uploadImage = async (imageFile) => {
    try {
      const result = await productService.uploadImage(imageFile);
      return result;
    } catch (err) {
      return { success: false, message: 'Error al subir imagen' };
    }
  };

  return {
    products,
    isLoading,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    uploadImage
  };
};
