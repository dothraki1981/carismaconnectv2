"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, MoreHorizontal, FilePen, Trash2, Phone } from "lucide-react";
import { TeacherForm } from "./teacher-form";
import { mockTeachers } from "@/lib/mock-data";
import type { Teacher } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [open, setOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | undefined>(undefined);

  const handleFormSubmit = (teacher: Teacher) => {
    if(editingTeacher) {
      setTeachers(teachers.map(t => t.id === teacher.id ? teacher : t));
    } else {
      setTeachers([...teachers, { ...teacher, id: `t${teachers.length + 1}` }]);
    }
    setEditingTeacher(undefined);
  };
  
  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setOpen(true);
  }
  
  const openNewDialog = () => {
    setEditingTeacher(undefined);
    setOpen(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Professores</CardTitle>
            <CardDescription>
              Gerencie os professores cadastrados no sistema.
            </CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1" onClick={openNewDialog}>
              <PlusCircle className="h-4 w-4" />
              Adicionar Professor
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>
                    <a
                      href={`tel:${teacher.phone}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="h-4 w-4" />
                      {teacher.phone}
                    </a>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(teacher)}>
                          <FilePen className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingTeacher ? "Editar Professor" : "Adicionar Professor"}</DialogTitle>
          <DialogDescription>
            {editingTeacher ? "Atualize as informações do professor." : "Preencha os detalhes para cadastrar um novo professor."}
          </DialogDescription>
        </DialogHeader>
        <TeacherForm
          onSubmit={handleFormSubmit}
          setOpen={setOpen}
          teacher={editingTeacher}
        />
      </DialogContent>
    </Dialog>
  );
}
