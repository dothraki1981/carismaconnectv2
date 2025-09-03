export interface Student {
  id: string;
  name: string;
  cpf: string;
  phone: string;
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
  subjectIds: string[];
}
