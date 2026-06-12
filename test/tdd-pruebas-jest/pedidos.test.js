// Pruebas - Pedidos
// Confirmar pedido y generar identificador de seguimiento

process.env.JWT_SECRET = "test-secret-key-jest";
process.env.NODE_ENV = "test";

const request = require("supertest");
const express = require("express");

// Mock de la base de datos
jest.mock("../../backend/models/db", () => ({
    promise: jest.fn(),
}));

const db = require("../../backend/models/db");
const pedidoRoutes = require("../../backend/routes/pedidoRoutes");

// Aplicación mínima para pruebas
const app = express();
app.use(express.json());
app.use("/api/pedidos", pedidoRoutes);

// Datos ficticios para las pruebas
const carritoMock = [
    {
        id: 1,
        nombre: "Café Americano",
        precio: 3.5,
        cantidad: 2,
        subtotal: 7,
    },
    {
        id: 2,
        nombre: "Sandwich Mixto",
        precio: 5,
        cantidad: 1,
        subtotal: 5,
    },
];

let connectionMock;
let getConnectionMock;

beforeEach(() => {
    jest.clearAllMocks();

    connectionMock = {
        beginTransaction: jest.fn().mockResolvedValue(),
        query: jest.fn(),
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
        release: jest.fn(),
    };

    getConnectionMock = jest
        .fn()
        .mockResolvedValue(connectionMock);

    db.promise.mockReturnValue({
        getConnection: getConnectionMock,
        query: jest.fn(),
    });
});

