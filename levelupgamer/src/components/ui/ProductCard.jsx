import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product, isAdmin = false, onToggleSelect, onEdit, onQuickEdit, onDelete, highlight = false, id }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return 'Precio no disponible';
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);
  };

  const renderStars = (rating) => {
    const r = Math.max(0, Math.min(5, rating || 0));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  };

  const calculateDiscount = () => {
    if (!product.oldPrice) return null;
    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  };

  const handleAddToCart = () => {
    addToCart({ id: product.id, nombre: product.name, precio: product.price, imagen: product.image, marca: product.brand });
  };

  const isOutOfStock = (product.stock || 0) === 0;
  const isLowStock = (product.stock || 0) > 0 && (product.stock || 0) <= 5;

  return (
    <div id={id} className={`product-card h-100 ${isOutOfStock ? 'out-of-stock' : ''} ${highlight ? 'highlighted' : ''}`}>
      <div className="product-card-header">
        <div className="d-flex justify-content-between w-100 align-items-start">
          <div className="brand-label">{product.brand}</div>
          <div className="d-flex align-items-center gap-2">
            {isAdmin && <input type="checkbox" className="form-check-input me-1" onChange={onToggleSelect} aria-label={`Seleccionar ${product.name}`} />}
            {calculateDiscount() && <div className="discount-badge">-{calculateDiscount()}%</div>}
          </div>
        </div>
      </div>

      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
          onError={(e) => { e.target.src = '/img/placeholder-product.svg'; }}
        />
      </div>

      <div className="product-info">
        <h5 className="product-title">{product.name}</h5>

        <div className="price-container">
          <div className="current-price">{formatPrice(product.price)}</div>
          {product.oldPrice && <div className="old-price">{formatPrice(product.oldPrice)}</div>}
        </div>

        <div className="rating-container">
          <span className="rating-stars">{renderStars(product.rating)}</span>
          <span className="rating-number">({product.rating || 0}/5)</span>
        </div>

        {isAdmin && (
          <div className="mt-2">
            {isOutOfStock ? (
              <div className="stock-badge out-of-stock-badge" role="status" aria-live="polite">AGOTADO</div>
            ) : isLowStock ? (
              <div className="stock-badge low-stock-badge" aria-live="polite">Stock: {product.stock} unidades</div>
            ) : (
              <div className="text-muted small">Stock: {product.stock || '—'}</div>
            )}
          </div>
        )}
      </div>

      {/* Floating quick edit icon (top-right) — keeps quick-edit modal behavior */}
      {isAdmin && (
        <button
          className="floating-quick-edit"
          title="Edición rápida"
          aria-label={`Edición rápida ${product.name}`}
          onClick={onQuickEdit}
        >
          <i className="bi bi-pencil-fill"></i>
        </button>
      )}

      <div className="product-card-footer d-flex gap-2 align-items-center mt-3">
        {!isAdmin ? (
          <button className="btn-add-cart w-100 btn btn-primary" onClick={handleAddToCart} aria-label={`Agregar ${product.name} al carrito`}>
            <i className="bi bi-cart-plus me-2"></i>Agregar al carrito
          </button>
        ) : (
          <div className="admin-footer-actions d-flex w-100 gap-2">
            <button
              className="btn btn-sm btn-edit btn-primary d-flex align-items-center justify-content-center"
              onClick={onEdit}
              aria-label={`Editar ${product.name}`}
            >
              <i className="bi bi-pencil-square me-2"></i>
              <span>Editar</span>
            </button>

            <button
              className="btn btn-sm btn-delete btn-danger d-flex align-items-center justify-content-center"
              onClick={onDelete}
              aria-label={`Eliminar ${product.name}`}
            >
              <i className="bi bi-trash-fill me-2"></i>
              <span>Eliminar</span>
            </button>
          </div>
        )}
      </div>

      {isAdmin && <div className="product-id small text-muted mt-2">ID: {product.id}</div>}
    </div>
  );
};

export default ProductCard;