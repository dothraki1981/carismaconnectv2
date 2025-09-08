
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GradesForm } from "./grades-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockStudents, mockGrades, mockSubjects } from "@/lib/mock-data";
import type { Grade } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function GradesPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [grades, setGrades] = useState<Grade[]>(mockGrades);

  const handleSaveGrade = (gradeData: Grade) => {
    const existingGradeIndex = grades.findIndex(
      g => g.studentId === gradeData.studentId && g.subjectId === gradeData.subjectId
    );

    let updatedGrades;
    if (existingGradeIndex > -1) {
      updatedGrades = [...grades];
      updatedGrades[existingGradeIndex] = gradeData;
    } else {
      updatedGrades = [...grades, gradeData];
    }
    setGrades(updatedGrades);
  };

  const getGradesForStudent = (studentId: string | null) => {
    if (!studentId) return [];
    return grades.filter(g => g.studentId === studentId);
  }

  const getStudentName = (studentId: string) => {
    return mockStudents.find(s => s.id === studentId)?.name || 'N/A';
  }

  const getSubjectName = (subjectId: string) => {
    return mockSubjects.find(s => s.id === subjectId)?.name || 'N/A';
  }

  const calculateFinalGrade = (grade: Grade) => {
    if (grade.examGrade !== undefined && grade.examGrade !== null) return grade.examGrade;
    if (grade.recoveryGrade !== undefined && grade.recoveryGrade !== null) return grade.recoveryGrade;
    return grade.grade;
  }

  const getGradeStatus = (grade: Grade) => {
    const finalGrade = calculateFinalGrade(grade);
    
    if (grade.absences > 7) {
        return <Badge variant="destructive">Reprovado por Falta</Badge>;
    }
    
    if (finalGrade === undefined || finalGrade === null) return <Badge variant="outline">Pendente</Badge>;
    
    if (finalGrade >= 7) {
        return <Badge className="bg-green-600 hover:bg-green-700">Aprovado</Badge>
    }
    
    // Check recovery/exam flow
    if (grade.grade !== undefined && grade.grade < 7) {
        if (grade.recoveryGrade !== undefined && grade.recoveryGrade !== null) {
            if (grade.recoveryGrade < 7) {
                 if (grade.examGrade !== undefined && grade.examGrade !== null) {
                    return grade.examGrade >= 7 ? <Badge className="bg-green-600 hover:bg-green-700">Aprovado</Badge> : <Badge variant="destructive">Reprovado</Badge>;
                 }
                 return <Badge variant="secondary">Em Exame</Badge>
            }
             return <Badge className="bg-green-600 hover:bg-green-700">Aprovado</Badge>
        }
        return <Badge variant="secondary">Em Recuperação</Badge>
    }
    
    return <Badge variant="destructive">Reprovado</Badge>;
  }


  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cadastro de Notas e Faltas</CardTitle>
          <CardDescription>
            Selecione o aluno para registrar as notas e faltas por disciplina.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="student">Aluno</Label>
            <Select onValueChange={setSelectedStudentId} value={selectedStudentId ?? ""}>
              <SelectTrigger id="student" className="max-w-sm">
                <SelectValue placeholder="Selecione um aluno" />
              </SelectTrigger>
              <SelectContent>
                {mockStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 border-t pt-6">
             {selectedStudentId ? (
                <GradesForm 
                  key={selectedStudentId}
                  selectedStudentId={selectedStudentId} 
                  onSave={handleSaveGrade}
                  studentGrades={getGradesForStudent(selectedStudentId)}
                />
             ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>Por favor, selecione um aluno para começar.</p>
                </div>
             )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notas e Faltas Lançadas</CardTitle>
          <CardDescription>
            Resumo de todas as notas e faltas registradas no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead className="text-center">Nota Final</TableHead>
                <TableHead className="text-center">Faltas</TableHead>
                <TableHead className="text-center">Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.length > 0 ? (
                grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{getStudentName(grade.studentId)}</TableCell>
                    <TableCell>{getSubjectName(grade.subjectId)}</TableCell>
                    <TableCell className="text-center font-mono">
                      {calculateFinalGrade(grade)?.toFixed(1) ?? "-"}
                    </TableCell>
                    <TableCell className="text-center font-mono">{grade.absences}</TableCell>
                    <TableCell className="text-center">{getGradeStatus(grade)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhuma nota lançada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
