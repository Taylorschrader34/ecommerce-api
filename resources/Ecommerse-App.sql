CREATE TABLE  IF NOT EXISTS users (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY NOT NULL,
  email VARCHAR(50) NOT NULL,
  password TEXT NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  created DATE,
  modified DATE
);

CREATE TABLE IF NOT EXISTS orders (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY NOT NULL,
  userId INT NOT NULL,
  total BIGINT NOT NULL,
  status VARCHAR(50) NOT NULL,
  created DATE,
  modified DATE
);

CREATE TABLE IF NOT EXISTS products (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY NOT NULL,
  name VARCHAR(50) NOT NULL,
  price BIGINT NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL,
  created DATE,
  modified DATE
);

CREATE TABLE IF NOT EXISTS carts (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY NOT NULL,
  userId INT NOT NULL,
  created DATE,
  modified DATE
);

CREATE TABLE IF NOT EXISTS cartItems (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY NOT NULL,
  productId INT NOT NULL,
  qty INT NOT NULL,
  cartId INT NOT NULL
);

CREATE TABLE IF NOT EXISTS orderItems (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY NOT NULL,
  productId INT NOT NULL,
  qty INT NOT NULL,
  orderId INT NOT NULL
);

ALTER TABLE orders ADD FOREIGN KEY (userId) REFERENCES users (id);

ALTER TABLE carts ADD FOREIGN KEY (userId) REFERENCES users (id);

ALTER TABLE cartItems ADD FOREIGN KEY (productId) REFERENCES products (id);

ALTER TABLE cartItems ADD FOREIGN KEY (cartId) REFERENCES carts (id);

ALTER TABLE orderItems ADD FOREIGN KEY (productId) REFERENCES products (id);

ALTER TABLE orderItems ADD FOREIGN KEY (orderId) REFERENCES orders (id);
