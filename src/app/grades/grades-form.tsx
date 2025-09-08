
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Student, Grade, Subject } from "@/lib/types";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  subjectId: z.string({ required_error: "Selecione uma disciplina." }).min(1, "Selecione uma disciplina."),
  grade: z.coerce.number().min(0).max(10).optional(),
  recoveryGrade: z.coerce.number().min(0).max(10).optional(),
  examGrade: z.coerce.number().min(0).max(10).optional(),
  absences: z.coerce.number().int().min(0),
});

type FormData = z.infer<typeof formSchema>;

type GradesFormProps = {
  selectedStudentId: string;
  onSave: (grade: Grade) => void;
  studentGrades: Grade[];
  subjects: Subject[];
  student?: Student;
}

export function GradesForm({ selectedStudentId, onSave, studentGrades, subjects, student }: GradesFormProps) {
  const { toast } = useToast();
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

  const { watch, control, setValue } = form;
  const grade = watch("grade");
  const recoveryGrade = watch("recoveryGrade");
  const examGrade = watch("examGrade");
  const absences = watch("absences");
  const subjectId = watch("subjectId");

  const showRecovery = grade !== undefined && grade < 7;
  const showExam = showRecovery && recoveryGrade !== undefined && recoveryGrade < 7;
  
  // Effect to load existing grade data when a subject is selected
  useEffect(() => {
    if (subjectId) {
      const existingGrade = studentGrades.find(g => g.subjectId === subjectId);
      if (existingGrade) {
        setValue("grade", existingGrade.grade);
        setValue("recoveryGrade", existingGrade.recoveryGrade);
        setValue("examGrade", existingGrade.examGrade);
        setValue("absences", existingGrade.absences);
      } else {
        // Reset fields if switching to a subject with no grade data
        setValue("grade", undefined);
        setValue("recoveryGrade", undefined);
        setValue("examGrade", undefined);
        setValue("absences", 0);
      }
    }
  }, [subjectId, studentGrades, setValue]);


  function onSubmit(values: FormData) {
    if (!student) return;
    
    // Find the current grade to get an ID if it exists
    const existingGrade = studentGrades.find(g => g.subjectId === values.subjectId);
    
    const gradeData: Grade = {
      id: existingGrade?.id || `g${Date.now()}`, // Use existing ID or create a new one
      studentId: selectedStudentId,
      ...values,
    };

    onSave(gradeData);

    toast({
      title: "Sucesso!",
      description: `Notas de ${student.name} salvas para a disciplina selecionada.`,
      className: "bg-green-100 border-green-400 text-green-800",
    });
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
                  {subjects.map((subject) => (
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
          <Button type="submit" disabled={!subjectId}>Salvar Notas e Faltas</Button>
        </div>
      </form>
    </Form>
  );
}
