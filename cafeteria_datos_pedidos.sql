
USE cafeteria_utp;

-- =============================
-- Pedidos de prueba (cliente id=1)
-- =============================

-- Pedido 1: Café + Brownie (ayer)
INSERT INTO pedidos (usuario_id, metodo_pago, estado, total, fecha)
VALUES (1, 'tarjeta', 'entregado', 11.50, DATE_SUB(NOW(), INTERVAL 1 DAY));

SET @pedido1 = LAST_INSERT_ID();
INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal)
VALUES 
(@pedido1, 1, 1, 5.00),   -- Café Americano
(@pedido1, 12, 1, 6.50);  -- Brownie

-- Pedido 2: Limonada + Sandwich (hoy)
INSERT INTO pedidos (usuario_id, metodo_pago, estado, total, fecha)
VALUES (1, 'efectivo', 'entregado', 15.00, NOW());

SET @pedido2 = LAST_INSERT_ID();
INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal)
VALUES 
(@pedido2, 7, 1, 5.00),   -- Limonada Frappe
(@pedido2, 16, 1, 10.00); -- Sandwich de Pollo

-- Pedido 3: 2 Frappuccinos + Muffin (hoy)
INSERT INTO pedidos (usuario_id, metodo_pago, estado, total, fecha)
VALUES (1, 'billetera digital', 'entregado', 22.50, NOW());

SET @pedido3 = LAST_INSERT_ID();
INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal)
VALUES 
(@pedido3, 8, 2, 16.00),  -- Frappuccino (x2)
(@pedido3, 13, 1, 6.50);  -- Muffin de Arándanos

-- Pedido 4: Hamburguesa + Papas + Gaseosa (este mes, hace 10 días)
INSERT INTO pedidos (usuario_id, metodo_pago, estado, total, fecha)
VALUES (1, 'tarjeta', 'entregado', 17.50, DATE_SUB(NOW(), INTERVAL 10 DAY));

SET @pedido4 = LAST_INSERT_ID();
INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal)
VALUES 
(@pedido4, 19, 1, 12.00), -- Hamburguesa Clásica
(@pedido4, 21, 1, 3.50),  -- Papas Fritas
(@pedido4, 6, 1, 2.00);   -- Agua Mineral

-- Pedido 5: Café Latte + Croissant (mes anterior, para probar filtros)
INSERT INTO pedidos (usuario_id, metodo_pago, estado, total, fecha)
VALUES (1, 'efectivo', 'entregado', 11.00, DATE_SUB(NOW(), INTERVAL 40 DAY));

SET @pedido5 = LAST_INSERT_ID();
INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal)
VALUES 
(@pedido5, 2, 1, 6.50),   -- Café Latte
(@pedido5, 14, 1, 4.50);  -- Croissant
