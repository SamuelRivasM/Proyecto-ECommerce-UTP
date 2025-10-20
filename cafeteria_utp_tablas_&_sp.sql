-- ------------------------------------------------------
-- Base de datos: cafeteria_utp
-- ------------------------------------------------------
CREATE DATABASE IF NOT EXISTS cafeteria_utp
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE cafeteria_utp;

-- ------------------------------------------------------
-- Tabla: usuarios
-- ------------------------------------------------------
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(20) UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('cliente','admin','cocina') DEFAULT 'cliente',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_login TIMESTAMP NULL,
  estado TINYINT(1) DEFAULT 1 COMMENT '1 = activo, 0 = desactivado'
) ENGINE=InnoDB;

-- ------------------------------------------------------
-- Tabla: categorias
-- ------------------------------------------------------
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------
-- Tabla: productos
-- ------------------------------------------------------
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen VARCHAR(255),
  stock INT DEFAULT 0,
  categoria_id INT,
  disponible TINYINT(1) DEFAULT 1,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------
-- Tabla: pedidos
-- ------------------------------------------------------
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  metodo_pago ENUM('efectivo','tarjeta','billetera') NOT NULL,
  estado ENUM('pendiente','en preparación','listo','entregado') DEFAULT 'pendiente',
  total DECIMAL(10,2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------
-- Tabla: detalle_pedido
-- ------------------------------------------------------
CREATE TABLE detalle_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------
-- Tabla: tokens_recuperacion
-- ------------------------------------------------------
CREATE TABLE tokens_recuperacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  usado TINYINT(1) DEFAULT 0,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;


SET GLOBAL event_scheduler = ON;

DELIMITER $$

CREATE EVENT IF NOT EXISTS actualizar_estado_productos_event
ON SCHEDULE EVERY 10 SECOND
DO
BEGIN
  -- Desactivar productos sin stock
  UPDATE productos
  SET disponible = 0
  WHERE stock <= 0 AND disponible != 0;

  -- Activar productos con stock positivo
  UPDATE productos
  SET disponible = 1
  WHERE stock > 0 AND disponible != 1;
END$$

DELIMITER ;
