const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  activeCategory, 
  onCategoryChange, 
  categories,
  productsCount,
  onSortChange,
  sortBy 
}) => {
  const sortOptions = [
    { value: 'name', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Valorado' }
  ];

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="search-sidebar-container">
      {/* Título del sidebar */}
      <div className="sidebar-header">
        <h5 className="sidebar-title">
          <i className="bi bi-funnel me-2"></i>
          Filtros y Búsqueda
        </h5>
        {/* Breadcrumb de navegación */}
        {activeCategory !== 'todo' && (
          <div className="breadcrumb-nav">
            <small className="text-muted">
              <i className="bi bi-house me-1"></i>
              Inicio › {categories.find(cat => cat.id === activeCategory)?.name || activeCategory}
            </small>
          </div>
        )}
      </div>

      {/* Barra de búsqueda */}
      <div className="search-section mb-4">
        <label className="form-label fw-semibold">
          <i className="bi bi-search me-2"></i>
          Buscar productos
        </label>
        <div className="input-group">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Buscar productos, marcas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="btn btn-outline-secondary"
              onClick={clearSearch}
              type="button"
              title="Limpiar búsqueda"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* Filtro por categorías */}
      <div className="categories-section mb-4">
        <label className="form-label fw-semibold">
          <i className="bi bi-tag me-2"></i>
          Categorías
        </label>
        <div className="category-filters-vertical">
          <button
            className={`btn btn-category-sidebar ${activeCategory === 'todo' ? 'active' : ''}`}
            onClick={() => onCategoryChange('todo')}
          >
            <span className="category-icon">🏪</span>
            <span className="category-text">Todos los productos</span>
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`btn btn-category-sidebar ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-text">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtro de ordenamiento */}
      <div className="sort-section mb-4">
        <label className="form-label fw-semibold">
          <i className="bi bi-sort-down me-2"></i>
          Ordenar por
        </label>
        <select 
          className="form-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Información de resultados */}
      <div className="results-section">
        <div className="results-info">
          <div className="results-count">
            <strong>{productsCount}</strong> producto{productsCount !== 1 ? 's' : ''} encontrado{productsCount !== 1 ? 's' : ''}
          </div>
          {searchTerm && (
            <div className="search-term-info">
              Para: "<em>{searchTerm}</em>"
            </div>
          )}
          {activeCategory !== 'todo' && (
            <div className="category-info">
              En: {categories.find(cat => cat.id === activeCategory)?.name}
            </div>
          )}
        </div>
        
        {(searchTerm || activeCategory !== 'todo') && (
          <button 
            className="btn btn-sm btn-outline-secondary w-100 mt-2"
            onClick={() => {
              onSearchChange('');
              onCategoryChange('todo');
            }}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;