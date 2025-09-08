
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
import { mockStudents, mockGrades } from "@/lib/mock-data";
import type { Student, Grade } from "@/lib/types";

export default function GradesPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [grades, setGrades] = useState<Grade[]>(mockGrades);

  // This function will be passed to the form to update the state
  const handleSaveGrade = (gradeData: Grade) => {
    // Check if a grade for this student and subject already exists
    const existingGradeIndex = grades.findIndex(
      g => g.studentId === gradeData.studentId && g.subjectId === gradeData.subjectId
    );

    let updatedGrades;
    if (existingGradeIndex > -1) {
      // Update existing grade
      updatedGrades = [...grades];
      updatedGrades[existingGradeIndex] = gradeData;
    } else {
      // Add new grade
      updatedGrades = [...grades, gradeData];
    }
    setGrades(updatedGrades);

    // In a real app, you would also update your database here.
    console.log("Updated grades list:", updatedGrades);
  };

  const getGradesForStudent = (studentId: string | null) => {
    if (!studentId) return [];
    return grades.filter(g => g.studentId === studentId);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Card className="w-full max-w-2xl">
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
              <SelectTrigger id="student">
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
                  key={selectedStudentId} // Add key to re-render form on student change
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
    </div>
  );
}
