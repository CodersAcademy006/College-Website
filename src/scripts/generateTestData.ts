import * as fs from 'fs';
import * as path from 'path';

const courses = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'IT'];
const roles = ['Admin Assistant', 'Accounts', 'Admissions', 'IT Support'];
const firstNames = [
  'Emma', 'James', 'Sophia', 'Lucas', 'Olivia', 'William', 'Ava', 'Noah',
  'Isabella', 'Benjamin', 'Mia', 'Elijah', 'Charlotte', 'Alexander', 'Amelia',
  'Michael', 'Harper', 'Daniel', 'Evelyn', 'Matthew', 'Abigail', 'David',
  'Emily', 'Joseph', 'Elizabeth', 'Henry', 'Sofia', 'Sebastian', 'Avery',
  'Jack', 'Ella', 'Owen', 'Scarlett', 'Gabriel', 'Victoria', 'Carter',
  'Madison', 'Jayden', 'Luna', 'John', 'Grace', 'Luke', 'Chloe', 'Anthony',
  'Penelope', 'Isaac', 'Layla', 'Dylan', 'Riley', 'Andrew', 'Zoey', 'Joshua',
  'Nora', 'Christopher', 'Lily', 'Grayson', 'Eleanor', 'Christian', 'Hannah',
  'Julian', 'Lillian', 'Aaron', 'Addison', 'Eli', 'Aubrey', 'Jonathan',
  'Brooklyn', 'Charles', 'Ellie', 'Jeremiah', 'Stella', 'Cameron', 'Natalie',
  'Adrian', 'Zoe', 'Thomas', 'Leah', 'Jordan', 'Hazel', 'Brayden', 'Violet',
  'Nicholas', 'Aurora', 'Isaiah', 'Savannah', 'Ryan', 'Audrey', 'Angel',
  'Bella', 'Kevin', 'Claire', 'Robert', 'Skylar', 'Brandon', 'Lucy', 'Tyler',
  'Paisley', 'Alex', 'Everly', 'James', 'Anna', 'Justin', 'Caroline'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz',
  'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris',
  'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan',
  'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos',
  'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez',
  'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long',
  'Ross', 'Foster', 'Jimenez'
];

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateStudents = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ST${(i + 1).toString().padStart(3, '0')}`,
    name: `${generateRandomElement(firstNames)} ${generateRandomElement(lastNames)}`,
    email: `student${i + 1}@college.edu`,
    course: generateRandomElement(courses),
    status: Math.random() > 0.1 ? 'active' : 'inactive',
    attendance: generateRandomNumber(50, 100),
    grades: {
      CS101: generateRandomNumber(60, 100),
      CS102: generateRandomNumber(60, 100)
    }
  }));
};

const generateFaculty = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const course1 = `CS${generateRandomNumber(101, 110)}`;
    let course2;
    do {
      course2 = `CS${generateRandomNumber(101, 110)}`;
    } while (course2 === course1);

    return {
      id: `FAC${(i + 1).toString().padStart(3, '0')}`,
      name: `Dr. ${generateRandomElement(firstNames)} ${generateRandomElement(lastNames)}`,
      email: `faculty${i + 1}@college.edu`,
      department: generateRandomElement(courses),
      courses: [course1, course2],
      status: 'active'
    };
  });
};

const generateOfficeStaff = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `OFF${(i + 1).toString().padStart(3, '0')}`,
    name: `${generateRandomElement(firstNames)} ${generateRandomElement(lastNames)}`,
    email: `office${i + 1}@college.edu`,
    role: generateRandomElement(roles),
    status: 'active'
  }));
};

const generateTestData = () => {
  const data = {
    students: generateStudents(100),
    faculty: generateFaculty(20),
    office: generateOfficeStaff(10)
  };

  const outputPath = path.resolve(__dirname, '../data/testData.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Test data generated at ${outputPath}`);
};

generateTestData(); 