import { useState } from 'react';
import api from '../api/apiClient';

const DiagnosticPage = () => {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const testResults = {};

    // Test 1: Verificar conectividad básica con el backend
    console.log('=== TEST 1: Conectividad Básica ===');
    try {
      const response = await fetch('https://ecommerce-backend-749990022458.us-central1.run.app/api/products', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json().catch(() => null);
      
      testResults.basicConnectivity = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        errorData: !response.ok ? data : undefined
      };
      console.log('Test 1 Result:', testResults.basicConnectivity);
    } catch (error) {
      testResults.basicConnectivity = {
        success: false,
        error: error.message
      };
      console.error('Test 1 Error:', error);
    }

    // Test 2: Verificar con axios (como lo usa la app)
    console.log('=== TEST 2: Axios GET ===');
    try {
      const response = await api.get('/products');
      testResults.axiosGet = {
        success: true,
        status: response.status,
        dataReceived: !!response.data
      };
      console.log('Test 2 Result:', testResults.axiosGet);
    } catch (error) {
      testResults.axiosGet = {
        success: false,
        error: error.message,
        code: error.code,
        status: error.response?.status,
        errorData: error.response?.data
      };
      console.error('Test 2 Error:', error);
    }

    // Test 3: Verificar CORS con una petición real (no OPTIONS)
    console.log('=== TEST 3: CORS Test (Real Request) ===');
    try {
      // Intentar hacer una petición GET simple para verificar CORS
      const response = await fetch('https://ecommerce-backend-749990022458.us-central1.run.app/api/products?limit=1', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Si llegamos aquí sin error de CORS, está funcionando
      testResults.uploadOptions = {
        success: response.ok,
        status: response.status,
        corsWorking: true,
        message: 'CORS está funcionando correctamente (no hay error de red)'
      };
      console.log('Test 3 Result:', testResults.uploadOptions);
    } catch (error) {
      // Si hay error de CORS, será ERR_NETWORK o similar
      testResults.uploadOptions = {
        success: false,
        corsWorking: false,
        error: error.message,
        message: error.message.includes('CORS') || error.message.includes('Network') 
          ? 'Error de CORS detectado' 
          : 'Error desconocido'
      };
      console.error('Test 3 Error:', error);
    }

    // Test 4: Intentar subir un archivo de prueba pequeño
    console.log('=== TEST 4: Upload Test Image ===');
    try {
      // Crear una imagen de prueba (1x1 pixel PNG transparente)
      const blob = await fetch('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
        .then(r => r.blob());
      
      const formData = new FormData();
      formData.append('image', blob, 'test.png');

      const response = await api.post('/products/upload-image', formData);
      testResults.uploadTest = {
        success: true,
        status: response.status,
        data: response.data
      };
      console.log('Test 4 Result:', testResults.uploadTest);
    } catch (error) {
      testResults.uploadTest = {
        success: false,
        error: error.message,
        code: error.code,
        status: error.response?.status,
        responseData: error.response?.data
      };
      console.error('Test 4 Error:', error);
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">🔧 Diagnóstico de Conexión Backend</h1>
      
      <div className="alert alert-info">
        <strong>Backend URL:</strong> https://ecommerce-backend-749990022458.us-central1.run.app/api
      </div>

      <button 
        className="btn btn-primary btn-lg mb-4" 
        onClick={runTests}
        disabled={testing}
      >
        {testing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Ejecutando pruebas...
          </>
        ) : (
          '🧪 Ejecutar Diagnóstico'
        )}
      </button>

      {Object.keys(results).length > 0 && (
        <div className="row">
          {/* Test 1 */}
          <div className="col-md-6 mb-3">
            <div className={`card border-${results.basicConnectivity?.success ? 'success' : 'danger'}`}>
              <div className="card-header">
                <h5 className="mb-0">
                  {results.basicConnectivity?.success ? '✅' : '❌'} Test 1: Conectividad Básica
                </h5>
              </div>
              <div className="card-body">
                <pre className="mb-0" style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                  {JSON.stringify(results.basicConnectivity, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Test 2 */}
          <div className="col-md-6 mb-3">
            <div className={`card border-${results.axiosGet?.success ? 'success' : 'danger'}`}>
              <div className="card-header">
                <h5 className="mb-0">
                  {results.axiosGet?.success ? '✅' : '❌'} Test 2: Axios GET
                </h5>
              </div>
              <div className="card-body">
                <pre className="mb-0" style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                  {JSON.stringify(results.axiosGet, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Test 3 */}
          <div className="col-md-6 mb-3">
            <div className={`card border-${results.uploadOptions?.corsWorking ? 'success' : 'danger'}`}>
              <div className="card-header">
                <h5 className="mb-0">
                  {results.uploadOptions?.corsWorking ? '✅' : '❌'} Test 3: CORS Test
                </h5>
              </div>
              <div className="card-body">
                <pre className="mb-0" style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                  {JSON.stringify(results.uploadOptions, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Test 4 */}
          <div className="col-md-6 mb-3">
            <div className={`card border-${results.uploadTest?.success ? 'success' : 'danger'}`}>
              <div className="card-header">
                <h5 className="mb-0">
                  {results.uploadTest?.success ? '✅' : '❌'} Test 4: Subida de Imagen
                </h5>
              </div>
              <div className="card-body">
                <pre className="mb-0" style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                  {JSON.stringify(results.uploadTest, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {Object.keys(results).length > 0 && (
        <div className="alert alert-secondary mt-4">
          <h5>📋 Resumen</h5>
          <ul className="mb-0">
            <li>
              <strong>Conectividad básica:</strong>{' '}
              {results.basicConnectivity?.success ? '✅ OK' : '❌ Falla'}
            </li>
            <li>
              <strong>Axios funcional:</strong>{' '}
              {results.axiosGet?.success ? '✅ OK' : '❌ Falla'}
            </li>
            <li>
              <strong>CORS configurado:</strong>{' '}
              {results.uploadOptions?.corsWorking 
                ? '✅ OK' 
                : '❌ Falla'}
            </li>
            <li>
              <strong>Subida funcional:</strong>{' '}
              {results.uploadTest?.success ? '✅ OK' : '❌ Falla'}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiagnosticPage;
