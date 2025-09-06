CREATE TABLE user_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    visits INT DEFAULT 1,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    friends INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
