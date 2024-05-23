-- Drop the database if it exists
DROP DATABASE IF EXISTS employees;

-- Create the new database
CREATE DATABASE employees;

-- Connect to the database
\c employees

-- TODO- write an SQL command to Create the department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- TODO- write an SQL command to Create the role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title TEXT,
    salary DECIMAL,
    department_id INTEGER,
    FOREIGN KEY(department_id)
    REFERENCES department(id)
);

-- TODO- write an SQL command to Create the employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id)
    REFERENCES role(id),
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);
