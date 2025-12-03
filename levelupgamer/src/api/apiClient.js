import axios from 'axios';

// La URL base (ej: http://localhost:3000/api) se lee de las variables de entorno
// Si no se proporciona, usamos un fallback al backend desplegado para evitar errores en producción
const DEFAULT_API = 'https://ecommerce-backend-749990022458.us-central1.run.app/api';
const api = axios.create({
    // VITE_API_URL debe ser, por ejemplo, https://mi-backend/api
    baseURL: import.meta.env.VITE_API_URL || DEFAULT_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para inyectar el Token JWT en las solicitudes
api.interceptors.request.use(
    (config) => {
        // Usamos la clave 'lu_user' que usa tu AuthProvider para guardar el usuario
        const storedUser = localStorage.getItem('lu_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user?.token) {
                // Añadir el token a la cabecera Authorization
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar las respuestas y los errores
api.interceptors.response.use(
    (response) => {
        // Devolvemos la respuesta completa de Axios aquí (response)
        // Muchas partes del código existente (services/providers) esperan acceder a response.data
        return response;
    },
    (error) => {
        // Log del error para debugging
        console.error('API Error:', error);
        
        // Error de red o CORS
        if (!error.response) {
            console.error('Network Error - Posibles causas:');
            console.error('1. Backend no está corriendo en', import.meta.env.VITE_API_URL || DEFAULT_API);
            console.error('2. CORS no está configurado en el backend');
            console.error('3. Problema de conexión de red');
            // Rechazamos con el error original para que los handlers puedan inspeccionarlo
            return Promise.reject(error);
        }

        // Para errores HTTP (4xx/5xx) propagamos el error Axios completo.
        return Promise.reject(error);
    }
);

export default api;