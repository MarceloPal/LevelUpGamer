# LevelUp Gamer - E-commerce Frontend

E-commerce moderno para productos gaming desarrollado con React + Vite.

## 🚀 Características

### Funcionalidades Principales
- **Catálogo de Productos**: Navegación por categorías (consolas, accesorios, mouse, sillas gaming, etc.)
- **Sistema de Carrito**: Carrito de compras con sincronización al backend
- **Checkout Completo**: Proceso de compra con validación de dirección de envío
- **Gestión de Órdenes**: Panel de administración para gestión de pedidos
- **Sistema de Lealtad**: Programa de puntos y descuentos para clientes frecuentes
- **Autenticación**: Login/registro de usuarios con JWT
- **Perfil de Usuario**: Historial de compras y seguimiento de pedidos
- **Búsqueda de Productos**: Barra de búsqueda con filtros y sugerencias
- **Carousel de Marcas**: Navegación rápida a marcas destacadas

### Tecnologías
- **React 18** con Hooks
- **React Router v6** para navegación
- **Bootstrap 5** + Bootstrap Icons para UI
- **Axios** para peticiones HTTP
- **React Toastify** para notificaciones
- **Vite** como build tool

## 📋 Requisitos

- Node.js 16+
- NPM o Yarn
- Backend desplegado en Google Cloud Run

## 🛠️ Instalación

```bash
# Clonar repositorio
git clone <repository-url>

# Instalar dependencias
cd levelupgamer
npm install

# Configurar variables de entorno
# El backend está en: https://ecommerce-backend-749990022458.us-central1.run.app/api

# Iniciar servidor de desarrollo
npm run dev
```

## 🏗️ Estructura del Proyecto

```
src/
├── api/              # Cliente API (Axios)
├── assets/           # Recursos estáticos
├── components/       # Componentes reutilizables
│   ├── layout/       # Navbar, Footer
│   └── ui/           # ProductCard, SearchBar, Carousel, etc.
├── contexts/         # Context API (Auth, Cart, Loyalty)
├── hooks/            # Custom hooks
├── pages/            # Páginas principales
│   ├── HomePage.jsx
│   ├── CatalogPage.jsx
│   ├── CheckoutPage.jsx
│   ├── CartPage.jsx
│   ├── ProfilePage.jsx
│   └── AdminPage.jsx
├── services/         # Servicios API
│   ├── orderService.js
│   ├── productService.js
│   ├── cartService.js
│   └── userService.js
└── styles/           # CSS modules
```

## 🔌 Integración con Backend

### Endpoints Principales

**Productos**
- `GET /products` - Listar productos
- `GET /products/:id` - Obtener producto

**Carrito**
- `GET /cart` - Obtener carrito del usuario
- `POST /cart/items` - Agregar item
- `PUT /cart/items/:id` - Actualizar cantidad
- `DELETE /cart` - Vaciar carrito

**Órdenes**
- `POST /orders` - Crear orden desde carrito
- `GET /orders` - Órdenes del usuario
- `GET /orders/admin/all` - Todas las órdenes (admin)

**Usuario**
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrarse
- `GET /users/profile` - Perfil del usuario

### Estructura de Datos

**Orden**
```json
{
  "shipping": {
    "address": {
      "nombre": "Cliente",
      "direccion": "Calle 123",
      "comuna": "Santiago",
      "region": "Región Metropolitana",
      "codigoPostal": "1234567",
      "telefono": "+56912345678"
    }
  },
  "payment": {
    "method": "webpay"
  }
}
```

## 🎨 Componentes Destacados

### CheckoutPage
Proceso completo de checkout con:
- Validación de formulario de envío
- Sincronización de carrito con backend
- Integración con sistema de lealtad
- Redirección a perfil post-compra

### OrderManagement
Panel de administración con:
- Vista de todas las órdenes
- Cambio de estado (pending, processing, shipped, delivered, cancelled, confirmed)
- Modal de detalles completos
- Filtros por estado

### CartSidebar
Carrito lateral con:
- Vista rápida de productos
- Actualización de cantidades
- Cálculo de totales
- Navegación a checkout

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

## 📦 Build

```bash
# Generar build de producción
npm run build

# Preview del build
npm run preview
```

## 🔐 Autenticación

El sistema usa JWT almacenado en `localStorage`:
- Token se envía en header `Authorization: Bearer <token>`
- Auto-renovación de token en cada petición válida
- Redirección automática al login si el token expira

## 🎯 Características Futuras

- [ ] Integración con pasarela de pago real (WebPay)
- [ ] Notificaciones en tiempo real
- [ ] Chat de soporte
- [ ] Wishlist de productos
- [ ] Comparador de productos
- [ ] Reviews y ratings

## 📝 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

Desarrollado por el equipo de LevelUp Gamer
