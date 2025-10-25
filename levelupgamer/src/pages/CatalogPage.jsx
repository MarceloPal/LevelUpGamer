import { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/ui/SearchBar';
import { useProductSearch } from '../hooks/useProductSearch';
import { categories } from '../data/products';
import { useAuth } from '../contexts/AuthContext';
import '../styles/App.css';
import { toast } from 'react-toastify';

const CatalogPage = () => {
  const {
    searchTerm,
    activeCategory,
    sortBy,
    filteredProducts,
    searchStats,
    updateSearchTerm,
    updateActiveCategory,
    updateSortBy,
    clearAllFilters
  } = useProductSearch('todo');

  const [isLoading] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Admin-specific local state
  const [createdProducts, setCreatedProducts] = useState([]);
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ id: '', name: '', price: 0, stock: 0 });

  // Note: using react-toastify for global toasts

  // Quick edit
  const [quickEdit, setQuickEdit] = useState({ show: false, product: null });

  // Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState({ show: false, ids: [] });

  // Highlight newly created
  const [highlightId, setHighlightId] = useState(null);
  const highlightRef = useRef(null);

  // Merge filteredProducts with createdProducts (created at top), excluding deleted ids
  useEffect(() => {
    const createdIds = new Set(createdProducts.map(p => p.id));
    const merged = [
      ...createdProducts,
      ...filteredProducts.filter(p => !createdIds.has(p.id))
    ].filter(p => !deletedIds.has(p.id));

    // Client-side sorting for admin if sortBy is 'stock' or 'createdAt'
    let final = [...merged];
    if (sortBy === 'stock') {
      final.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    } else if (sortBy === 'createdAt') {
      final.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    setDisplayedProducts(final);
  }, [filteredProducts, createdProducts, deletedIds, sortBy]);

  // Scroll to highlighted product when created
  useEffect(() => {
    if (highlightId) {
      const el = document.getElementById(`product-${highlightId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // set ref for potential styling
        highlightRef.current = el;
        setTimeout(() => setHighlightId(null), 5000);
      }
    }
  }, [highlightId]);

  const getCategoryTitle = () => {
    if (activeCategory === 'todo') return 'Todos los Productos';
    const category = categories.find(cat => cat.id === activeCategory);
    return category ? category.name : 'Productos';
  };

  // Handlers
  const openCreateModal = () => {
    setNewProduct({ id: '', name: '', price: 0, stock: 0 });
    setShowCreateModal(true);
  };

  const handleSaveNewProduct = () => {
    const prod = {
      ...newProduct,
      id: newProduct.id || `tmp-${Date.now()}`,
      image: '/img/placeholder-product.svg',
      brand: 'Marca Nueva',
      rating: 5,
      createdAt: Date.now()
    };
    setCreatedProducts(prev => [prod, ...prev]);
    setShowCreateModal(false);
    toast.success('Producto creado con éxito');
    setHighlightId(prod.id);
  };

  const handleShowToast = (message, type = 'success') => {
    if (type === 'success') toast.success(message);
    else toast.error(message);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirmDelete = (ids) => {
    setConfirmDelete({ show: true, ids });
  };

  const performDelete = () => {
    const ids = confirmDelete.ids;
    setDeletedIds(prev => new Set([...Array.from(prev), ...ids]));
    setSelectedIds(prev => {
      const next = new Set(prev);
      ids.forEach(i => next.delete(i));
      return next;
    });
    setConfirmDelete({ show: false, ids: [] });
    handleShowToast('Producto(s) eliminado(s)', 'success');
  };

  const handleQuickEditSave = (updated) => {
    // update createdProducts if exists else update display state (simulation)
    setCreatedProducts(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));
    setQuickEdit({ show: false, product: null });
    handleShowToast('Cambios guardados', 'success');
  };

  return (
    <main className="container-fluid catalog-page">
      <div className="row g-0">
        {/* Sidebar izquierdo con SearchBar */}
        <div className="col-lg-3 col-md-4">
          <div className="search-sidebar">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={updateSearchTerm}
              activeCategory={activeCategory}
              onCategoryChange={updateActiveCategory}
              categories={categories}
              productsCount={searchStats.totalProducts}
              onSortChange={updateSortBy}
              sortBy={sortBy}
            />
          </div>
        </div>

  {/* Contenido principal del catálogo */}
  <div className="col-lg-9 col-md-8 catalog-main-col">
          <div className="catalog-content p-4">
            
            {/* Estado de carga */}
            {isLoading && (
              <div className="loading-container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3">Cargando productos...</p>
              </div>
            )}

            {/* Sin resultados */}
            {!isLoading && !searchStats.hasResults && (
              <div className="no-results-container text-center py-5">
                <div className="no-results-icon mb-3">
                  <i className="bi bi-search display-1 text-muted"></i>
                </div>
                <h3 className="no-results-title">No se encontraron productos</h3>
                <p className="no-results-text text-muted mb-4">
                  {searchStats.isSearching 
                    ? `No encontramos productos que coincidan con "${searchTerm}"`
                    : 'No hay productos disponibles en esta categoría'
                  }
                </p>
                {(searchStats.isSearching || searchStats.isFiltered) && (
                  <button 
                    className="btn btn-primary"
                    onClick={clearAllFilters}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Ver todos los productos
                  </button>
                )}
              </div>
            )}

            {/* Grid de productos */}
            {!isLoading && searchStats.hasResults && (
              <div className="products-section">
                {/* Admin title centered */}
                {isAdmin && (
                  <div className="text-center mb-4">
                    <h1 className="section-title mb-0">Gestor de Catálogo de Productos</h1>
                    <small className="text-muted d-block mt-1">
                      Mostrando {searchStats.totalProducts} producto{searchStats.totalProducts !== 1 ? 's' : ''}
                    </small>
                  </div>
                )}

                <div className="section-header mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {!isAdmin && (
                        <>
                          <h2 className="section-title mb-0">{getCategoryTitle()}</h2>
                          <small className="text-muted d-block mt-1">
                            Mostrando {searchStats.totalProducts} producto{searchStats.totalProducts !== 1 ? 's' : ''}
                          </small>
                        </>
                      )}
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      {isAdmin && (
                        <>
                          <div className="me-2">
                            <div className="btn-group">
                              <button className="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">Acciones Masivas</button>
                              <ul className="dropdown-menu dropdown-menu-end p-2">
                                <li>
                                  <button className="dropdown-item" onClick={() => handleConfirmDelete(Array.from(selectedIds))}>
                                    Eliminar seleccionados
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <button className="btn btn-success btn-sm" onClick={openCreateModal}>+ Agregar Nuevo Producto</button>
                        </>
                      )}

                      <div className="view-options">
                        <select className="form-select form-select-sm" value={sortBy} onChange={(e) => updateSortBy(e.target.value)}>
                          <option value="name">Orden: Nombre</option>
                          <option value="price-asc">Precio asc</option>
                          <option value="price-desc">Precio desc</option>
                          <option value="stock">Orden: Stock</option>
                          <option value="createdAt">Orden: Fecha de creación</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="products-grid">
                  <div className="row g-4 force-full-width">
                    {displayedProducts.map(product => (
                      <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <ProductCard
                          product={product}
                          isAdmin={isAdmin}
                          onToggleSelect={() => handleToggleSelect(product.id)}
                          onQuickEdit={() => setQuickEdit({ show: true, product })}
                          onEdit={() => navigate(`/admin?edit=${encodeURIComponent(product.id)}`)}
                          onDelete={() => handleConfirmDelete([product.id])}
                          highlight={highlightId === product.id}
                          id={`product-${product.id}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Create modal (Bootstrap) */}
            {isAdmin && showCreateModal && (
              <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">CREAR NUEVO PRODUCTO</h5>
                      <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-2">
                        <label className="form-label">ID</label>
                        <input className="form-control" value={newProduct.id} onChange={(e) => setNewProduct({...newProduct, id: e.target.value})} />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Título / Nombre</label>
                        <input className="form-control" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                      </div>
                      <div className="mb-2 row">
                        <div className="col-6">
                          <label className="form-label">Precio</label>
                          <input type="number" className="form-control" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                        </div>
                        <div className="col-6">
                          <label className="form-label">Stock</label>
                          <input type="number" className="form-control" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Subir Fotografía (simulado)</label>
                        <input type="file" className="form-control" disabled />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                      <button className="btn btn-primary" onClick={handleSaveNewProduct}>Guardar Producto</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* toasts are shown globally via react-toastify */}

            {/* Confirm delete modal */}
            {confirmDelete.show && (
              <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Confirmar eliminación</h5>
                    </div>
                    <div className="modal-body">
                      <p>¿Está seguro? Esta acción es irreversible.</p>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setConfirmDelete({ show: false, ids: [] })}>Cancelar</button>
                      <button className="btn btn-danger" onClick={performDelete}>Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick edit modal */}
            {quickEdit.show && (
              <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edición rápida</h5>
                      <button className="btn-close" onClick={() => setQuickEdit({ show: false, product: null })}></button>
                    </div>
                    <div className="modal-body">
                      <div className="mb-2">
                        <label className="form-label">Precio</label>
                        <input type="number" className="form-control" defaultValue={quickEdit.product?.price} onChange={(e) => setQuickEdit(s => ({ ...s, product: { ...s.product, price: Number(e.target.value) } }))} />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Stock</label>
                        <input type="number" className="form-control" defaultValue={quickEdit.product?.stock} onChange={(e) => setQuickEdit(s => ({ ...s, product: { ...s.product, stock: Number(e.target.value) } }))} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setQuickEdit({ show: false, product: null })}>Cancelar</button>
                      <button className="btn btn-primary" onClick={() => handleQuickEditSave(quickEdit.product)}>Guardar</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Paginación (para futuras implementaciones) */}
            {searchStats.hasResults && searchStats.totalProducts > 20 && (
              <div className="pagination-container d-flex justify-content-center mt-5">
                <nav aria-label="Navegación de productos">
                  <ul className="pagination">
                    <li className="page-item disabled">
                      <span className="page-link">Anterior</span>
                    </li>
                    <li className="page-item active">
                      <span className="page-link">1</span>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>2</a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#" onClick={(e) => e.preventDefault()}>Siguiente</a>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {/* Información adicional */}
            <div className="catalog-footer mt-5 pt-4 border-top">
              <div className="row">
                <div className="col-md-4 text-center mb-3">
                  <div className="info-card">
                    <i className="bi bi-truck display-6 text-primary mb-2"></i>
                    <h5>Envío Gratis</h5>
                    <p className="text-muted small">En compras sobre $50.000</p>
                  </div>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <div className="info-card">
                    <i className="bi bi-shield-check display-6 text-success mb-2"></i>
                    <h5>Garantía Oficial</h5>
                    <p className="text-muted small">En todos nuestros productos</p>
                  </div>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <div className="info-card">
                    <i className="bi bi-headset display-6 text-info mb-2"></i>
                    <h5>Soporte 24/7</h5>
                    <p className="text-muted small">Atención al cliente especializada</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default CatalogPage;