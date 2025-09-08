
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockSubjects, mockStudents } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Student, Subject } from "@/lib/types";

const formSchema = z.object({
  subjectId: z.string({ required_error: "Selecione uma disciplina." }),
  grade: z.coerce.number().min(0).max(10).optional(),
  recoveryGrade: z.coerce.number().min(0).max(10).optional(),
  examGrade: z.coerce.number().min(0).max(10).optional(),
  absences: z.coerce.number().int().min(0),
});

type FormData = z.infer<typeof formSchema>;

type GradesFormProps = {
  selectedStudentId: string | null;
}

export function GradesForm({ selectedStudentId }: GradesFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: "",
      absences: 0,
      grade: undefined,
      recoveryGrade: undefined,
      examGrade: undefined,
    },
  });

  const { watch, control, reset } = form;
  const grade = watch("grade");
  const recoveryGrade = watch("recoveryGrade");
  const examGrade = watch("examGrade");
  const absences = watch("absences");

  const showRecovery = grade !== undefined && grade < 7;
  const showExam = showRecovery && recoveryGrade !== undefined && recoveryGrade < 7;
  
  const student = mockStudents.find(s => s.id === selectedStudentId);

  function onSubmit(values: FormData) {
    console.log("Submitting grades for student", selectedStudentId, ":", values);
    alert(`Notas salvas para ${student?.name} na disciplina selecionada! (Verifique o console)`);
    reset();
  }

  const getAbsenceStatus = () => {
    if (absences > 7) {
      return (
        <Badge variant="destructive" className="text-sm">
          Reprovado por Falta
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-600 hover:bg-green-700 text-sm">
        Frequência Aprovada
      </Badge>
    );
  };
  
  const getGradeStatus = () => {
    let finalGrade = grade;
    if (showRecovery && recoveryGrade !== undefined) finalGrade = recoveryGrade;
    if (showExam && examGrade !== undefined) finalGrade = examGrade;
    
    if (finalGrade === undefined) return null;

    if (finalGrade >= 7) {
        return <Badge className="bg-green-600 hover:bg-green-700 text-sm">Aprovado</Badge>
    }
    if (showExam && examGrade !== undefined && examGrade < 7) {
        return <Badge variant="destructive" className="text-sm">Reprovado</Badge>
    }
    if (showRecovery && recoveryGrade !== undefined && recoveryGrade < 7 && !showExam) {
         return <Badge variant="destructive" className="text-sm">Em Exame</Badge>
    }
    if (grade !== undefined && grade < 7 && !recoveryGrade) {
        return <Badge variant="destructive" className="text-sm">Em Recuperação</Badge>
    }
    
    return null;
  }
  
  if (!student) {
    return <p className="text-center text-muted-foreground">Aluno não encontrado.</p>;
  }

  return (
    <Form {...form}>
      <h3 className="text-lg font-semibold mb-4">Lançando Notas para: {student.name}</h3>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma disciplina" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO: In a real app, this should list only subjects the student is enrolled in */}
                  {mockSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nota</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="0.0 - 10.0" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="absences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faltas</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Nº de faltas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showRecovery && (
          <FormField
            control={control}
            name="recoveryGrade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Nota da Recuperação</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="0.0 - 10.0" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {showExam && (
          <FormField
            control={control}
            name="examGrade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-destructive">Nota do Exame</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="0.0 - 10.0" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Card className="mt-6 bg-muted/50">
            <CardHeader>
                <CardTitle className="text-lg">Situação do Aluno</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Frequência:</span>
                    {getAbsenceStatus()}
                </div>
                 <div className="flex items-center gap-2">
                    <span className="font-medium">Nota:</span>
                    {getGradeStatus()}
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={!selectedStudentId}>Salvar Notas e Faltas</Button>
        </div>
      </form>
    </Form>
  );
}
