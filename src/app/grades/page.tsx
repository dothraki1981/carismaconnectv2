
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
import { mockSubjects, mockClasses } from "@/lib/mock-data";
import type { Class, Subject } from "@/lib/types";

export default function GradesPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedClassId(null); // Reset class selection when subject changes
  };

  const filteredClasses = selectedSubjectId
    ? mockClasses.filter(c => c.subjectIds?.includes(selectedSubjectId))
    : [];

  return (
    <div className="flex flex-col items-center gap-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Cadastro de Notas e Faltas</CardTitle>
          <CardDescription>
            Selecione a disciplina e a turma para registrar as notas e faltas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Disciplina</Label>
              <Select onValueChange={handleSubjectChange}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {mockSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="class">Turma</Label>
              <Select
                onValueChange={setSelectedClassId}
                disabled={!selectedSubjectId}
                value={selectedClassId ?? ""}
              >
                <SelectTrigger id="class">
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-class" disabled>
                      Nenhuma turma para esta disciplina
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 border-t pt-6">
             {selectedClassId ? (
                <GradesForm selectedClassId={selectedClassId} />
             ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>Por favor, selecione uma disciplina e uma turma para começar.</p>
                </div>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
