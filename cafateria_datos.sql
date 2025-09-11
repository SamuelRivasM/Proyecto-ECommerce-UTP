USE cafeteria_utp;

-- ========================================
-- Usuarios de prueba
-- ========================================
INSERT INTO usuarios (nombre, email, telefono, password, rol, ultimo_login)
VALUES 
('Carlos Cliente', 'cliente@utp.edu.pe', '999111222', '$2b$10$om/yOfd..Jp0VMHevOrLwuVj8dEHyqvHWvAwIen1afZ9W9EkgdHSW', 'cliente', NULL),     -- password: cliente123
('Ana Admin', 'admin@utp.edu.pe', '999333444', '$2b$10$63g.uv4a1JNsKPb.x3i9P.wGuDoPhZtBxgW2K/6NV.8NMYlM/sUTG', 'admin', NULL),              -- password: admin123
('Pedro Cocina', 'cocina@utp.edu.pe', '999555666', '$2b$10$zHDRgJ0xQ4m00jd4KF3PkOG4YQbXkh1gBzYRvnP/jLHuBz73Wi.Yi', 'cocina', NULL);         -- password: cocina123

-- ========================================
-- Categorías
-- ========================================
INSERT INTO categorias (nombre)
VALUES
('Bebidas Calientes'),
('Bebidas Frías'),
('Postres'),
('Sandwiches'),
('Snacks');

-- ========================================
-- Productos (5 por categoría)
-- ========================================
-- 1. Bebidas Calientes (id=1)
INSERT INTO productos (nombre, descripcion, precio, imagen, stock, categoria_id, disponible)
VALUES
('Café Americano', 'Café negro clásico', 5.00, 'americano.jpg', 50, 1, 1),
('Café Latte', 'Café con leche espumosa', 6.50, 'latte.jpg', 40, 1, 1),
('Capuchino', 'Café con espuma de leche y cacao', 7.00, 'capuchino.jpg', 30, 1, 1),
('Té Verde', 'Infusión de té verde natural', 4.00, 'teverde.jpg', 25, 1, 1),
('Chocolate Caliente', 'Bebida caliente de cacao', 6.00, 'chocolate.jpg', 20, 1, 1);

-- 2. Bebidas Frías (id=2)
INSERT INTO productos (nombre, descripcion, precio, imagen, stock, categoria_id, disponible)
VALUES
('Jugo de Naranja', 'Jugo natural recién exprimido', 4.50, 'jugo_naranja.jpg', 35, 2, 1),
('Limonada Frappe', 'Refrescante limonada con hielo', 5.00, 'limonada.jpg', 40, 2, 1),
('Frappuccino', 'Bebida fría de café con crema', 8.00, 'frappuccino.jpg', 25, 2, 1),
('Smoothie de Fresa', 'Batido de fresa natural', 7.50, 'smoothie_fresa.jpg', 30, 2, 1),
('Agua Mineral', 'Botella de agua mineral', 2.00, 'agua.jpg', 100, 2, 1);

-- 3. Postres (id=3)
INSERT INTO productos (nombre, descripcion, precio, imagen, stock, categoria_id, disponible)
VALUES
('Tarta de Queso', 'Porción de cheesecake', 9.00, 'cheesecake.jpg', 15, 3, 1),
('Brownie', 'Brownie de chocolate con nueces', 6.50, 'brownie.jpg', 20, 3, 1),
('Muffin de Arándanos', 'Muffin esponjoso con arándanos', 5.50, 'muffin_arandano.jpg', 25, 3, 1),
('Croissant', 'Croissant recién horneado', 4.50, 'croissant.jpg', 30, 3, 1),
('Helado de Vainilla', 'Vaso de helado sabor vainilla', 4.00, 'helado_vainilla.jpg', 20, 3, 1);

-- 4. Sandwiches (id=4)
INSERT INTO productos (nombre, descripcion, precio, imagen, stock, categoria_id, disponible)
VALUES
('Sandwich de Pollo', 'Sandwich con pollo y vegetales', 10.00, 'sandwich_pollo.jpg', 20, 4, 1),
('Sandwich de Jamón y Queso', 'Clásico sandwich mixto', 8.00, 'sandwich_jamon.jpg', 25, 4, 1),
('Panini de Vegetales', 'Panini con verduras grilladas', 9.50, 'panini_vegetales.jpg', 15, 4, 1),
('Hamburguesa Clásica', 'Hamburguesa con carne de res', 12.00, 'hamburguesa.jpg', 30, 4, 1),
('Wrap de Atún', 'Wrap con atún y vegetales', 9.00, 'wrap_atun.jpg', 18, 4, 1);

-- 5. Snacks (id=5)
INSERT INTO productos (nombre, descripcion, precio, imagen, stock, categoria_id, disponible)
VALUES
('Papas Fritas', 'Bolsa de papas fritas crocantes', 3.50, 'papas.jpg', 50, 5, 1),
('Galletas de Chocolate', 'Paquete de galletas caseras', 4.00, 'galletas.jpg', 40, 5, 1),
('Barra de Cereal', 'Barra energética de cereal y miel', 2.50, 'barra_cereal.jpg', 60, 5, 1),
('Maní Salado', 'Bolsa de maní tostado y salado', 3.00, 'mani.jpg', 70, 5, 1),
('Mix de Frutos Secos', 'Mezcla saludable de frutos secos', 5.00, 'frutos_secos.jpg', 30, 5, 1);
