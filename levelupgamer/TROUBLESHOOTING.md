# 🔧 Solución de Problemas - Frontend no muestra productos

## Estado Actual
✅ Frontend corriendo en: http://localhost:5173/
❓ Backend debe estar en: http://localhost:3000/

## Pasos para Solucionar

### 1️⃣ Verificar que el Backend esté corriendo

**Abrir una terminal en la carpeta del backend y ejecutar:**
```bash
npm run dev
# o
npm start
```

**Deberías ver algo como:**
```
✅ MongoDB conectado: ecommerce
🚀 Servidor corriendo en puerto 3000
```

### 2️⃣ Verificar la Base de Datos

**El backend necesita datos en MongoDB:**

1. Asegúrate de tener productos en la base de datos
2. Asegúrate de tener categorías en la base de datos

**Puedes verificar esto en MongoDB Atlas:**
- Ve a: https://cloud.mongodb.com/
- Selecciona tu cluster
- Click en "Browse Collections"
- Verifica que existan colecciones: `products` y `categories`

### 3️⃣ Crear Datos de Prueba

**Si no tienes datos, usa Postman o Thunder Client para crear:**

**A) Crear una Categoría:**
```
POST http://localhost:3000/api/categories
Content-Type: application/json
Authorization: Bearer TU_TOKEN_ADMIN

{
  "name": "Accesorios",
  "slug": "accesorios",
  "description": "Accesorios gaming",
  "icon": "gamepad"
}
```

**B) Crear un Producto:**
```
POST http://localhost:3000/api/products
Content-Type: application/json
Authorization: Bearer TU_TOKEN_ADMIN

{
  "productId": "PROD-001",
  "name": "Mouse Gaming RGB",
  "description": "Mouse gaming con iluminación RGB",
  "brand": "Logitech",
  "price": 29990,
  "oldPrice": 39990,
  "image": "https://via.placeholder.com/400",
  "category": "accesorios",
  "stock": {
    "current": 50,
    "minLevel": 5
  }
}
```

### 4️⃣ Verificar CORS

**El backend debe tener CORS habilitado. Verifica que en tu backend exista:**

```javascript
// En tu archivo principal del backend (index.js o app.js)
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // URL de tu frontend
  credentials: true
}));
```

### 5️⃣ Probar la Conexión

**Ve a estas URLs para verificar:**

1. http://localhost:5173/test-backend - Página de test del frontend
2. http://localhost:3000/api/products - Debe devolver JSON con productos
3. http://localhost:3000/api/categories - Debe devolver JSON con categorías

### 6️⃣ Ver Errores en la Consola

**Abre las Developer Tools (F12) en el navegador y revisa:**

1. Pestaña **Console** - Busca errores de CORS o conexión
2. Pestaña **Network** - Mira las peticiones a `/api/products` y `/api/categories`

**Errores comunes:**

- `ERR_CONNECTION_REFUSED` → Backend no está corriendo
- `CORS error` → CORS no está configurado en el backend
- `404 Not Found` → La ruta no existe en el backend
- `401 Unauthorized` → Necesitas autenticación (solo para crear/editar)

## 🎯 Checklist Rápido

- [ ] Backend corriendo en puerto 3000
- [ ] MongoDB conectado
- [ ] Hay categorías en la base de datos
- [ ] Hay productos en la base de datos
- [ ] CORS habilitado en el backend
- [ ] .env del frontend tiene VITE_API_URL=http://localhost:3000/api
- [ ] Reiniciaste el frontend después de crear .env

## 🔄 Reiniciar Todo

Si nada funciona, reinicia todo:

**Backend:**
```bash
# En la terminal del backend
Ctrl+C (para detener)
npm run dev (para reiniciar)
```

**Frontend:**
```bash
# En la terminal del frontend
Ctrl+C (para detener)
npm run dev (para reiniciar)
```

## 📞 Estado de la API

Para verificar el estado del backend, ejecuta en otra terminal:

```powershell
curl http://localhost:3000/api/products
```

Si funciona, deberías ver JSON con productos. Si no, el backend no está respondiendo.
