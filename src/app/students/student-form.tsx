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
import type { Student } from "@/lib/types";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  cpf: z.string().refine(value => /^\d{11}$/.test(value.replace(/[^\d]/g, "")), {
    message: "O CPF deve conter 11 dígitos.",
  }),
  phone: z.string().min(10, "Telefone inválido."),
});

type StudentFormProps = {
  onSubmit: (student: Student) => void;
  setOpen: (open: boolean) => void;
  student?: Student;
};

export function StudentForm({ onSubmit, setOpen, student }: StudentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: student || {
      name: "",
      cpf: "",
      phone: "",
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const cleanedValues = {
        ...values,
        cpf: values.cpf.replace(/[^\d]/g, ""),
    };
    onSubmit(cleanedValues as Student);
    setOpen(false);
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
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
}
