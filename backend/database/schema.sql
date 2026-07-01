-- AgriNexus Database Schema
-- Import via phpMyAdmin or: mysql -u root agrinexus_db < schema.sql

CREATE DATABASE IF NOT EXISTS agrinexus_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agrinexus_db;

-- ── users ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    full_name     VARCHAR(120)    NOT NULL,
    email         VARCHAR(180)    NOT NULL UNIQUE,
    password_hash VARCHAR(255)    NOT NULL,
    role          ENUM('farmer','buyer') NOT NULL DEFAULT 'buyer',
    county        VARCHAR(80)     NOT NULL DEFAULT '',
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_email (email),
    INDEX idx_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── products ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    farmer_id   INT UNSIGNED    NOT NULL,
    name        VARCHAR(160)    NOT NULL,
    category    ENUM('Vegetables','Fruits','Grains','Dairy') NOT NULL,
    price       DECIMAL(10,2)   NOT NULL,
    unit        VARCHAR(20)     NOT NULL DEFAULT 'kg',
    quantity    INT UNSIGNED    NOT NULL DEFAULT 0,
    description TEXT,
    image_url   VARCHAR(512)    NOT NULL DEFAULT '',
    status      ENUM('active','out_of_stock','pending','deleted') NOT NULL DEFAULT 'active',
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_farmer   (farmer_id),
    INDEX idx_category (category),
    INDEX idx_status   (status),
    CONSTRAINT fk_product_farmer FOREIGN KEY (farmer_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── orders ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    product_id       INT UNSIGNED    NOT NULL,
    buyer_id         INT UNSIGNED    NOT NULL,
    farmer_id        INT UNSIGNED    NOT NULL,
    quantity         INT UNSIGNED    NOT NULL,
    total_price      DECIMAL(12,2)   NOT NULL,
    status           ENUM('pending','confirmed','delivered','cancelled') NOT NULL DEFAULT 'pending',
    delivery_address VARCHAR(512)    NOT NULL DEFAULT '',
    created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_buyer    (buyer_id),
    INDEX idx_farmer   (farmer_id),
    INDEX idx_status   (status),
    CONSTRAINT fk_order_product FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_order_buyer   FOREIGN KEY (buyer_id)   REFERENCES users (id),
    CONSTRAINT fk_order_farmer  FOREIGN KEY (farmer_id)  REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── sensor_readings ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sensor_readings (
    id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    farm_id       INT UNSIGNED    NOT NULL,
    temperature   DECIMAL(5,2)    NOT NULL,
    humidity      DECIMAL(5,2)    NOT NULL,
    soil_moisture DECIMAL(5,2)    NOT NULL,
    light_level   INT UNSIGNED    NOT NULL,
    recorded_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_farm_time (farm_id, recorded_at),
    CONSTRAINT fk_reading_farm FOREIGN KEY (farm_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── market_prices ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_prices (
    id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    crop_name    VARCHAR(80)     NOT NULL,
    price_per_kg DECIMAL(10,2)   NOT NULL,
    demand_index TINYINT UNSIGNED NOT NULL DEFAULT 50,
    county       VARCHAR(80)     NOT NULL DEFAULT '',
    recorded_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_crop_time (crop_name, recorded_at),
    INDEX idx_county    (county)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── weather_cache ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weather_cache (
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    county     VARCHAR(80)  NOT NULL,
    cache_key  VARCHAR(40)  NOT NULL,
    data_json  MEDIUMTEXT   NOT NULL,
    fetched_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_county_key (county, cache_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
