
// src/backend/utils/pedidoUtils.js
const generarNumeroSeguimiento = (pedidoId) => {
    if (!Number.isInteger(Number(pedidoId)) || Number(pedidoId) <= 0) {
        throw new Error("El ID del pedido debe ser un número válido");
    }

    return `PED-${String(pedidoId).padStart(6, "0")}`;
};

module.exports = {
    generarNumeroSeguimiento,
};
