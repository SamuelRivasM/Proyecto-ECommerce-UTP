// Pruebas - Catálogo (carga de productos y búsqueda por nombre)
process.env.JWT_SECRET = 'test-secret-key-jest';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const express = require('express');

// Mock de la BD
jest.mock('../../backend/models/db', () => ({
  promise: jest.fn(),
  getConnection: jest.fn((cb) => cb && cb(null, { release: jest.fn() })),
}));

// Mock de Cloudinary (importado en productoController)
jest.mock('../../backend/config/cloudinary', () => ({
  uploader: { upload: jest.fn() },
}));

const db = require('../../backend/models/db');
const productoRoutes = require('../../backend/routes/productoRoutes');

// App mínima de prueba
const app = express();
app.use(express.json());
app.use('/api/productos', productoRoutes);

// Datos ficticios reutilizados en todos los tests
const productosMock = [
  { id: 1, nombre: 'Café Americano', descripcion: 'Café negro intenso', precio: 3.5, imagen: null, stock: 10, categoria: 'Bebidas calientes' },
  { id: 2, nombre: 'Sandwich Mixto', descripcion: 'Con jamón y queso', precio: 5.0, imagen: null, stock: 5, categoria: 'Sandwiches' },
  { id: 3, nombre: 'Agua Mineral', descripcion: 'Sin gas, 500ml', precio: 2.0, imagen: null, stock: 20, categoria: 'Bebidas frías' },
];

beforeEach(() => jest.clearAllMocks());

// CARGA DE PRODUCTOS - GET /api/productos/cliente
describe('GET /api/productos/cliente - Carga del catálogo', () => {

  test('retorna la lista de productos disponibles', async () => {
    db.promise.mockReturnValue({
      query: jest.fn().mockResolvedValueOnce([productosMock]),
    });

    const res = await request(app).get('/api/productos/cliente');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(3);
  });

  test('cada producto tiene las propiedades requeridas', async () => {
    db.promise.mockReturnValue({
      query: jest.fn().mockResolvedValueOnce([productosMock]),
    });

    const res = await request(app).get('/api/productos/cliente');

    const producto = res.body[0];
    expect(producto).toHaveProperty('id');
    expect(producto).toHaveProperty('nombre');
    expect(producto).toHaveProperty('precio');
    expect(producto).toHaveProperty('stock');
    expect(producto).toHaveProperty('categoria');
  });

  test('retorna array vacío si no hay productos disponibles', async () => {
    db.promise.mockReturnValue({
      query: jest.fn().mockResolvedValueOnce([[]]),
    });

    const res = await request(app).get('/api/productos/cliente');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('retorna 500 si hay un error en la base de datos', async () => {
    db.promise.mockReturnValue({
      query: jest.fn().mockRejectedValueOnce(new Error('DB error')),
    });

    const res = await request(app).get('/api/productos/cliente');

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Error al obtener productos');
  });
});

// BÚSQUEDA POR NOMBRE (lógica del frontend)
const filtrarProductos = (productos, criterio, filtro) => {
  if (criterio === 'todos' || filtro.trim() === '') return productos;
  const valor = filtro.toLowerCase();
  return productos.filter((p) => {
    switch (criterio) {
      case 'nombre': return p.nombre.toLowerCase().includes(valor);
      case 'descripcion': return p.descripcion.toLowerCase().includes(valor);
      case 'precio': return p.precio.toString().includes(valor);
      case 'categoria': return p.categoria.toLowerCase().includes(valor);
      default: return true;
    }
  });
};

describe('Filtrado del catálogo - Búsqueda por nombre', () => {

  test('encuentra productos que coinciden con el nombre', () => {
    const resultado = filtrarProductos(productosMock, 'nombre', 'café');

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe('Café Americano');
  });

  test('la búsqueda no distingue entre mayúsculas y minúsculas', () => {
    const minuscula = filtrarProductos(productosMock, 'nombre', 'café');
    const mayuscula = filtrarProductos(productosMock, 'nombre', 'CAFÉ');

    expect(minuscula).toEqual(mayuscula);
  });

  test('retorna array vacío si ningún nombre coincide', () => {
    const resultado = filtrarProductos(productosMock, 'nombre', 'pizza');

    expect(resultado).toHaveLength(0);
  });

  test('retorna todos los productos si el filtro está vacío', () => {
    const resultado = filtrarProductos(productosMock, 'nombre', '');

    expect(resultado).toHaveLength(productosMock.length);
  });

  test('retorna todos los productos si el criterio es "todos"', () => {
    const resultado = filtrarProductos(productosMock, 'todos', 'café');

    expect(resultado).toHaveLength(productosMock.length);
  });

  test('filtra correctamente por coincidencia parcial en el nombre', () => {
    const resultado = filtrarProductos(productosMock, 'nombre', 'sandwich');

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nombre).toBe('Sandwich Mixto');
  });
});
