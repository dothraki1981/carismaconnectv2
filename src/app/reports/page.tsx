
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Printer, FileText } from "lucide-react";
import type { Grade, Student, Subject } from "@/lib/types";
import { useFirestoreCollection } from "@/hooks/use-firestore-query";

export default function ReportsPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  
  const { data: students } = useFirestoreCollection<Student>("students");
  const { data: subjects } = useFirestoreCollection<Subject>("subjects");
  const { data: grades } = useFirestoreCollection<Grade>("grades");

  const selectedSubject = useMemo(() => {
    return subjects.find((s) => s.id === selectedSubjectId) || null;
  }, [selectedSubjectId, subjects]);

  const reportData = useMemo(() => {
    if (!selectedSubjectId) return [];

    const gradesForSubject = grades.filter(
      (g) => g.subjectId === selectedSubjectId
    );
    return gradesForSubject.map((grade) => {
      const student = students.find((s) => s.id === grade.studentId);
      return {
        student,
        grade,
      };
    });
  }, [selectedSubjectId, grades, students]);

  const calculateFinalGrade = (grade: Grade) => {
    if (grade.examGrade !== undefined && grade.examGrade !== null)
      return grade.examGrade;
    if (grade.recoveryGrade !== undefined && grade.recoveryGrade !== null)
      return grade.recoveryGrade;
    return grade.grade;
  };

  const getGradeStatus = (grade: Grade) => {
    const finalGrade = calculateFinalGrade(grade);
    if (grade.absences > 7) {
      return <Badge variant="destructive">Reprovado por Falta</Badge>;
    }
    if (finalGrade === undefined || finalGrade === null)
      return <Badge variant="outline">Pendente</Badge>;
    if (finalGrade >= 7) {
      return <Badge className="bg-green-600 hover:bg-green-700">Aprovado</Badge>;
    }
    if (grade.grade !== undefined && grade.grade < 7) {
      if (grade.recoveryGrade !== undefined && grade.recoveryGrade !== null) {
        if (grade.recoveryGrade < 7) {
          if (grade.examGrade !== undefined && grade.examGrade !== null) {
            return grade.examGrade >= 7 ? (
              <Badge className="bg-green-600 hover:bg-green-700">Aprovado</Badge>
            ) : (
              <Badge variant="destructive">Reprovado</Badge>
            );
          }
          return <Badge variant="secondary">Em Exame</Badge>;
        }
        return <Badge className="bg-green-600 hover:bg-green-700">Aprovado</Badge>;
      }
      return <Badge variant="secondary">Em Recuperação</Badge>;
    }
    return <Badge variant="destructive">Reprovado</Badge>;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="no-print">
        <CardHeader>
          <CardTitle>Relatório de Alunos</CardTitle>
          <CardDescription>
            Filtre por disciplina para visualizar as notas e faltas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="subject">Disciplina</Label>
            <Select onValueChange={setSelectedSubjectId}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Selecione uma disciplina" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handlePrint} disabled={!selectedSubjectId}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir / Gerar PDF
          </Button>
        </CardContent>
      </Card>

      {selectedSubjectId && (
        <Card className="print-container">
          <CardHeader>
            <div className="print-header hidden">
                <h1>Relatório de Desempenho</h1>
                <p>Disciplina: {selectedSubject?.name}</p>
            </div>
            <div className="flex items-center gap-2 no-print">
              <FileText className="h-6 w-6" />
              <CardTitle>
                Resultado para:{" "}
                <span className="font-bold">{selectedSubject?.name}</span>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-center">Nota Final</TableHead>
                  <TableHead className="text-center">Faltas</TableHead>
                  <TableHead className="text-center">Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.length > 0 ? (
                  reportData.map(({ student, grade }) => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">
                        {student?.name || "Aluno não encontrado"}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {calculateFinalGrade(grade)?.toFixed(1) ?? "-"}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {grade.absences}
                      </TableCell>
                      <TableCell className="text-center">
                        {getGradeStatus(grade)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Nenhum dado encontrado para esta disciplina.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
