import type { Student, Teacher, Subject, Class } from './types';

export const mockStudents: Student[] = [
  { id: '1', name: 'Ana Silva', cpf: '123.456.789-10', phone: '5511987654321' },
  { id: '2', name: 'Bruno Costa', cpf: '234.567.890-11', phone: '5521912345678' },
  { id: '3', name: 'Carlos Dias', cpf: '345.678.901-12', phone: '5531988887777' },
  { id: '4', name: 'Daniela Souza', cpf: '456.789.012-13', phone: '5541999998888' },
  { id: '5', name: 'Eduarda Lima', cpf: '567.890.123-14', phone: '5551976543210' },
];

export const mockTeachers: Teacher[] = [
  { id: 't1', name: 'Prof. Ricardo Alves', phone: '5511911112222' },
  { id: 't2', name: 'Profa. Mônica Santos', phone: '5521933334444' },
  { id: 't3', name: 'Prof. Fernando Lima', phone: '5531955556666' },
];

export const mockSubjects: Subject[] = [
  { id: 's1', name: 'Cálculo I', description: 'Introdução ao cálculo diferencial e integral.' },
  { id: 's2', name: 'Algoritmos e Estrutura de Dados', description: 'Conceitos fundamentais de algoritmos.' },
  { id: 's3', name: 'Física Quântica', description: 'Princípios da mecânica quântica.' },
  { id: 's4', name: 'Literatura Brasileira', description: 'Estudo dos principais autores e obras.' },
  { id: 's5', name: 'Inteligência Artificial', description: 'Fundamentos e aplicações de IA.' },
];

export const mockClasses: Class[] = [
    { id: 'c1', name: 'Engenharia A 2024.1', teacherId: 't1', subjectIds: ['s1', 's3'] },
    { id: 'c2', name: 'Ciência da Comp. B 2024.1', teacherId: 't2', subjectIds: ['s2', 's5'] },
    { id: 'c3', name: 'Letras C 2024.1', teacherId: 't3', subjectIds: ['s4'] },
];
