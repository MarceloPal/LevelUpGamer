import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllProducts } from '../data/products';
import '../styles/admin.css';

export const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filterStock, setFilterStock] = useState('all');
  const [highlightedProduct, setHighlightedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    price: 0,
    stock: 0,
    image: '/img/placeholder-product.svg'
  });

  // Cargar productos al montar el componente
  useEffect(() => {
    // Verificar si ya hay productos en localStorage
    let storedProducts = JSON.parse(localStorage.getItem('lu_products')) || [];
    
    // Si no hay productos en localStorage, cargar desde el catálogo
    if (storedProducts.length === 0) {
      const catalogProducts = getAllProducts();
      // Añadir stock a los productos del catálogo si no lo tienen
      storedProducts = catalogProducts.map(product => ({
        ...product,
        stock: product.stock !== undefined ? product.stock : Math.floor(Math.random() * 20) + 5 // Stock entre 5 y 24
      }));
      localStorage.setItem('lu_products', JSON.stringify(storedProducts));
    }
    
    setProducts(storedProducts);

    // Redirigir si no es admin
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Guardar productos en localStorage
  const saveProducts = (updatedProducts) => {
    localStorage.setItem('lu_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  // Crear nuevo producto
  const handleCreate = () => {
    // Resetear el formulario de nuevo producto
    setNewProduct({
      id: Date.now().toString(),
      name: '',
      price: 0,
      stock: 0,
      image: '/img/placeholder-product.svg'
    });
    setImagePreview(null);
    setShowCreateModal(true);
  };

  const confirmCreate = () => {
    // Validar campos obligatorios
    if (!newProduct.name.trim()) {
      toast.error('⚠️ El nombre del producto es obligatorio', {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    // Crear el producto completo con todos los campos
    const productToCreate = {
      id: newProduct.id,
      name: newProduct.name,
      price: Number(newProduct.price),
      oldPrice: null,
      stock: Number(newProduct.stock),
      category: 'accesorios',
      brand: 'Sin marca',
      description: 'Descripción del producto',
      image: imagePreview || newProduct.image,
      rating: 5,
    };
    
    // Agregar el producto al inicio de la lista
    const updatedProducts = [productToCreate, ...products];
    saveProducts(updatedProducts);
    setShowCreateModal(false);
    
    // Mostrar toast de éxito
    toast.success('✅ Producto creado con éxito', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    // Destacar visualmente el producto recién creado
    setHighlightedProduct(productToCreate.id);
    
    // Scroll automático hacia el producto
    setTimeout(() => {
      const productElement = document.querySelector(`[data-product-id="${productToCreate.id}"]`);
      if (productElement) {
        productElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      } else {
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
          productsGrid.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
    }, 200);
    
    // Remover el destacado después de 5 segundos
    setTimeout(() => {
      setHighlightedProduct(null);
    }, 5000);
  };

  // Actualizar producto
  const handleUpdate = (updatedProduct) => {
    // Si hay una imagen previa, aplicarla
    if (imagePreview) {
      updatedProduct.image = imagePreview;
    }
    
    // Remover el producto de su posición actual
    const filteredProducts = products.filter(p => p.id !== updatedProduct.id);
    
    // Insertar el producto actualizado en la PRIMERA posición
    const updatedProducts = [updatedProduct, ...filteredProducts];
    
    saveProducts(updatedProducts);
    setEditingProduct(null);
    setImagePreview(null);
    
    toast.success('✅ Cambios guardados exitosamente', {
      position: "top-right",
      autoClose: 3000,
    });
    
    // Destacar visualmente el producto editado
    setHighlightedProduct(updatedProduct.id);
    
    // Scroll suave hacia la parte superior de la grilla (donde está el producto)
    setTimeout(() => {
      // Primero intentar hacer scroll al elemento específico
      const productElement = document.querySelector(`[data-product-id="${updatedProduct.id}"]`);
      if (productElement) {
        productElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      } else {
        // Si no encuentra el elemento, hacer scroll a la grilla
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
          productsGrid.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
    }, 200);
    
    // Remover el destacado después de 5 segundos
    setTimeout(() => {
      setHighlightedProduct(null);
    }, 5000);
  };

  // Manejar carga de imagen (simulada) para edición
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar carga de imagen para creación
  const handleCreateImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Solicitar confirmación para eliminar
  const requestDelete = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  // Eliminar producto confirmado
  const confirmDelete = () => {
    if (productToDelete) {
      const updatedProducts = products.filter(p => p.id !== productToDelete);
      saveProducts(updatedProducts);
      toast.success('🗑️ Producto eliminado', {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Selección múltiple
  const toggleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  // Acciones masivas
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      toast.warning('⚠️ Seleccione al menos un producto', {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    const confirmed = window.confirm(`¿Está seguro de eliminar ${selectedProducts.length} productos seleccionados? Esta acción es irreversible.`);
    if (confirmed) {
      const updatedProducts = products.filter(p => !selectedProducts.includes(p.id));
      saveProducts(updatedProducts);
      setSelectedProducts([]);
      toast.success(`🗑️ ${selectedProducts.length} productos eliminados`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Filtrado y ordenamiento
  const getSortedAndFilteredProducts = () => {
    let filtered = [...products];

    // Filtrar por stock
    if (filterStock === 'available') {
      filtered = filtered.filter(p => p.stock > 0);
    } else if (filterStock === 'outofstock') {
      filtered = filtered.filter(p => p.stock === 0);
    }

    // Si hay un producto destacado, mantenerlo al inicio
    if (highlightedProduct) {
      const highlightedIndex = filtered.findIndex(p => p.id === highlightedProduct);
      if (highlightedIndex > 0) {
        const [highlighted] = filtered.splice(highlightedIndex, 1);
        filtered.unshift(highlighted);
      }
      // No aplicar ordenamiento cuando hay un producto destacado
      return filtered;
    }

    // Ordenar solo si no hay producto destacado
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return b.stock - a.stock;
        case 'date':
          return b.id - a.id; // ID más reciente primero
        default:
          return 0;
      }
    });

    return filtered;
  };

  const displayProducts = getSortedAndFilteredProducts();

  return (
    <div className="admin-container">
      <ToastContainer />
      
      {/* Indicador de rol en barra superior */}
      <div className="admin-role-bar">
        <span className="admin-role-badge">MODO ADMIN</span>
      </div>
      
      {/* Header minimalista */}
      <div className="admin-header">
        <h1 className="admin-main-title">Gestor de Catálogo de Productos</h1>
        <button onClick={handleCreate} className="create-button">
          <i className="bi bi-plus-circle"></i> Agregar Nuevo Producto
        </button>
      </div>

      {/* Filtros y acciones masivas */}
      <div className="admin-controls">
        <div className="filters-section">
          <label>Ordenar por:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
            <option value="stock">Stock</option>
            <option value="date">Fecha de Creación</option>
          </select>

          <label>Filtrar por:</label>
          <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
            <option value="all">Todos</option>
            <option value="available">Disponibles</option>
            <option value="outofstock">Agotados</option>
          </select>
        </div>

        <div className="bulk-actions">
          <label>
            <input 
              type="checkbox" 
              checked={selectedProducts.length === products.length && products.length > 0}
              onChange={selectAllProducts}
            />
            Seleccionar todos
          </label>
          <button 
            onClick={handleBulkDelete} 
            className="bulk-delete-button"
            disabled={selectedProducts.length === 0}
          >
            <i className="bi bi-trash"></i> Eliminar seleccionados ({selectedProducts.length})
          </button>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="products-grid">
        {displayProducts.map(product => (
          <div 
            key={product.id}
            data-product-id={product.id}
            className={`product-card ${product.stock === 0 ? 'out-of-stock' : ''} ${highlightedProduct === product.id ? 'highlighted' : ''}`}
          >
            {/* Checkbox de selección */}
            <div className="product-checkbox">
              <input 
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => toggleSelectProduct(product.id)}
              />
            </div>

            {/* ID del producto */}
            <div className="product-id">ID: {product.id}</div>

            {/* Badge de estado */}
            {product.stock === 0 && (
              <div className="stock-badge out-of-stock-badge">Agotado</div>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="stock-badge low-stock-badge">Stock Bajo</div>
            )}

            {/* Ícono de edición rápida */}
            <button 
              className="quick-edit-icon"
              onClick={() => setEditingProduct(product)}
              title="Edición rápida"
            >
              <i className="bi bi-pencil"></i>
            </button>

            <img src={product.image} alt={product.name} />
            
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-brand">{product.brand}</p>
              <p className="product-price">Precio: ${product.price.toLocaleString()}</p>
              <p className={`product-stock ${product.stock === 0 ? 'no-stock' : ''}`}>
                Stock: {product.stock} unidades
              </p>
              <div className="actions">
                <button onClick={() => setEditingProduct(product)} className="edit-btn">
                  <i className="bi bi-pencil-square"></i> Editar
                </button>
                <button onClick={() => requestDelete(product.id)} className="delete-btn">
                  <i className="bi bi-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de creación */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => {
          setShowCreateModal(false);
          setImagePreview(null);
        }}>
          <div className="modal-content create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="bi bi-plus-circle"></i> Crear Nuevo Producto</h2>
              <button 
                className="close-modal-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  setImagePreview(null);
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="edit-modal-body">
              {/* Previsualización de imagen */}
              <div className="image-upload-section">
                <label className="image-upload-label">Imagen del Producto</label>
                <div className="image-preview-container">
                  <img 
                    src={imagePreview || newProduct.image} 
                    alt="Preview" 
                    className="image-preview"
                  />
                  <div className="image-upload-overlay">
                    <label htmlFor="create-image-upload" className="upload-btn">
                      <i className="bi bi-cloud-upload"></i>
                      <span>Subir Imagen</span>
                    </label>
                    <input
                      id="create-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleCreateImageUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Campos de creación */}
              <div className="edit-fields">
                <div className="form-group">
                  <label htmlFor="new-product-id">ID del Producto *</label>
                  <input
                    id="new-product-id"
                    type="text"
                    placeholder="ID único (ej: prod-001)"
                    value={newProduct.id}
                    onChange={e => setNewProduct({
                      ...newProduct,
                      id: e.target.value
                    })}
                    disabled
                  />
                  <small className="field-hint">ID generado automáticamente</small>
                </div>

                <div className="form-group">
                  <label htmlFor="new-product-name">Nombre del Producto *</label>
                  <input
                    id="new-product-name"
                    type="text"
                    placeholder="Ej: Mouse Gamer RGB"
                    value={newProduct.name}
                    onChange={e => setNewProduct({
                      ...newProduct,
                      name: e.target.value
                    })}
                    autoFocus
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="new-product-price">Precio ($) *</label>
                    <input
                      id="new-product-price"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={newProduct.price}
                      onChange={e => setNewProduct({
                        ...newProduct,
                        price: e.target.value
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="new-product-stock">Stock (unidades) *</label>
                    <input
                      id="new-product-stock"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={newProduct.stock}
                      onChange={e => setNewProduct({
                        ...newProduct,
                        stock: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={confirmCreate} className="confirm-btn">
                <i className="bi bi-check-circle"></i> Guardar Producto
              </button>
              <button onClick={() => {
                setShowCreateModal(false);
                setImagePreview(null);
              }} className="cancel-btn">
                <i className="bi bi-x-circle"></i> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content warning" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon warning-icon">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h2>¿Confirmar Eliminación?</h2>
            <p>¿Está seguro de que desea eliminar este producto?</p>
            <p className="modal-warning">Esta acción es irreversible.</p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="confirm-delete-btn">
                <i className="bi bi-trash"></i> Eliminar
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">
                <i className="bi bi-x-circle"></i> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición Rápida */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => {
          setEditingProduct(null);
          setImagePreview(null);
        }}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="bi bi-pencil-square"></i> Edición Rápida</h2>
              <button 
                className="close-modal-btn"
                onClick={() => {
                  setEditingProduct(null);
                  setImagePreview(null);
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="edit-modal-body">
              {/* Previsualización de imagen */}
              <div className="image-upload-section">
                <label className="image-upload-label">Imagen del Producto</label>
                <div className="image-preview-container">
                  <img 
                    src={imagePreview || editingProduct.image} 
                    alt="Preview" 
                    className="image-preview"
                  />
                  <div className="image-upload-overlay">
                    <label htmlFor="image-upload" className="upload-btn">
                      <i className="bi bi-cloud-upload"></i>
                      <span>Subir Imagen</span>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Campos de edición */}
              <div className="edit-fields">
                <div className="form-group">
                  <label htmlFor="product-name">Nombre del Producto</label>
                  <input
                    id="product-name"
                    type="text"
                    placeholder="Nombre del producto"
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({
                      ...editingProduct,
                      name: e.target.value
                    })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="product-price">Precio ($)</label>
                    <input
                      id="product-price"
                      type="number"
                      placeholder="Precio"
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value)
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="product-stock">Stock (unidades)</label>
                    <input
                      id="product-stock"
                      type="number"
                      placeholder="Stock"
                      value={editingProduct.stock}
                      onChange={e => setEditingProduct({
                        ...editingProduct,
                        stock: Number(e.target.value)
                      })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="product-brand">Marca</label>
                  <input
                    id="product-brand"
                    type="text"
                    placeholder="Marca del producto"
                    value={editingProduct.brand}
                    onChange={e => setEditingProduct({
                      ...editingProduct,
                      brand: e.target.value
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => handleUpdate(editingProduct)} className="save-btn">
                <i className="bi bi-check-circle"></i> Guardar Cambios
              </button>
              <button onClick={() => {
                setEditingProduct(null);
                setImagePreview(null);
              }} className="cancel-btn">
                <i className="bi bi-x-circle"></i> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};