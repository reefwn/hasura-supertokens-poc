-- Create a 'reports' table
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_amount DECIMAL(10, 2) NOT NULL
);

-- Insert dummy data into 'reports'
INSERT INTO reports (username, product_name, quantity, item_price, order_date, total_amount) VALUES
('john_doe', 'Laptop', 1, 1200.00, NOW(), 1200.00),
('john_doe', 'Mouse', 1, 25.50, NOW(), 25.50),
('jane_smith', 'Keyboard', 1, 75.00, NOW(), 75.00),
('jane_smith', 'Monitor', 1, 300.00, NOW(), 300.00);