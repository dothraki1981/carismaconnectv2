"use client";

import { useForm } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Class, Teacher, Subject } from "@/lib/types";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  teacherId: z.string().optional(),
  subjectIds: z.array(z.string()).optional().default([]),
});

type ClassFormProps = {
  onSubmit: (classData: Omit<Class, 'id'> & { id?: string }) => Promise<void>;
  setOpen: (open: boolean) => void;
  classData?: Partial<Class>;
  teachers: Teacher[];
  subjects: Subject[];
};

export function ClassForm({ onSubmit, setOpen, classData, teachers, subjects }: ClassFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: classData?.id,
      name: classData?.name || "",
      teacherId: classData?.teacherId || "",
      subjectIds: classData?.subjectIds || [],
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
              <FormLabel>Nome da Turma</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Engenharia A 2024.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professor Responsável</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um professor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subjectIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Disciplinas</FormLabel>
                <FormDescription>
                  Selecione as disciplinas que pertencem a esta turma.
                </FormDescription>
              </div>
              <div className="space-y-2">
              {subjects.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="subjectIds"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              </div>
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
