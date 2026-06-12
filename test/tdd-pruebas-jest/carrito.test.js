// Pruebas - Carrito
// Agregar producto, modificar cantidad, eliminar y recalcular total

process.env.NODE_ENV = "test";

// Productos ficticios
const cafeMock = {
    id: 1,
    nombre: "Café Americano",
    descripcion: "Café negro intenso",
    precio: 3.5,
    imagen: null,
};

const sandwichMock = {
    id: 2,
    nombre: "Sandwich Mixto",
    descripcion: "Con jamón y queso",
    precio: 5.0,
    imagen: null,
};

// ======================================================
// FUNCIONES BASADAS EN LA LÓGICA DE ClienteCarrito.jsx
// ======================================================

// Agregar un producto al carrito
const agregarProducto = (carrito, producto) => {
    if (!producto) {
        return {
            carrito,
            agregado: false,
            mensaje: "Producto no encontrado.",
        };
    }

    const productoExistente = carrito.some(
        (item) => Number(item.id) === Number(producto.id)
    );

    if (productoExistente) {
        return {
            carrito,
            agregado: false,
            mensaje: "El producto ya está en el carrito.",
        };
    }

    const nuevoItem = {
        numero: carrito.length + 1,
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: Number(producto.precio),
        cantidad: 1,
        subtotal: Number(producto.precio),
        imagen: producto.imagen,
    };

    return {
        carrito: [...carrito, nuevoItem],
        agregado: true,
        mensaje: "Producto agregado al carrito correctamente.",
    };
};

// Modificar cantidad
const actualizarCantidad = (carrito, id, delta) => {
    return carrito.map((item) => {
        if (Number(item.id) !== Number(id)) {
            return item;
        }

        const nuevaCantidad = Math.max(1, item.cantidad + delta);

        return {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item.precio,
        };
    });
};

// Eliminar producto
const eliminarProducto = (carrito, id) => {
    const productoExiste = carrito.some(
        (item) => Number(item.id) === Number(id)
    );

    if (!productoExiste) {
        return {
            carrito,
            eliminado: false,
            mensaje: "El producto indicado no existe en el carrito.",
        };
    }

    const nuevoCarrito = carrito
        .filter((item) => Number(item.id) !== Number(id))
        .map((item, index) => ({
            ...item,
            numero: index + 1,
        }));

    return {
        carrito: nuevoCarrito,
        eliminado: true,
        mensaje: "Producto eliminado del carrito.",
    };
};

// Calcular total
const calcularTotal = (carrito) => {
    return carrito
        .reduce(
            (acumulado, item) =>
                acumulado + Number.parseFloat(item.subtotal || 0),
            0
        )
        .toFixed(2);
};

describe("Carrito - Agregar producto", () => {
    test("agrega correctamente un producto a un carrito vacío", () => {
        const resultado = agregarProducto([], cafeMock);

        expect(resultado.agregado).toBe(true);
        expect(resultado.carrito).toHaveLength(1);
        expect(resultado.carrito[0].id).toBe(1);
        expect(resultado.carrito[0].cantidad).toBe(1);
        expect(resultado.carrito[0].subtotal).toBe(3.5);
        expect(resultado.carrito[0].numero).toBe(1);
    });

    test("agrega un segundo producto y actualiza la numeración", () => {
        const primerResultado = agregarProducto([], cafeMock);
        const segundoResultado = agregarProducto(
            primerResultado.carrito,
            sandwichMock
        );

        expect(segundoResultado.carrito).toHaveLength(2);
        expect(segundoResultado.carrito[0].numero).toBe(1);
        expect(segundoResultado.carrito[1].numero).toBe(2);
    });

    test("impide agregar dos veces el mismo producto", () => {
        const primerResultado = agregarProducto([], cafeMock);
        const segundoResultado = agregarProducto(
            primerResultado.carrito,
            cafeMock
        );

        expect(segundoResultado.agregado).toBe(false);
        expect(segundoResultado.carrito).toHaveLength(1);
        expect(segundoResultado.mensaje).toBe(
            "El producto ya está en el carrito."
        );
    });

    test("controla el intento de agregar un producto inexistente", () => {
        const resultado = agregarProducto([], null);

        expect(resultado.agregado).toBe(false);
        expect(resultado.carrito).toEqual([]);
        expect(resultado.mensaje).toBe("Producto no encontrado.");
    });
});

