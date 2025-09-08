
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
import { mockStudents } from "@/lib/mock-data";
import type { Student } from "@/lib/types";

export default function GradesPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

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
            <Select onValueChange={setSelectedStudentId}>
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
                <GradesForm selectedStudentId={selectedStudentId} />
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
