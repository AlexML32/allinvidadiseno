-- ============================================================
-- ALLINVIDA SALUD - Script de creación de Base de Datos
-- Motor: PostgreSQL 15+
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- Para gen_random_uuid()

-- ============================================================
-- TIPOS ENUM
-- ============================================================

CREATE TYPE user_role AS ENUM ('ADMIN', 'CLIENT', 'DELIVERY');
CREATE TYPE order_status AS ENUM ('PENDING', 'DELIVERED_PAID', 'CANCELLED');
CREATE TYPE movement_type AS ENUM ('INITIAL', 'INCREASE', 'DECREASE');

-- ============================================================
-- TABLA: users
-- ============================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    phone           VARCHAR(30),
    address         VARCHAR(255),
    role            user_role NOT NULL DEFAULT 'CLIENT',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- TABLA: products
-- ============================================================

CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    price           NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category        VARCHAR(80),
    image_url       VARCHAR(255) DEFAULT '/placeholder-product.png',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);

-- ============================================================
-- TABLA: orders
-- ============================================================

CREATE TABLE orders (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    delivery_user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    status              order_status NOT NULL DEFAULT 'PENDING',
    delivery_address    VARCHAR(255) NOT NULL,
    total               NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at        TIMESTAMPTZ
);

CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_delivery_user ON orders(delivery_user_id);

-- ============================================================
-- TABLA: order_items
-- ============================================================

CREATE TABLE order_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name    VARCHAR(150) NOT NULL,   -- snapshot del nombre al momento de la compra
    unit_price      NUMERIC(10,2) NOT NULL,  -- snapshot del precio al momento de la compra
    quantity        INTEGER NOT NULL CHECK (quantity > 0),
    subtotal        NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================================
-- TABLA: inventory_movements (auditoría de stock)
-- ============================================================

CREATE TABLE inventory_movements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    movement_type   movement_type NOT NULL,
    quantity        INTEGER NOT NULL,
    previous_stock  INTEGER NOT NULL,
    new_stock       INTEGER NOT NULL,
    reason          VARCHAR(255),
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_movements_product ON inventory_movements(product_id);

-- ============================================================
-- TRIGGER: actualizar updated_at automáticamente
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- USUARIO ADMINISTRADOR SEMILLA
-- Contraseña temporal: "Admin123!" (DEBE cambiarse tras el primer login)
-- El hash de abajo es un placeholder de ejemplo (bcrypt) — el backend debe
-- regenerar este hash real en su script de seed (infrastructure/database/seed.py)
-- ============================================================

INSERT INTO users (full_name, email, password_hash, role, is_active)
VALUES (
    'Administrador ALLINVIDA',
    'admin@allinvida.com',
    '$2b$12$REEMPLAZAR_CON_HASH_BCRYPT_REAL_GENERADO_POR_EL_BACKEND',
    'ADMIN',
    TRUE
);

-- ============================================================
-- DATOS DE EJEMPLO (opcional, para pruebas iniciales)
-- ============================================================

INSERT INTO products (name, description, price, stock, category) VALUES
('Miel de abeja 500ml', 'Miel pura de abeja, 100% natural.', 25.00, 40, 'Endulzantes naturales'),
('Aceite esencial de eucalipto 30ml', 'Ideal para aromaterapia y vías respiratorias.', 18.50, 25, 'Aceites esenciales'),
('Quinua orgánica 1kg', 'Quinua andina orgánica, rica en proteína.', 14.90, 60, 'Cereales y granos'),
('Té verde de hierbas 20 sobres', 'Mezcla de hierbas naturales para infusión.', 9.90, 80, 'Infusiones'),
('Jabón artesanal de avena', 'Jabón natural exfoliante con avena.', 7.50, 100, 'Cuidado personal');
