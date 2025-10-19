-- database.sql
-- Estructura de base de datos para Enrique Garza

CREATE DATABASE IF NOT EXISTS enrique_garza;
USE enrique_garza;

-- Tabla de servicios
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    duration_minutes INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar servicios
INSERT INTO services (name, price, description, duration_minutes) VALUES
('Corte de Cabello', 450.00, 'Corte profesional adaptado a tu estilo', 60),
('Asesoría Online', 350.00, 'Consulta virtual de visagismo', 45),
('Corte + Asesoría', 750.00, 'Experiencia completa con análisis', 120);

-- Tabla de pagos
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_intent_id VARCHAR(255) UNIQUE,
    service VARCHAR(100) NOT NULL,
    service_id INT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MXN',
    status ENUM('pending', 'succeeded', 'failed', 'canceled', 'completed') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payer_email VARCHAR(255),
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Tabla de reservas
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id INT,
    calendly_event_id VARCHAR(255),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    service_id INT,
    appointment_date DATETIME NOT NULL,
    status ENUM('confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Tabla de clientes
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_visit TIMESTAMP NULL
);

-- Índices para mejor rendimiento
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_bookings_date ON bookings(appointment_date);
CREATE INDEX idx_customers_email ON customers(email);
