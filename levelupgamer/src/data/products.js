import productService from '../services/productService';
import categoryService from '../services/categoryService';

// Cache para productos y categorías
let productsCache = null;
let categoriesCache = null;

// Mapear producto del backend al formato del frontend
const mapProductFromBackend = (product) => {
  return {
    id: product._id || product.productId,
    productId: product.productId,
    name: product.name,
    brand: product.brand || 'Sin marca',
    price: product.price,
    oldPrice: product.oldPrice || null,
    image: product.image || product.images?.[0] || '/img/placeholder-product.svg',
    images: product.images || [product.image],
    rating: product.rating || 5,
    category: product.category,
    stock: product.stock?.current || 0,
    description: product.description || '',
    slug: product.slug,
    isActive: product.isActive
  };
};

// Mapear categoría del backend al formato del frontend
const mapCategoryFromBackend = (category) => {
  return {
    id: category.slug, // Usar slug como id para compatibilidad
    _id: category._id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    icon: category.icon
  };
};

// Función para obtener todos los productos desde el backend
export const getAllProducts = async () => {
  // Si ya tenemos productos en cache, retornarlos
  if (productsCache) {
    return productsCache;
  }

  const result = await productService.getAllProducts({ limit: 1000 });
  
  if (result.success) {
    productsCache = result.products.map(mapProductFromBackend);
    return productsCache;
  }
  
  console.error('Error al obtener productos:', result.message);
  return [];
};

// Función para obtener productos por categoría desde el backend
export const getProductsByCategory = async (categorySlug) => {
  const result = await productService.getAllProducts({ category: categorySlug, limit: 1000 });
  
  if (result.success) {
    return result.products.map(mapProductFromBackend);
  }
  
  console.error('Error al obtener productos por categoría:', result.message);
  return [];
};

// Función para obtener todas las categorías desde el backend
export const getAllCategories = async () => {
  // Si ya tenemos categorías en cache, retornarlas
  if (categoriesCache) {
    return categoriesCache;
  }

  const result = await categoryService.getAllCategories();
  
  if (result.success) {
    categoriesCache = result.categories.map(mapCategoryFromBackend);
    return categoriesCache;
  }
  
  console.error('Error al obtener categorías:', result.message);
  return [];
};

// Función para buscar productos (ahora asíncrona)
export const searchProducts = async (query, categorySlug = null) => {
  let productsToSearch = categorySlug && categorySlug !== 'todo' 
    ? await getProductsByCategory(categorySlug) 
    : await getAllProducts();

  if (!query.trim()) return productsToSearch;

  return productsToSearch.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.brand.toLowerCase().includes(query.toLowerCase())
  );
};

// Función para limpiar el cache (útil después de crear/actualizar/eliminar)
export const clearCache = () => {
  productsCache = null;
  categoriesCache = null;
};

// Mantener compatibilidad con código antiguo que usa categories como objeto
// Esto se cargará de forma asíncrona
export let categories = [];

// Cargar categorías al iniciar
getAllCategories().then(cats => {
  categories = cats;
});