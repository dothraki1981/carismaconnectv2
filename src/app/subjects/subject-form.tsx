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
import { Textarea } from "@/components/ui/textarea";
import type { Subject } from "@/lib/types";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
});

type SubjectFormProps = {
  onSubmit: (subject: Omit<Subject, 'id'> & { id?: string }) => Promise<void>;
  setOpen: (open: boolean) => void;
  subject?: Subject;
};

export function SubjectForm({ onSubmit, setOpen, subject }: SubjectFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: subject || {
      name: "",
      description: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  async function handleFormSubmit(values: z.infer<typeof formSchema>) {
    await onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Disciplina</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Cálculo I" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva brevemente a disciplina."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
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
