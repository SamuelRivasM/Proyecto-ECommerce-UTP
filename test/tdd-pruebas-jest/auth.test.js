// Prueba - Autenticación (registro, login, validación de token)
process.env.JWT_SECRET = 'test-secret-key-jest';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock de la BD
jest.mock('../../backend/models/db', () => ({
  promise: jest.fn(),
  getConnection: jest.fn((cb) => cb && cb(null, { release: jest.fn() })),
}));

const db = require('../../backend/models/db');
const authRoutes = require('../../backend/routes/authRoutes');

// App mínima de prueba (sin Socket.IO ni server.listen)
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Hash de 'password123' generado una sola vez para todos los tests de login
let hashedPassword;

beforeAll(async () => {
  hashedPassword = await bcryptjs.hash('password123', 10);
});

beforeEach(() => {
  jest.clearAllMocks();
});

// REGISTRO
describe('POST /api/auth/register', () => {

  test('registro exitoso con datos válidos', async () => {
    const mockQuery = jest.fn()
      .mockResolvedValueOnce([[]])                  // SELECT → email libre
      .mockResolvedValueOnce([{ insertId: 1 }]);    // INSERT → nuevo usuario

    db.promise.mockReturnValue({ query: mockQuery });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Rodrigo Test',
        email: 'rodri@utp.edu.pe',
        telefono: '999888777',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Usuario registrado exitosamente');
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('rodri@utp.edu.pe');
    expect(res.body.user.rol).toBe('cliente');
  });

  test('falla si faltan campos obligatorios', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Rodrigo Test',
        email: 'rodri@utp.edu.pe',
        // falta telefono y password
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Todos los campos son obligatorios');
  });

  test('falla si el correo ya está registrado', async () => {
    const mockQuery = jest.fn()
      .mockResolvedValueOnce([[{ id: 1 }]]); // SELECT - email duplicado

    db.promise.mockReturnValue({ query: mockQuery });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Rodrigo Test',
        email: 'rodri@utp.edu.pe',
        telefono: '999888777',
        password: 'password123',
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('El correo ya está registrado');
  });
});

// LOGIN
describe('POST /api/auth/login', () => {

  test('login exitoso con credenciales válidas', async () => {
    const mockQuery = jest.fn()
      .mockResolvedValueOnce([[{          // SELECT usuario
        id: 1,
        nombre: 'Rodrigo Test',
        email: 'rodri@utp.edu.pe',
        password: hashedPassword,
        rol: 'cliente',
        estado: 1,
        session_version: 0,
      }]])
      .mockResolvedValueOnce([{}]);       // UPDATE ultimo_login

    db.promise.mockReturnValue({ query: mockQuery });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'rodri@utp.edu.pe', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('rodri@utp.edu.pe');
    expect(res.body.message).toContain('Bienvenido');
  });

  test('falla si el usuario no existe', async () => {
    const mockQuery = jest.fn()
      .mockResolvedValueOnce([[]]); // SELECT - sin resultados

    db.promise.mockReturnValue({ query: mockQuery });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@utp.edu.pe', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Credenciales inválidas');
  });

  test('falla con contraseña incorrecta', async () => {
    const mockQuery = jest.fn()
      .mockResolvedValueOnce([[{
        id: 1,
        nombre: 'Rodrigo Test',
        email: 'rodri@utp.edu.pe',
        password: hashedPassword,
        rol: 'cliente',
        estado: 1,
        session_version: 0,
      }]]);

    db.promise.mockReturnValue({ query: mockQuery });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'rodri@utp.edu.pe', password: 'contraseña_incorrecta' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Credenciales inválidas');
  });

  test('falla si el usuario está desactivado', async () => {
    const mockQuery = jest.fn()
      .mockResolvedValueOnce([[{
        id: 1,
        nombre: 'Rodrigo Test',
        email: 'rodri@utp.edu.pe',
        password: hashedPassword,
        rol: 'cliente',
        estado: 0, // desactivado
        session_version: 0,
      }]]);

    db.promise.mockReturnValue({ query: mockQuery });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'rodri@utp.edu.pe', password: 'password123' });

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Usuario desactivado');
  });
});

// VALIDACIÓN DE TOKEN - GET /api/auth/me
describe('GET /api/auth/me', () => {

  test('retorna sesión válida con token correcto', async () => {
    const token = jwt.sign(
      { id: 1, rol: 'cliente', nombre: 'Rodrigo Test', email: 'rodri@utp.edu.pe', sessionVersion: 0 },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const mockQuery = jest.fn()
      .mockResolvedValueOnce([[{ id: 1, estado: 1, session_version: 0 }]]); // middleware

    db.promise.mockReturnValue({ query: mockQuery });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Sesión válida');
    expect(res.body.user).toBeDefined();
  });

  test('falla si no se envía token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No autorizado');
  });

  test('falla con token inválido', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token-invalido-xyz');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token inválido');
  });
});
