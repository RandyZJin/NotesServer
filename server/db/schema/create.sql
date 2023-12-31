DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS notes CASCADE;
CREATE TABLE notes (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contents TEXT,
  shared BOOLEAN DEFAULT FALSE,
  created_date TIMESTAMP NOT NULL DEFAULT NOW()
);