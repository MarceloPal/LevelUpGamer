import axios from 'axios';

// La URL base (ej: http://localhost:3000/api) y el Tenant ID se leen de las variables de entorno
const api = axios.create({
    // VITE_API_URL debe ser, por ejemplo, http://localhost:3000/api
    baseURL: import.meta.env.VITE_API_URL, 
    headers: {
        'Content-Type': 'application/json',
        // Aseguramos que el x-tenant-id se envíe en todas las solicitudes
        'x-tenant-id': import.meta.env.VITE_TENANT_ID, 
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
        // Devolvemos response.data, que contiene el objeto { message, statusCode, data: {...} } de tu backend
        return response.data; 
    },
    (error) => {
        // Cuando hay un error (status 4xx o 5xx), devolvemos el cuerpo del error 
        // { message, statusCode, ...} para que el proveedor lo maneje.
        if (error.response) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    }
);

export default api;