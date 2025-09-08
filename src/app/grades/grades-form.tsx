
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { mockStudents } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  studentId: z.string({ required_error: "Selecione um aluno." }),
  grade: z.coerce.number().min(0).max(10).optional(),
  recoveryGrade: z.coerce.number().min(0).max(10).optional(),
  examGrade: z.coerce.number().min(0).max(10).optional(),
  absences: z.coerce.number().int().min(0),
});

type FormData = z.infer<typeof formSchema>;

export function GradesForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      absences: 0,
      grade: undefined,
      recoveryGrade: undefined,
      examGrade: undefined,
    },
  });

  const { watch } = form;
  const grade = watch("grade");
  const recoveryGrade = watch("recoveryGrade");
  const examGrade = watch("examGrade");
  const absences = watch("absences");

  const showRecovery = grade !== undefined && grade < 7;
  const showExam = showRecovery && recoveryGrade !== undefined && recoveryGrade < 7;

  function onSubmit(values: FormData) {
    console.log("Submitting grades:", values);
    alert("Notas salvas com sucesso! (Verifique o console)");
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
    if (grade !== undefined && grade < 7 && !showRecovery) {
        return <Badge variant="destructive" className="text-sm">Em Recuperação</Badge>
    }
    
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
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
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nota</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="0.0 - 10.0" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
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
            control={form.control}
            name="recoveryGrade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary">Nota da Recuperação</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="0.0 - 10.0" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {showExam && (
          <FormField
            control={form.control}
            name="examGrade"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-destructive">Nota do Exame</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="0.0 - 10.0" {...field} value={field.value ?? ''} />
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
          <Button type="submit">Salvar Notas e Faltas</Button>
        </div>
      </form>
    </Form>
  );
}
