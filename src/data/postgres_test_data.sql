-- PostgreSQL Test Data

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    course VARCHAR(50) NOT NULL,
    semester INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty Table
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    department VARCHAR(50) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    specialization VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    credits INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments Table
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    course_id INTEGER REFERENCES courses(id),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    UNIQUE(student_id, course_id)
);

-- Attendance Table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    course_id INTEGER REFERENCES courses(id),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, date)
);

-- Grades Table
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    course_id INTEGER REFERENCES courses(id),
    grade VARCHAR(2) NOT NULL,
    semester INTEGER NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, semester, academic_year)
);

-- Insert Test Data

-- Insert Users
INSERT INTO users (name, email, role) VALUES
('John Doe', 'john.doe@college.edu', 'student'),
('Jane Smith', 'jane.smith@college.edu', 'faculty'),
('Admin User', 'admin@college.edu', 'admin');

-- Insert Students
INSERT INTO students (user_id, roll_number, course, semester) VALUES
(1, 'CS2024001', 'Computer Science', 3);

-- Insert Faculty
INSERT INTO faculty (user_id, department, designation, specialization) VALUES
(2, 'Computer Science', 'Professor', 'Artificial Intelligence');

-- Insert Courses
INSERT INTO courses (code, name, department, credits, semester) VALUES
('CS101', 'Introduction to Programming', 'Computer Science', 4, 1),
('CS102', 'Data Structures', 'Computer Science', 4, 2);

-- Insert Enrollments
INSERT INTO enrollments (student_id, course_id) VALUES
(1, 1),
(1, 2);

-- Insert Attendance
INSERT INTO attendance (student_id, course_id, date, status) VALUES
(1, 1, CURRENT_DATE, 'present'),
(1, 2, CURRENT_DATE, 'present');

-- Insert Grades
INSERT INTO grades (student_id, course_id, grade, semester, academic_year) VALUES
(1, 1, 'A', 1, '2023-2024'),
(1, 2, 'B+', 2, '2023-2024'); 