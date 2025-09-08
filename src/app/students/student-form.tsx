
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Student, Class } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  cpf: z.string().refine(value => /^\d{11}$/.test(value.replace(/[^\d]/g, "")), {
    message: "O CPF deve conter 11 dígitos.",
  }),
  phone: z.string().min(10, "Telefone inválido."),
  classId: z.string({ required_error: "Selecione uma turma." }),
});

type StudentFormProps = {
  onSubmit: (student: Omit<Student, 'id'> & { id?: string }) => Promise<void>;
  setOpen: (open: boolean) => void;
  student?: Student;
  existingStudents: Student[];
  classes: Class[];
};

export function StudentForm({ onSubmit, setOpen, student, existingStudents, classes }: StudentFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: student || {
      name: "",
      cpf: "",
      phone: "",
      classId: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  async function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const cleanedCpf = values.cpf.replace(/\D/g, "");

    const isDuplicate = existingStudents.some(s => {
      const existingCpf = s.cpf.replace(/\D/g, "");
      // If editing, check against other students. If adding, check against all.
      return existingCpf === cleanedCpf && s.id !== values.id;
    });

    if (isDuplicate) {
      toast({
        title: "Erro de Validação",
        description: "Usuário já cadastrado com este CPF.",
        variant: "destructive",
      });
      return;
    }
    
    await onSubmit({ ...values, cpf: cleanedCpf });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="Apenas números" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone (WhatsApp)</FormLabel>
              <FormControl>
                <Input placeholder="5511987654321" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turma</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
