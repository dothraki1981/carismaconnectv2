
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
import type { Teacher, Subject } from "@/lib/types";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  phone: z.string().optional(),
  subjectIds: z.array(z.string()).min(1, "Selecione pelo menos uma disciplina."),
});

type TeacherFormProps = {
  onSubmit: (teacher: Omit<Teacher, 'id'> & { id?: string }) => Promise<void>;
  setOpen: (open: boolean) => void;
  teacher?: Teacher;
  subjects: Subject[];
};

export function TeacherForm({ onSubmit, setOpen, teacher, subjects }: TeacherFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: teacher?.id,
      name: teacher?.name || "",
      phone: teacher?.phone || "",
      subjectIds: teacher?.subjectIds || [],
    },
  });

  const { formState: { isSubmitting }, control, setValue } = form;

  async function handleFormSubmit(values: z.infer<typeof formSchema>) {
    await onSubmit(values);
  }

  // This is a workaround to handle multi-select with shadcn's Select component
  const handleSubjectChange = (subjectId: string) => {
    const currentSubjectIds = control._getWatch("subjectIds") || [];
    const newSubjectIds = currentSubjectIds.includes(subjectId)
      ? currentSubjectIds.filter((id) => id !== subjectId)
      : [...currentSubjectIds, subjectId];
    setValue("subjectIds", newSubjectIds, { shouldValidate: true });
  };
  
  const selectedSubjects = subjects.filter(s => form.watch("subjectIds")?.includes(s.id));

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
                <Input placeholder="Nome completo do professor" {...field} />
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
              <FormLabel>Telefone (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="5511987654321" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={control}
          name="subjectIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplinas</FormLabel>
                <Select onValueChange={handleSubjectChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione as disciplinas" asChild>
                         <div className="flex flex-wrap gap-1">
                          {selectedSubjects.length > 0 ? selectedSubjects.map(s => (
                            <span key={s.id} className="bg-muted text-muted-foreground text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                              {s.name}
                            </span>
                          )) : "Selecione..."}
                        </div>
                      </SelectValue>
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
