import { useState } from 'react';
import ProductCard from '../components/ui/ProductCard';
import SearchBar from '../components/ui/SearchBar';
import { useProductSearch } from '../hooks/useProductSearch';
import { categories } from '../data/products';
import '../styles/App.css';

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

  const getCategoryTitle = () => {
    if (activeCategory === 'todo') return 'Todos los Productos';
    const category = categories.find(cat => cat.id === activeCategory);
    return category ? category.name : 'Productos';
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
        <div className="col-lg-9 col-md-8">
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
                <div className="section-header mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h2 className="section-title mb-0">
                      {getCategoryTitle()}
                    </h2>
                    <div className="view-options">
                      <small className="text-muted">
                        Mostrando {searchStats.totalProducts} producto{searchStats.totalProducts !== 1 ? 's' : ''}
                      </small>
                    </div>
                  </div>
                </div>

                <div className="products-grid">
                  <div className="row g-4">
                    {filteredProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                      />
                    ))}
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