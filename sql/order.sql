-- Create a 'products' table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0
);

-- Create an 'orders' table with a foreign key to 'users' and 'products'
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_amount DECIMAL(10, 2) NOT NULL
);

-- Create an 'order_items' table with foreign keys to 'orders' and 'products'
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,

    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Insert dummy data into 'products'
INSERT INTO products (product_name, price, stock_quantity) VALUES
('Laptop', 1200.00, 50),
('Mouse', 25.50, 200),
('Keyboard', 75.00, 150),
('Monitor', 300.00, 75);

-- Insert dummy data into 'orders'
INSERT INTO orders (user_id, total_amount) VALUES
(1, 1225.50),
(2, 375.00);

-- Insert dummy data into 'order_items'
INSERT INTO order_items (order_id, product_id, quantity, item_price) VALUES
(1, 1, 1, 1200.00),
(1, 2, 1, 25.50),
(2, 3, 1, 75.00),
(2, 4, 1, 300.00);