describe("Carrito - Modificar cantidad", () => {
    test("incrementa la cantidad y recalcula el subtotal", () => {
        const carritoInicial = agregarProducto([], cafeMock).carrito;

        const carritoActualizado = actualizarCantidad(
            carritoInicial,
            cafeMock.id,
            1
        );

        expect(carritoActualizado[0].cantidad).toBe(2);
        expect(carritoActualizado[0].subtotal).toBe(7);
    });

    test("disminuye la cantidad y recalcula el subtotal", () => {
        let carrito = agregarProducto([], cafeMock).carrito;

        carrito = actualizarCantidad(carrito, cafeMock.id, 2);
        carrito = actualizarCantidad(carrito, cafeMock.id, -1);

        expect(carrito[0].cantidad).toBe(2);
        expect(carrito[0].subtotal).toBe(7);
    });

    test("no permite que la cantidad sea menor que uno", () => {
        const carritoInicial = agregarProducto([], cafeMock).carrito;

        const carritoActualizado = actualizarCantidad(
            carritoInicial,
            cafeMock.id,
            -10
        );

        expect(carritoActualizado[0].cantidad).toBe(1);
        expect(carritoActualizado[0].subtotal).toBe(3.5);
    });

    test("conserva el carrito si el ID no existe", () => {
        const carritoInicial = agregarProducto([], cafeMock).carrito;

        const carritoActualizado = actualizarCantidad(
            carritoInicial,
            999,
            1
        );

        expect(carritoActualizado).toEqual(carritoInicial);
    });
});

describe("Carrito - Eliminar producto", () => {
    test("elimina correctamente un producto", () => {
        let carrito = agregarProducto([], cafeMock).carrito;
        carrito = agregarProducto(carrito, sandwichMock).carrito;

        const resultado = eliminarProducto(carrito, cafeMock.id);

        expect(resultado.eliminado).toBe(true);
        expect(resultado.carrito).toHaveLength(1);
        expect(resultado.carrito[0].id).toBe(sandwichMock.id);
    });

    test("reorganiza la numeración después de eliminar", () => {
        let carrito = agregarProducto([], cafeMock).carrito;
        carrito = agregarProducto(carrito, sandwichMock).carrito;

        const resultado = eliminarProducto(carrito, cafeMock.id);

        expect(resultado.carrito[0].numero).toBe(1);
    });

    test("controla la eliminación de un ID inexistente", () => {
        const carritoInicial = agregarProducto([], cafeMock).carrito;

        const resultado = eliminarProducto(carritoInicial, 999);

        expect(resultado.eliminado).toBe(false);
        expect(resultado.carrito).toEqual(carritoInicial);
        expect(resultado.mensaje).toBe(
            "El producto indicado no existe en el carrito."
        );
    });

    test("devuelve un carrito vacío al eliminar el último producto", () => {
        const carritoInicial = agregarProducto([], cafeMock).carrito;

        const resultado = eliminarProducto(
            carritoInicial,
            cafeMock.id
        );

        expect(resultado.eliminado).toBe(true);
        expect(resultado.carrito).toEqual([]);
    });
});

describe("Carrito - Recalcular total", () => {
    test("calcula correctamente el total de varios productos", () => {
        let carrito = agregarProducto([], cafeMock).carrito;
        carrito = agregarProducto(carrito, sandwichMock).carrito;

        const total = calcularTotal(carrito);

        expect(total).toBe("8.50");
    });

    test("actualiza el total al aumentar una cantidad", () => {
        let carrito = agregarProducto([], cafeMock).carrito;
        carrito = agregarProducto(carrito, sandwichMock).carrito;

        carrito = actualizarCantidad(carrito, cafeMock.id, 1);

        const total = calcularTotal(carrito);

        // 2 cafés: 7.00 + sandwich: 5.00
        expect(total).toBe("12.00");
    });

    test("actualiza el total después de eliminar un producto", () => {
        let carrito = agregarProducto([], cafeMock).carrito;
        carrito = agregarProducto(carrito, sandwichMock).carrito;

        const resultadoEliminacion = eliminarProducto(
            carrito,
            cafeMock.id
        );

        const total = calcularTotal(resultadoEliminacion.carrito);

        expect(total).toBe("5.00");
    });

    test("retorna 0.00 cuando el carrito está vacío", () => {
        expect(calcularTotal([])).toBe("0.00");
    });
});
