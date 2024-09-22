USE auth_db;

INSERT INTO user (email, roles, password) VALUES
('admin@admin.com', '["ADMIN"]', '$2y$12$C9P7Q4BvQjZ2s0EDH7ZtTe/yA1Qm3IHTi7/rrgX6EnhXY6SRL.EzW'), -- password: admin
('nike@nike.com', '["USER"]', '$2y$12$C9P7Q4BvQjZ2s0EDH7ZtTe/yA1Qm3IHTi7/rrgX6EnhXY6SRL.EzW'), -- password: nike
('apple@apple.com', '["USER"]', '$2y$12$8vSgFLI0/dN7pMI0eU0oPewPx4U/oGzOsD0MEEfPGoQXlzFrVvHPC'), -- password: apple
('toyota@toyota.com', '["USER"]', '$2y$12$Tp7yGCyJ9rLldGz6rCkD1OCBk5ShFfJ.bE0GAWg63hLdoDq5Zt9aS'), -- password: toyota
('samsung@samsung.com', '["USER"]', '$2y$12$Fi3Yp9kQbXWbdOQBrO9m0Od3uDLodnH9y5jkd57B7I9v4XkO3abOe'); -- password: samsung

INSERT INTO database_info (name, created_at, updated_at, last_backup_at, type, collation) VALUES
('nike_db', NOW(), NULL, NULL, 'mysql', 'utf8_general_ci'),
('apple_db', NOW(), NULL, NULL, 'mysql', 'utf8_general_ci'),
('toyota_db', NOW(), NULL, NULL, 'mysql', 'utf8_general_ci'),
('samsung_db', NOW(), NULL, NULL, 'mysql', 'utf8_general_ci');

INSERT INTO scope (user_id, db_id) VALUES
(2, 1),
(3, 2),
(4, 3),
(5, 4),
