-- CREATE USER "cqdashboard" WITH PASSWORD 'PASSWORD';
-- CREATE DATABASE care_quality_dashboard OWNER "cqdashboard";

CREATE TYPE user_type AS ENUM ('unknown', 'admin', 'user');

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    user_type user_type DEFAULT 'unknown'
);

CREATE TABLE user_join_codes (
    platform_id INTEGER PRIMARY KEY,
    code TEXT NOT NULL
);

CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    platform_id INTEGER NOT NULL,
    is_mentoring_session BOOLEAN NOT NULL
);

CREATE TABLE scores (
    response_id INTEGER NOT NULL,
    standard_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    PRIMARY KEY (response_id, standard_id)
);

CREATE TABLE standards (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TYPE question_type AS ENUM ('likert_scale');

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    default_url TEXT NOT NULL,
    standard_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    body TEXT NOT NULL,
    type question_type NOT NULL,
    archived BOOLEAN DEFAULT FALSE,
    platform_id NOT NULL,
    category_id NOT NULL,
);

CREATE table question_urls (
    question_id INTEGER NOT NULL,
    platform_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    PRIMARY KEY (question_id, platform_id)
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    platform_id INTEGER NOT NULL,
);

CREATE TABLE platforms (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    archived BOOLEAN DEFAULT FALSE
);

ALTER TABLE user_join_codes ADD FOREIGN KEY (platform_id) REFERENCES platforms(id);

ALTER TABLE responses ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE responses ADD FOREIGN KEY (platform_id) REFERENCES platforms(id);

ALTER TABLE scores ADD FOREIGN KEY (response_id) REFERENCES responses(id);
ALTER TABLE scores ADD FOREIGN KEY (standard_id) REFERENCES standards(id);

ALTER TABLE questions ADD FOREIGN KEY (standard_id) REFERENCES standards(id);
ALTER TABLE questions ADD FOREIGN KEY (platform_id) REFERENCES platforms(id);
ALTER TABLE questions ADD FOREIGN KEY (category_id) REFERENCES categories(id);


ALTER TABLE question_urls ADD FOREIGN KEY (question_id) REFERENCES questions(id);
ALTER TABLE question_urls ADD FOREIGN KEY (platform_id) REFERENCES platforms(id);

ALTER TABLE categories ADD FOREIGN KEY (platform_id) REFERENCES platforms(id);
