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
import { mockTeachers, mockSubjects } from "@/lib/mock-data";
import type { Class } from "@/lib/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import React from 'react';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  teacherId: z.string({ required_error: "Selecione um professor." }),
  subjectIds: z.array(z.string()).min(1, "Selecione pelo menos uma disciplina."),
});

type ClassFormProps = {
  onSubmit: (classData: Class) => void;
  setOpen: (open: boolean) => void;
  classData?: Class;
};

export function ClassForm({ onSubmit, setOpen, classData }: ClassFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: classData || {
      name: "",
      teacherId: "",
      subjectIds: [],
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values as Class);
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
              <FormLabel>Professor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o professor responsável" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockTeachers.map((teacher) => (
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
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Disciplinas</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value?.length && "text-muted-foreground"
                      )}
                    >
                       {field.value?.length 
                        ? `${field.value.length} disciplina(s) selecionada(s)`
                        : "Selecione as disciplinas"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar disciplina..." />
                    <CommandEmpty>Nenhuma disciplina encontrada.</CommandEmpty>
                    <CommandGroup>
                      {mockSubjects.map((subject) => (
                        <CommandItem
                          key={subject.id}
                          onSelect={() => {
                            const selected = field.value || [];
                            const newSelection = selected.includes(subject.id)
                              ? selected.filter((id) => id !== subject.id)
                              : [...selected, subject.id];
                            field.onChange(newSelection);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              (field.value || []).includes(subject.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {subject.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
