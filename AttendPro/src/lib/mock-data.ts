export interface Student {
  id: string;
  name: string;
  rollNo: string;
  className: string;
  email: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent';
  timestamp: string;
}

const STUDENTS_KEY = 'attendance_students';
const ATTENDANCE_KEY = 'attendance_records';

const defaultStudents: Student[] = [
  { id: '1', name: 'Aarav Sharma', rollNo: 'CS001', className: '10-A', email: 'aarav@school.com' },
  { id: '2', name: 'Priya Patel', rollNo: 'CS002', className: '10-A', email: 'priya@school.com' },
  { id: '3', name: 'Rohan Gupta', rollNo: 'CS003', className: '10-B', email: 'rohan@school.com' },
  { id: '4', name: 'Ananya Singh', rollNo: 'CS004', className: '10-B', email: 'ananya@school.com' },
  { id: '5', name: 'Vikram Reddy', rollNo: 'CS005', className: '11-A', email: 'vikram@school.com' },
  { id: '6', name: 'Sneha Iyer', rollNo: 'CS006', className: '11-A', email: 'sneha@school.com' },
  { id: '7', name: 'Karan Mehta', rollNo: 'CS007', className: '11-B', email: 'karan@school.com' },
  { id: '8', name: 'Diya Nair', rollNo: 'CS008', className: '11-B', email: 'diya@school.com' },
];

export function getStudents(): Student[] {
  const data = localStorage.getItem(STUDENTS_KEY);
  if (!data) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(defaultStudents));
    return defaultStudents;
  }
  return JSON.parse(data);
}

export function saveStudents(students: Student[]) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function getAttendance(): AttendanceRecord[] {
  const data = localStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveAttendance(records: AttendanceRecord[]) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
}

export function getClasses(): string[] {
  const students = getStudents();
  return [...new Set(students.map(s => s.className))].sort();
}
