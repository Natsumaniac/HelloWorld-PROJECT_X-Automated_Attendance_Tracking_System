
-- Filename: projectx_users.sql

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'instructor', 'student') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admin user (password should be hashed in real scenario)
INSERT INTO users (full_name, email, password, role) VALUES
('Admin User', 'admin@example.com', 'admin123', 'admin');
