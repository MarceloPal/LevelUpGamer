import { useEffect, useState } from 'react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const TestBackendPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testBackend = async () => {
      try {
        console.log('🔍 Probando conexión con backend...');
        
        // Test productos
        const productsResult = await productService.getAllProducts();
        console.log('📦 Productos:', productsResult);
        
        if (productsResult.success) {
          setProducts(productsResult.products);
        } else {
          setError(`Error productos: ${productsResult.message}`);
        }

        // Test categorías
        const categoriesResult = await categoryService.getAllCategories();
        console.log('📁 Categorías:', categoriesResult);
        
        if (categoriesResult.success) {
          setCategories(categoriesResult.categories);
        } else {
          setError(`Error categorías: ${categoriesResult.message}`);
        }

      } catch (err) {
        console.error('❌ Error:', err);
        setError(`Error de conexión: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    testBackend();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🧪 Test Backend Connection</h1>
      
      {loading && (
        <div>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Conectando con backend...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <h4>❌ Error</h4>
          <p>{error}</p>
          <hr />
          <p><strong>Verificar:</strong></p>
          <ul>
            <li>Backend funcionando correctamente</li>
            <li>CORS habilitado para tu dominio</li>
            <li>Variable VITE_API_URL configurada en Vercel</li>
            <li>URL del backend accesible desde internet</li>
          </ul>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="alert alert-success">
            ✅ Conexión exitosa con el backend!
          </div>

          <div className="row">
            <div className="col-md-6">
              <h3>📦 Productos ({products.length})</h3>
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                <pre>{JSON.stringify(products, null, 2)}</pre>
              </div>
            </div>

            <div className="col-md-6">
              <h3>📁 Categorías ({categories.length})</h3>
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                <pre>{JSON.stringify(categories, null, 2)}</pre>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TestBackendPage;
