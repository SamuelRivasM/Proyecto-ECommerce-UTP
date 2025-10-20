
USE cafeteria_utp;

-- ==========================================================
-- USUARIOS
-- ==========================================================
INSERT INTO usuarios (nombre, email, telefono, password, rol, ultimo_login)
VALUES 
('Carlos Cliente', 'cliente@utp.edu.pe', '999111222', '$2b$10$om/yOfd..Jp0VMHevOrLwuVj8dEHyqvHWvAwIen1afZ9W9EkgdHSW', 'cliente', NULL), -- clave: cliente123
('Ana Admin', 'admin@utp.edu.pe', '999333444', '$2b$10$63g.uv4a1JNsKPb.x3i9P.wGuDoPhZtBxgW2K/6NV.8NMYlM/sUTG', 'admin', NULL), -- clave: admin123
('Pedro Cocina', 'cocina@utp.edu.pe', '999555666', '$2b$10$zHDRgJ0xQ4m00jd4KF3PkOG4YQbXkh1gBzYRvnP/jLHuBz73Wi.Yi', 'cocina', NULL), -- clave: cocina123 
('Sergio', 'U22201712@utp.edu.pe', '+51967548512', '$2b$10$zhM5pKhnXmfbPm//mXR91./r7diatigNwlKU4ywjo7UP6W2UPNOdW', 'cliente', '2025-10-01 20:46:21'); -- clave: sergio123
('Lucía Desactivada', 'lucia@utp.edu.pe', '999777888', '$2b$10$zhM5pKhnXmfbPm//mXR91./r7diatigNwlKU4ywjo7UP6W2UPNOdW', 'cliente', NULL, 0); -- clave: sergio123

-- ==========================================================
-- CATEGORÍAS
-- ==========================================================
INSERT INTO categorias (nombre)
VALUES
('Bebidas Calientes'),
('Bebidas Frías'),
('Postres'),
('Sandwiches'),
('Snacks');

-- ==========================================================
-- PRODUCTOS (5 por categoría)
-- ==========================================================
-- 1. Bebidas Calientes
INSERT INTO productos (nombre, descripcion, precio, imagen, stock, categoria_id)
VALUES
('Café Americano', 'Café negro clásico', 5.00, 'https://res.cloudinary.com/dkxfrwzmg/image/upload/v1760939529/cafeteria_utp/img_productos/if6e0dhl5togbjgyhhut.avif', 50, 1),
('Café Latte', 'Café con leche espumosa', 6.50, 'https://res.cloudinary.com/dkxfrwzmg/image/upload/v1760927750/cafeteria_utp/img_productos/stfdlqb5gjxezvqepymi.avif', 40, 1),
('Capuchino', 'Café con espuma de leche y cacao', 7.00, 'https://res.cloudinary.com/dkxfrwzmg/image/upload/v1760927904/cafeteria_utp/img_productos/hqj6p0sqcxsqytxhkniz.avif', 30, 1),
('Té Verde', 'Infusión de té verde natural', 4.00, 'https://res.cloudinary.com/dkxfrwzmg/image/upload/v1760939521/cafeteria_utp/img_productos/dcz6edkogya642fnqljf.avif', 25, 1),
('Chocolate Caliente', 'Bebida caliente de cacao', 6.00, 'chocolate.jpg', 20, 1);

-- 2. Bebidas Frías
INSERT INTO productos (nombre, descripcion, precio, imagen, stock, categoria_id)
VALUES
('Jugo de Naranja', 'Jugo natural recién exprimido', 4.50, 'jugo_naranja.jpg', 35, 2),
('Limonada Frappe', 'Refrescante limonada con hielo', 5.00, 'limonada.jpg', 40, 2),
('Frappuccino', 'Bebida fría de café con crema', 8.00, 'frappuccino.jpg', 25, 2),
('Smoothie de Fresa', 'Batido de fresa natural', 7.50, 'smoothie_fresa.jpg', 30, 2),
('Agua Mineral', 'Botella de agua mineral', 2.00, 'agua.jpg', 100, 2);

