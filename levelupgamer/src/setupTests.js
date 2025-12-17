import '@testing-library/jest-dom';
import { vi } from 'vitest';

// --- MOCK DE LOCALSTORAGE (Vital para Auth) ---
// Simulamos la memoria del navegador usando funciones espía de Vitest (vi.fn)
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);
// --- MOCK DE MATCHMEDIA (Vital para UI/Bootstrap) ---
// Evita errores cuando componentes intentan detectar el tamaño de pantalla
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecado
    removeListener: vi.fn(), // Deprecado
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});