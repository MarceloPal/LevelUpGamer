# Testing Guide - Level Up Gamer

## Configuración de Testing

Este proyecto utiliza **Jest** junto con **React Testing Library** para las pruebas unitarias y de integración.

## Instalación de Dependencias

Antes de ejecutar los tests, asegúrate de instalar todas las dependencias:

```bash
npm install
```

Las dependencias de testing incluidas son:
- `jest` - Framework de testing
- `@testing-library/react` - Utilidades para testing de componentes React
- `@testing-library/jest-dom` - Matchers personalizados para DOM
- `@testing-library/user-event` - Simulación de eventos de usuario
- `jest-environment-jsdom` - Entorno DOM para Jest

## Comandos Disponibles

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch (se re-ejecutan al hacer cambios)
```bash
npm run test:watch
```

### Ejecutar tests con reporte de cobertura
```bash
npm run test:coverage
```

## Estructura de Tests

Los tests están organizados en carpetas `__tests__` junto a los archivos que prueban:

```
src/
├── components/
│   └── ui/
│       └── __tests__/
│           └── ProductCard.test.jsx
├── hooks/
│   └── __tests__/
│       └── useProductSearch.test.js
└── services/
    └── __tests__/
        └── orderService.test.js
```

## Ejemplos de Tests

### 1. Test de Servicio (orderService.test.js)

Prueba las funciones del servicio de órdenes:
- `getAllOrders()` - Obtener todas las órdenes
- `getUserOrders()` - Obtener órdenes del usuario
- `trackOrder()` - Rastrear una orden por código
- `updateOrderStatus()` - Actualizar estado de orden
- `createOrder()` - Crear nueva orden

### 2. Test de Hook (useProductSearch.test.js)

Prueba el hook personalizado de búsqueda:
- Carga inicial de productos
- Filtrado por término de búsqueda
- Normalización de búsqueda (ignorar tildes)
- Ordenamiento de productos
- Limpieza de filtros
- Estadísticas de búsqueda

### 3. Test de Componente (ProductCard.test.jsx)

Prueba el componente de tarjeta de producto:
- Renderizado de información
- Mostrar/ocultar descuentos
- Agregar al carrito
- Manejo de productos sin stock
- Formato de precios

## Escribir Nuevos Tests

### Para un servicio:

```javascript
import myService from '../myService';
import api from '../../api/apiClient';

jest.mock('../../api/apiClient');

describe('myService', () => {
  it('debe hacer algo correctamente', async () => {
    api.get.mockResolvedValue({ data: { success: true } });
    
    const result = await myService.doSomething();
    
    expect(result.success).toBe(true);
  });
});
```

### Para un componente:

```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('debe renderizar correctamente', () => {
    render(<MyComponent />);
    
    expect(screen.getByText('Texto esperado')).toBeInTheDocument();
  });
  
  it('debe manejar clicks', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Cobertura de Código

El proyecto está configurado con umbrales mínimos de cobertura del 50% en:
- Branches (ramas)
- Functions (funciones)
- Lines (líneas)
- Statements (sentencias)

Puedes ver el reporte de cobertura ejecutando:

```bash
npm run test:coverage
```

Esto generará un reporte en la carpeta `coverage/` con detalles de qué partes del código están cubiertas por tests.

## Mejores Prácticas

1. **Describe lo que pruebas**: Usa nombres descriptivos para tus tests
2. **Arrange-Act-Assert**: Organiza tus tests en tres secciones claras
3. **Aísla las dependencias**: Usa mocks para servicios externos
4. **Prueba casos edge**: No solo el camino feliz
5. **Mantén los tests simples**: Un test debe probar una cosa
6. **Limpia después**: Usa `afterEach` para limpiar mocks y estado

## Troubleshooting

### Error: "Cannot find module"
Asegúrate de haber instalado todas las dependencias con `npm install`

### Tests fallan por CSS
Los archivos CSS son mockeados automáticamente con `identity-obj-proxy`

### Tests fallan por imágenes
Las imágenes son mockeadas con el archivo `__mocks__/fileMock.js`

### localStorage undefined
El setup ya incluye un mock de localStorage en `src/setupTests.js`

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library User Events](https://testing-library.com/docs/user-event/intro)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## Próximos Pasos

Para mejorar la cobertura de tests, considera agregar:

1. Tests para los componentes de páginas (HomePage, CatalogPage, etc.)
2. Tests para los providers (AuthProvider, CartProvider)
3. Tests de integración para flujos completos (login, compra, etc.)
4. Tests E2E con Cypress o Playwright
