
export interface Student {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  classId: string;
}

export interface Teacher {
  id: string;
  name: string;
  phone?: string;
  subjectIds: string[];
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}

export interface Class {
  id: string;
  name: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  grade?: number | null;
  recoveryGrade?: number | null;
  examGrade?: number | null;
  absences: number;
}

export interface AppUser {
  id: string; // This was uid, now it's the generic id from the collection hook
  email: string | null;
  displayName: string | null;
  role?: 'admin' | 'editor'; // Role is optional now
}
