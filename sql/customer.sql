-- Create a 'customers' table
CREATE TABLE customers (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert dummy data into 'customers'
INSERT INTO customers (username, email) VALUES
('john_doe', 'john.doe@example.com'),
('jane_smith', 'jane.smith@example.com'),
('peter_jones', 'peter.jones@example.com');