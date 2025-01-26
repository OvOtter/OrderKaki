CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Store hashed passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    platform VARCHAR(255),
    cuisine VARCHAR(255),
    description TEXT,
    max_wait_time INTERVAL NOT NULL,
    building VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id),
    confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
