import { useState } from 'react';
import api from '../api/apiClient';

const TestOrdersPage = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testGetOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/orders');
      console.log('Raw API Response:', res);
      console.log('Response data:', res.data);
      console.log('Data type:', typeof res.data);
      console.log('Is Array?:', Array.isArray(res.data));
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data,
        isArray: Array.isArray(res.data),
        dataType: typeof res.data,
        length: Array.isArray(res.data) ? res.data.length : 'N/A'
      });
    } catch (err) {
      console.error('API Error:', err);
      setError({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1>Test Orders API</h1>
      
      <button 
        className="btn btn-primary mb-4" 
        onClick={testGetOrders}
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Test GET /api/orders'}
      </button>

      {error && (
        <div className="alert alert-danger">
          <h4>Error:</h4>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      {response && (
        <div className="card">
          <div className="card-header">
            <h4>Respuesta de la API</h4>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <strong>Status:</strong> {response.status} {response.statusText}
            </div>
            <div className="mb-3">
              <strong>Es Array?:</strong> {response.isArray ? 'Sí' : 'No'}
            </div>
            <div className="mb-3">
              <strong>Tipo de dato:</strong> {response.dataType}
            </div>
            <div className="mb-3">
              <strong>Cantidad de órdenes:</strong> {response.length}
            </div>
            <div>
              <strong>Data completa:</strong>
              <pre style={{ maxHeight: '400px', overflow: 'auto' }}>
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestOrdersPage;