-- 3. Postres
INSERT INTO productos (nombre, descripcion, precio, imagen, stock, categoria_id)
VALUES
('Tarta de Queso', 'Porción de cheesecake', 9.00, 'cheesecake.jpg', 15, 3),
('Brownie', 'Brownie de chocolate con nueces', 6.50, 'brownie.jpg', 20, 3),
('Muffin de Arándanos', 'Muffin esponjoso con arándanos', 5.50, 'muffin_arandano.jpg', 25, 3),
('Croissant', 'Croissant recién horneado', 4.50, 'croissant.jpg', 30, 3),
('Helado de Vainilla', 'Vaso de helado sabor vainilla', 4.00, 'helado_vainilla.jpg', 20, 3);

-- 4. Sandwiches
INSERT INTO productos (nombre, descripcion, precio, imagen, stock, categoria_id)
VALUES
('Sandwich de Pollo', 'Sandwich con pollo y vegetales', 10.00, 'https://res.cloudinary.com/dkxfrwzmg/image/upload/v1760928336/cafeteria_utp/img_productos/wvvywgff5smjupjwo0yr.avif', 20, 4),
('Sandwich de Jamón y Queso', 'Clásico sandwich mixto', 8.00, 'sandwich_jamon.jpg', 25, 4),
('Panini de Vegetales', 'Panini con verduras grilladas', 9.50, 'panini_vegetales.jpg', 15, 4),
('Hamburguesa Clásica', 'Hamburguesa con carne de res', 12.00, 'hamburguesa.jpg', 30, 4),
('Wrap de Atún', 'Wrap con atún y vegetales', 9.00, 'wrap_atun.jpg', 18, 4);

-- 5. Snacks
INSERT INTO productos (nombre, descripcion, precio, imagen, stock, categoria_id)
VALUES
('Papas Fritas', 'Bolsa de papas fritas crocantes', 3.50, 'papas.jpg', 50, 5),
('Galletas de Chocolate', 'Paquete de galletas caseras', 4.00, 'galletas.jpg', 40, 5),
('Barra de Cereal', 'Barra energética de cereal y miel', 2.50, 'barra_cereal.jpg', 60, 5),
('Maní Salado', 'Bolsa de maní tostado y salado', 3.00, 'mani.jpg', 70, 5),
('Mix de Frutos Secos', 'Mezcla saludable de frutos secos', 5.00, 'frutos_secos.jpg', 30, 5);

-- ==========================================================
-- PEDIDOS (Distribuidos enero - octubre 2025)
-- ==========================================================
-- Para variedad, generamos 60 pedidos con distintos productos y fechas

DELIMITER $$

CREATE PROCEDURE generar_pedidos_prueba()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE usuario INT;
    DECLARE producto INT;
    DECLARE cantidad INT;
    DECLARE total DECIMAL(10,2);
    DECLARE fecha_pedido DATE;
    DECLARE metodos VARCHAR(20);
    DECLARE estados VARCHAR(20);

    WHILE i <= 60 DO
        SET usuario = IF(i % 2 = 0, 1, 4); -- alterna entre los usuarios
        SET producto = FLOOR(1 + RAND() * 25); -- producto entre 1 y 25
        SET cantidad = FLOOR(1 + RAND() * 3);
        SET total = cantidad * (SELECT precio FROM productos WHERE id = producto);
        SET fecha_pedido = DATE_ADD('2025-01-01', INTERVAL FLOOR(RAND() * 288) DAY); -- enero a octubre 15 del 2025
        SET metodos = ELT(FLOOR(1 + RAND()*3), 'tarjeta', 'efectivo', 'billetera digital');
        SET estados = ELT(FLOOR(1 + RAND()*3), 'entregado', 'en preparación', 'listo');

        INSERT INTO pedidos (usuario_id, metodo_pago, estado, total, fecha)
        VALUES (usuario, metodos, estados, total, fecha_pedido);

        INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal)
        VALUES (LAST_INSERT_ID(), producto, cantidad, total);

        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

CALL generar_pedidos_prueba();

DROP PROCEDURE generar_pedidos_prueba;
