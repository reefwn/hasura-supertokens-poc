-- Create a 'm2m_credentials' table
CREATE TABLE m2m_credentials (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) UNIQUE NOT NULL,
    client_secret VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO m2m_credentials (client_id, client_secret, role) VALUES
('customer-service', 'customer-service-secret', 'service'),
('order-service', 'order-service-secret', 'service'),
('report-service', 'report-service-secret', 'service');