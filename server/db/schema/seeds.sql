INSERT INTO users (name, email, password)
VALUES ('Bobby', '123@test.com', '$2a$10$Ayj/GV1Etys.d4O/rt0ICOp0vDtSTE3PYdVaROqFgpnAtA0RlJVQy'),
('Marco', 'marco@polo.com', '$2a$10$Ayj/GV1Etys.d4O/rt0ICOp0vDtSTE3PYdVaROqFgpnAtA0RlJVQy')
;

INSERT INTO notes (owner_id, contents)
VALUES
(1, 'Delete package-lock.json if there are issues with packages'),
(1, 'Remeber to hash passwords for security')
;