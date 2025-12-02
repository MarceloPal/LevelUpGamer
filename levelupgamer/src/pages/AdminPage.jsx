import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { getAllProducts } from '../data/products';
import productService from '../services/productService';
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    description: '',
    brand: '',
    category: 'accesorios',
    price: 0,
    oldPrice: 0,
    stock: 0,
    image: '/img/placeholder-product.svg'
  });

  // Cargar productos al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Intentar cargar productos desde el backend
        const catalogProducts = await getAllProducts();
        
        if (catalogProducts && catalogProducts.length > 0) {
          setProducts(catalogProducts);
        } else {
          console.warn('No se encontraron productos en el backend');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        toast.error('Error al cargar productos del backend');
        setProducts([]);
      }
    };

    // Verificar autenticación y permisos
    if (!user) {
      navigate('/ingresar');
      return;
    }

    if (user.role !== 'admin') {
      navigate('/');
      toast.error('No tienes permisos de administrador');
      return;
    }

    loadProducts();
  }, [user, navigate]);

  // Guardar productos - ya no usa localStorage, solo actualiza el estado
  const saveProducts = (updatedProducts) => {
    setProducts(updatedProducts);
  };

  // Recargar productos desde el backend
  const reloadProducts = async () => {
    try {
      const catalogProducts = await getAllProducts();
      if (catalogProducts && catalogProducts.length > 0) {
        setProducts(catalogProducts);
      }
    } catch (error) {
      console.error('Error al recargar productos:', error);
    }
  };

  // Crear nuevo producto
  const handleCreate = () => {
    // Resetear el formulario de nuevo producto
    setNewProduct({
      id: Date.now().toString(),
      name: '',
      description: '',
      brand: '',
      category: 'accesorios',
      price: 0,
      oldPrice: 0,
      stock: 0,
      image: '/img/placeholder-product.svg'
    });
    setImagePreview(null);
    setShowCreateModal(true);
  };

  const confirmCreate = async () => {
    // Validar campos obligatorios
    if (!newProduct.name.trim()) {
      toast.error('⚠️ El nombre del producto es obligatorio', {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      // Crear el producto en el backend
      const result = await productService.createProduct({
        productId: `SKU-${Date.now()}`, // Generar un SKU único
        name: newProduct.name,
        description: newProduct.description || 'Sin descripción',
        brand: newProduct.brand || 'Sin marca',
        price: Number(newProduct.price),
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : null,
        image: imagePreview || newProduct.image, // Usa la URL de Cloudinary si existe
        images: [imagePreview || newProduct.image],
        category: newProduct.category,
        stock: {
          current: Number(newProduct.stock),
          minLevel: 5,
          maxLevel: 100
        }
      });

      if (result.success) {
        toast.success('✅ Producto creado con éxito', {
          position: "top-right",
          autoClose: 3000,
        });
        
        // Recargar productos desde el backend
        await reloadProducts();
        setShowCreateModal(false);
        setImagePreview(null);
        setHighlightedProduct(result.product._id || result.product.id);
        setTimeout(() => setHighlightedProduct(null), 2000);
      } else {
        toast.error(`❌ ${result.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('❌ Error al crear el producto', {
        position: "top-right",
        autoClose: 3000,
      });
      console.error('Error:', error);
    }
  };

  // Actualizar producto
  const handleUpdate = async (updatedProduct) => {
    try {
      // Extraer el valor de stock correcto (puede ser número u objeto)
      const currentStock = typeof updatedProduct.stock === 'object' 
        ? updatedProduct.stock.current 
        : updatedProduct.stock;

      // Preparar datos actualizados con todos los campos requeridos
      const productData = {
        name: updatedProduct.name,
        description: updatedProduct.description || 'Sin descripción',
        brand: updatedProduct.brand || 'Sin marca',
        price: Number(updatedProduct.price),
        oldPrice: updatedProduct.oldPrice ? Number(updatedProduct.oldPrice) : null,
        category: updatedProduct.category || 'accesorios',
        stock: {
          current: Number(currentStock),
          minLevel: typeof updatedProduct.stock === 'object' ? updatedProduct.stock.minLevel : 5,
          maxLevel: typeof updatedProduct.stock === 'object' ? updatedProduct.stock.maxLevel : 100
        }
      };

      // Si hay imagen preview (nueva imagen de Cloudinary), incluirla
      if (imagePreview) {
        productData.image = imagePreview;
        productData.images = [imagePreview];
      }

      // Actualizar en el backend
      const result = await productService.updateProduct(updatedProduct._id || updatedProduct.id, productData);

      if (result.success) {
        toast.success('✅ Cambios guardados exitosamente', {
          position: "top-right",
          autoClose: 3000,
        });
        
        // Recargar productos desde el backend
        await reloadProducts();
        setEditingProduct(null);
        setImagePreview(null);
        
        // Destacar visualmente el producto editado
        setHighlightedProduct(result.product._id || result.product.id);
        setTimeout(() => setHighlightedProduct(null), 5000);
      } else {
        toast.error(`❌ ${result.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('❌ Error al actualizar el producto', {
        position: "top-right",
        autoClose: 3000,
      });
      console.error('Error:', error);
    }
  };

  // Manejar carga de imagen (simulada) para edición - SUBE A CLOUDINARY
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('❌ Por favor selecciona un archivo de imagen válido', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('❌ La imagen no debe superar los 5MB', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setUploadingImage(true);
    
    try {
      // Mostrar preview local mientras se sube
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Subir a Cloudinary
      toast.info('📤 Subiendo imagen a Cloudinary...', {
        position: "top-right",
        autoClose: 2000,
      });

      const result = await productService.uploadImage(file);

      if (result.success) {
        toast.success('✅ Imagen subida exitosamente', {
          position: "top-right",
          autoClose: 2000,
        });
        
        // Guardar la URL de Cloudinary
        setImagePreview(result.url);
      } else {
        toast.error(`❌ ${result.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast.error('❌ Error al subir la imagen', {
        position: "top-right",
        autoClose: 3000,
      });
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  // Manejar carga de imagen para creación - SUBE A CLOUDINARY
  const handleCreateImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('❌ Por favor selecciona un archivo de imagen válido', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('❌ La imagen no debe superar los 5MB', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setUploadingImage(true);
    
    try {
      // Mostrar preview local mientras se sube
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Subir a Cloudinary
      toast.info('📤 Subiendo imagen a Cloudinary...', {
        position: "top-right",
        autoClose: 2000,
      });

      const result = await productService.uploadImage(file);

      if (result.success) {
        toast.success('✅ Imagen subida exitosamente', {
          position: "top-right",
          autoClose: 2000,
        });
        
        // Guardar la URL de Cloudinary
        setImagePreview(result.url);
        setNewProduct({
          ...newProduct,
          image: result.url
        });
      } else {
        toast.error(`❌ ${result.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      toast.error('❌ Error al subir la imagen', {
        position: "top-right",
        autoClose: 3000,
      });
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  // Solicitar confirmación para eliminar
  const requestDelete = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  // Eliminar producto confirmado
  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const result = await productService.deleteProduct(productToDelete);
        
        if (result.success) {
          toast.success('🗑️ Producto eliminado', {
            position: "top-right",
            autoClose: 3000,
          });
          
          // Recargar productos desde el backend
          await reloadProducts();
        } else {
          toast.error(`❌ ${result.message}`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error('❌ Error al eliminar el producto', {
          position: "top-right",
          autoClose: 3000,
        });
        console.error('Error:', error);
      }
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
      setSelectedProducts(products.map(p => p._id || p.id));
    }
  };

  // Acciones masivas
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.warning('⚠️ Seleccione al menos un producto', {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    
    const confirmed = window.confirm(`¿Está seguro de eliminar ${selectedProducts.length} productos seleccionados? Esta acción es irreversible.`);
    
    if (confirmed) {
      const toastId = toast.info(`🔄 Eliminando ${selectedProducts.length} productos...`, {
        position: "top-right",
        autoClose: false,
      });

      try {
        // Eliminar todos los productos seleccionados del backend
        const deletePromises = selectedProducts.map(productId => 
          productService.deleteProduct(productId)
        );
        
        const results = await Promise.all(deletePromises);
        
        // Verificar cuántos se eliminaron exitosamente
        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;

        toast.dismiss(toastId);

        if (failCount === 0) {
          toast.success(`✅ ${successCount} productos eliminados exitosamente`, {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.warning(`⚠️ ${successCount} eliminados, ${failCount} fallaron`, {
            position: "top-right",
            autoClose: 4000,
          });
        }

        // Recargar productos desde el backend
        await reloadProducts();
        setSelectedProducts([]);

      } catch (error) {
        toast.dismiss(toastId);
        toast.error('❌ Error al eliminar productos', {
          position: "top-right",
          autoClose: 3000,
        });
        console.error('Error:', error);
      }
    }
  };

  // Filtrado y ordenamiento
  const getSortedAndFilteredProducts = () => {
    let filtered = [...products];

    // Filtrar por stock (maneja tanto número como objeto)
    if (filterStock === 'available') {
      filtered = filtered.filter(p => {
        const currentStock = typeof p.stock === 'object' ? p.stock.current : p.stock;
        return currentStock > 0;
      });
    } else if (filterStock === 'outofstock') {
      filtered = filtered.filter(p => {
        const currentStock = typeof p.stock === 'object' ? p.stock.current : p.stock;
        return currentStock === 0;
      });
    }

    // Si hay un producto destacado, mantenerlo al inicio
    if (highlightedProduct) {
      const highlightedIndex = filtered.findIndex(p => (p._id || p.id) === highlightedProduct);
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
        case 'stock': {
          const stockA = typeof a.stock === 'object' ? a.stock.current : a.stock;
          const stockB = typeof b.stock === 'object' ? b.stock.current : b.stock;
          return stockB - stockA;
        }
        case 'date':
          // ID más reciente primero (usa _id o id como fallback)
          return (b._id || b.id) - (a._id || a.id);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const displayProducts = getSortedAndFilteredProducts();

  return (
    <div className="admin-container">
      {/* Indicador de rol en barra superior */}
      <div className="admin-role-bar">
        <span className="admin-role-badge">MODO ADMIN</span>
        <button onClick={() => navigate('/')} className="back-to-home-btn" title="Volver al inicio">
          <i className="bi bi-house-door"></i> Volver al Inicio
        </button>
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
        {displayProducts.map(product => {
          const productId = product._id || product.id;
          return (
          <div 
            key={productId}
            data-product-id={productId}
            className={`product-card ${product.stock === 0 ? 'out-of-stock' : ''} ${highlightedProduct === productId ? 'highlighted' : ''}`}
          >
            {/* Checkbox de selección */}
            <div className="product-checkbox">
              <input 
                type="checkbox"
                checked={selectedProducts.includes(productId)}
                onChange={() => toggleSelectProduct(productId)}
              />
            </div>

            {/* ID del producto */}
            <div className="product-id">ID: {productId.substring(0, 8)}...</div>

            {/* Badge de estado */}
            {(() => {
              const currentStock = typeof product.stock === 'object' ? product.stock.current : product.stock;
              if (currentStock === 0) {
                return <div className="stock-badge out-of-stock-badge">Agotado</div>;
              }
              if (currentStock > 0 && currentStock <= 5) {
                return <div className="stock-badge low-stock-badge">Stock Bajo</div>;
              }
              return null;
            })()}

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
              <p className={`product-stock ${(typeof product.stock === 'object' ? product.stock.current : product.stock) === 0 ? 'no-stock' : ''}`}>
                Stock: {typeof product.stock === 'object' ? product.stock.current : product.stock} unidades
              </p>
              <div className="actions">
                <button onClick={() => setEditingProduct(product)} className="edit-btn">
                  <i className="bi bi-pencil-square"></i> Editar
                </button>
                <button onClick={() => requestDelete(productId)} className="delete-btn">
                  <i className="bi bi-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        )})}
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
                    style={{ opacity: uploadingImage ? 0.5 : 1 }}
                  />
                  {uploadingImage ? (
                    <div className="image-upload-overlay">
                      <div className="upload-loading">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Subiendo...</span>
                        </div>
                        <span className="mt-2">Subiendo a Cloudinary...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="image-upload-overlay">
                      <label htmlFor="create-image-upload" className="upload-btn">
                        <i className="bi bi-cloud-upload"></i>
                        <span>Subir a Cloudinary</span>
                      </label>
                      <input
                        id="create-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleCreateImageUpload}
                        style={{ display: 'none' }}
                        disabled={uploadingImage}
                      />
                    </div>
                  )}
                </div>
                {imagePreview && imagePreview.startsWith('http') && (
                  <small className="text-success">✅ Imagen subida a Cloudinary</small>
                )}
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

                <div className="form-group">
                  <label htmlFor="new-product-description">Descripción</label>
                  <textarea
                    id="new-product-description"
                    placeholder="Descripción del producto"
                    value={newProduct.description}
                    onChange={e => setNewProduct({
                      ...newProduct,
                      description: e.target.value
                    })}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="new-product-brand">Marca</label>
                    <input
                      id="new-product-brand"
                      type="text"
                      placeholder="Ej: Logitech"
                      value={newProduct.brand}
                      onChange={e => setNewProduct({
                        ...newProduct,
                        brand: e.target.value
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="new-product-category">Categoría</label>
                    <select
                      id="new-product-category"
                      value={newProduct.category}
                      onChange={e => setNewProduct({
                        ...newProduct,
                        category: e.target.value
                      })}
                    >
                      <option value="accesorios">Accesorios</option>
                      <option value="computadores">Computadores</option>
                      <option value="consolas">Consolas</option>
                      <option value="juegos_mesa">Juegos de Mesa</option>
                      <option value="mouse">Mouse</option>
                      <option value="mousepad">Mousepad</option>
                      <option value="poleras">Poleras</option>
                      <option value="polerones">Polerones</option>
                      <option value="sillas">Sillas</option>
                    </select>
                  </div>
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
                    <label htmlFor="new-product-old-price">Precio Anterior ($)</label>
                    <input
                      id="new-product-old-price"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={newProduct.oldPrice}
                      onChange={e => setNewProduct({
                        ...newProduct,
                        oldPrice: e.target.value
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
                    style={{ opacity: uploadingImage ? 0.5 : 1 }}
                  />
                  {uploadingImage ? (
                    <div className="image-upload-overlay">
                      <div className="upload-loading">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Subiendo...</span>
                        </div>
                        <span className="mt-2">Subiendo a Cloudinary...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="image-upload-overlay">
                      <label htmlFor="image-upload" className="upload-btn">
                        <i className="bi bi-cloud-upload"></i>
                        <span>Subir a Cloudinary</span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        disabled={uploadingImage}
                      />
                    </div>
                  )}
                </div>
                {imagePreview && imagePreview.startsWith('http') && (
                  <small className="text-success">✅ Imagen subida a Cloudinary</small>
                )}
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

                <div className="form-group">
                  <label htmlFor="product-description">Descripción</label>
                  <textarea
                    id="product-description"
                    placeholder="Descripción del producto"
                    value={editingProduct.description || ''}
                    onChange={e => setEditingProduct({
                      ...editingProduct,
                      description: e.target.value
                    })}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="product-brand">Marca</label>
                    <input
                      id="product-brand"
                      type="text"
                      placeholder="Marca del producto"
                      value={editingProduct.brand || ''}
                      onChange={e => setEditingProduct({
                        ...editingProduct,
                        brand: e.target.value
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="product-category">Categoría</label>
                    <select
                      id="product-category"
                      value={editingProduct.category || 'accesorios'}
                      onChange={e => setEditingProduct({
                        ...editingProduct,
                        category: e.target.value
                      })}
                    >
                      <option value="accesorios">Accesorios</option>
                      <option value="computadores">Computadores</option>
                      <option value="consolas">Consolas</option>
                      <option value="juegos_mesa">Juegos de Mesa</option>
                      <option value="mouse">Mouse</option>
                      <option value="mousepad">Mousepad</option>
                      <option value="poleras">Poleras</option>
                      <option value="polerones">Polerones</option>
                      <option value="sillas">Sillas</option>
                    </select>
                  </div>
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
                    <label htmlFor="product-old-price">Precio Anterior ($)</label>
                    <input
                      id="product-old-price"
                      type="number"
                      placeholder="Precio anterior"
                      value={editingProduct.oldPrice || ''}
                      onChange={e => setEditingProduct({
                        ...editingProduct,
                        oldPrice: e.target.value ? Number(e.target.value) : null
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="product-stock">Stock (unidades)</label>
                    <input
                      id="product-stock"
                      type="number"
                      placeholder="Stock"
                      value={typeof editingProduct.stock === 'object' ? editingProduct.stock.current : editingProduct.stock}
                      onChange={e => setEditingProduct({
                        ...editingProduct,
                        stock: Number(e.target.value)
                      })}
                    />
                  </div>
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