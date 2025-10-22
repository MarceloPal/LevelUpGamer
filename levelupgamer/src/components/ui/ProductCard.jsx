import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Validar que el producto existe y tiene las propiedades necesarias
  if (!product || !product.id || !product.name) {
    return null;
  }

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return 'Precio no disponible';
    }
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const calculateDiscount = () => {
    if (!product.oldPrice) return null;
    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      nombre: product.name,
      precio: product.price,
      imagen: product.image,
      marca: product.brand
    });
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="product-card h-100">
        <div className="product-card-header">
          <div className="brand-label">{product.brand}</div>
          {calculateDiscount() && (
            <div className="discount-badge">-{calculateDiscount()}%</div>
          )}
        </div>
        
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-img"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/img/placeholder-product.svg';
            }}
          />
        </div>
        
        <div className="product-info">
          <h5 className="product-title">{product.name}</h5>
          
          <div className="price-container">
            <div className="current-price">{formatPrice(product.price)}</div>
            {product.oldPrice && (
              <div className="old-price">{formatPrice(product.oldPrice)}</div>
            )}
          </div>
          
          <div className="rating-container">
            <span className="rating-stars">{renderStars(product.rating)}</span>
            <span className="rating-number">({product.rating}/5)</span>
          </div>
        </div>
        
        <div className="product-card-footer">
          <button 
            className="btn-add-cart w-100"
            onClick={handleAddToCart}
          >
            <i className="bi bi-cart-plus me-2"></i>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;