describe("POST /api/pedidos/cliente/nuevo - Confirmar pedido", () => {
    test("registra correctamente un pedido con datos válidos", async () => {
        connectionMock.query
            // INSERT en pedidos
            .mockResolvedValueOnce([
                {
                    insertId: 101,
                },
            ])
            // INSERT primer detalle
            .mockResolvedValueOnce([{}])
            // UPDATE stock primer producto
            .mockResolvedValueOnce([{}])
            // INSERT segundo detalle
            .mockResolvedValueOnce([{}])
            // UPDATE stock segundo producto
            .mockResolvedValueOnce([{}]);

        const res = await request(app)
            .post("/api/pedidos/cliente/nuevo")
            .send({
                usuarioId: 7,
                metodoPago: "efectivo",
                carrito: carritoMock,
                total: 12,
                fechaEntrega: "2026-06-12 18:00:00",
                socketId: null,
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe(
            "Pedido registrado correctamente."
        );
        expect(res.body.pedidoId).toBe(101);

        expect(connectionMock.beginTransaction).toHaveBeenCalledTimes(1);
        expect(connectionMock.commit).toHaveBeenCalledTimes(1);
        expect(connectionMock.rollback).not.toHaveBeenCalled();
        expect(connectionMock.release).toHaveBeenCalledTimes(1);
    });

    test("inicia una transacción antes de registrar el pedido", async () => {
        connectionMock.query
            .mockResolvedValueOnce([{ insertId: 102 }])
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{}]);

        await request(app)
            .post("/api/pedidos/cliente/nuevo")
            .send({
                usuarioId: 7,
                metodoPago: "tarjeta",
                carrito: carritoMock,
                total: 12,
                fechaEntrega: "2026-06-12 18:15:00",
                socketId: null,
            });

        expect(connectionMock.beginTransaction).toHaveBeenCalled();

        const ordenInicioTransaccion =
            connectionMock.beginTransaction.mock.invocationCallOrder[0];

        const ordenPrimerQuery =
            connectionMock.query.mock.invocationCallOrder[0];

        expect(ordenInicioTransaccion).toBeLessThan(
            ordenPrimerQuery
        );
    });

    test("registra cada producto en el detalle y actualiza su stock", async () => {
        connectionMock.query
            .mockResolvedValueOnce([{ insertId: 103 }])
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{}]);

        const res = await request(app)
            .post("/api/pedidos/cliente/nuevo")
            .send({
                usuarioId: 7,
                metodoPago: "efectivo",
                carrito: carritoMock,
                total: 12,
                fechaEntrega: "2026-06-12 18:30:00",
                socketId: null,
            });

        expect(res.status).toBe(201);

        // Una consulta para pedidos y dos consultas por cada producto:
        // INSERT pedido + (INSERT detalle + UPDATE stock) x 2
        expect(connectionMock.query).toHaveBeenCalledTimes(5);

        expect(connectionMock.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO detalle_pedido"),
            [103, 1, 2, 7]
        );

        expect(connectionMock.query).toHaveBeenCalledWith(
            expect.stringContaining("UPDATE productos"),
            [2, 1]
        );

        expect(connectionMock.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO detalle_pedido"),
            [103, 2, 1, 5]
        );

        expect(connectionMock.query).toHaveBeenCalledWith(
            expect.stringContaining("UPDATE productos"),
            [1, 2]
        );
    });

    test("devuelve el ID del pedido como número de seguimiento", async () => {
        connectionMock.query
            .mockResolvedValueOnce([{ insertId: 250 }])
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{}]);

        const res = await request(app)
            .post("/api/pedidos/cliente/nuevo")
            .send({
                usuarioId: 7,
                metodoPago: "billetera",
                carrito: [carritoMock[0]],
                total: 7,
                fechaEntrega: "2026-06-12 19:00:00",
                socketId: null,
            });

        expect(res.status).toBe(201);

        // En la implementación actual, pedidoId funciona
        // como identificador o número de seguimiento.
        expect(res.body.pedidoId).toBeDefined();
        expect(res.body.pedidoId).toBe(250);
        expect(typeof res.body.pedidoId).toBe("number");
    });

    test("rechaza la confirmación si el carrito está vacío", async () => {
        const res = await request(app)
            .post("/api/pedidos/cliente/nuevo")
            .send({
                usuarioId: 7,
                metodoPago: "efectivo",
                carrito: [],
                total: 0,
                fechaEntrega: "2026-06-12 19:15:00",
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "Datos incompletos para crear el pedido."
        );

        expect(getConnectionMock).not.toHaveBeenCalled();
    });

    test("rechaza la confirmación si falta el usuario", async () => {
        const res = await request(app)
            .post("/api/pedidos/cliente/nuevo")
            .send({
                metodoPago: "efectivo",
                carrito: carritoMock,
                total: 12,
                fechaEntrega: "2026-06-12 19:30:00",
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "Datos incompletos para crear el pedido."
        );
    });

    test("rechaza la confirmación si falta el método de pago", async () => {
        const res = await request(app)
            .post("/api/pedidos/cliente/nuevo")
            .send({
                usuarioId: 7,
                carrito: carritoMock,
                total: 12,
                fechaEntrega: "2026-06-12 19:45:00",
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "Datos incompletos para crear el pedido."
        );
    });

    test("rechaza la confirmación si falta la fecha de entrega", async () => {
        const res = await request(app)
            .post("/api/pedidos/cliente/nuevo")
            .send({
                usuarioId: 7,
                metodoPago: "efectivo",
                carrito: carritoMock,
                total: 12,
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
            "Datos incompletos para crear el pedido."
        );
    });

    test("confirma la transacción después de registrar todos los productos", async () => {
        connectionMock.query
            .mockResolvedValueOnce([{ insertId: 104 }])
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{}]);

        await request(app)
            .post("/api/pedidos/cliente/nuevo")
            .send({
                usuarioId: 7,
                metodoPago: "efectivo",
                carrito: carritoMock,
                total: 12,
                fechaEntrega: "2026-06-12 20:00:00",
                socketId: null,
            });

        expect(connectionMock.commit).toHaveBeenCalledTimes(1);

        const ultimaConsulta =
            connectionMock.query.mock.invocationCallOrder.at(-1);

        const ordenCommit =
            connectionMock.commit.mock.invocationCallOrder[0];

        expect(ordenCommit).toBeGreaterThan(ultimaConsulta);
    });

    test("realiza rollback si ocurre un error al registrar el pedido", async () => {
        connectionMock.query.mockRejectedValueOnce(
            new Error("Error simulado de base de datos")
        );

        const res = await request(app)
            .post("/api/pedidos/cliente/nuevo")
            .send({
                usuarioId: 7,
                metodoPago: "efectivo",
                carrito: carritoMock,
                total: 12,
                fechaEntrega: "2026-06-12 20:15:00",
                socketId: null,
            });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe(
            "Error al registrar el pedido."
        );

        expect(connectionMock.rollback).toHaveBeenCalledTimes(1);
        expect(connectionMock.commit).not.toHaveBeenCalled();
        expect(connectionMock.release).toHaveBeenCalledTimes(1);
    });
});
