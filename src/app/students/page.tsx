"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, MoreHorizontal, FilePen, Trash2, Phone } from "lucide-react";
import { StudentForm } from "./student-form";
import { mockStudents } from "@/lib/mock-data";
import type { Student } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [open, setOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);

  const handleAddStudent = (student: Student) => {
    if(editingStudent) {
        setStudents(students.map(s => s.id === student.id ? student : s));
    } else {
        setStudents([...students, { ...student, id: (students.length + 1).toString() }]);
    }
    setEditingStudent(undefined);
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setOpen(true);
  }
  
  const openNewDialog = () => {
    setEditingStudent(undefined);
    setOpen(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Alunos</CardTitle>
            <CardDescription>
              Gerencie os alunos cadastrados no sistema.
            </CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1" onClick={openNewDialog}>
              <PlusCircle className="h-4 w-4" />
              Adicionar Aluno
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone (WhatsApp)</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.cpf}</Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://wa.me/${student.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="h-4 w-4 text-green-500" />
                      {student.phone}
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
                        <DropdownMenuItem onClick={() => openEditDialog(student)}>
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
          <DialogTitle>{editingStudent ? 'Editar Aluno' : 'Adicionar Aluno'}</DialogTitle>
          <DialogDescription>
            {editingStudent ? 'Atualize as informações do aluno.' : 'Preencha os detalhes para cadastrar um novo aluno.'}
          </DialogDescription>
        </DialogHeader>
        <StudentForm
          onSubmit={handleAddStudent}
          setOpen={setOpen}
          student={editingStudent}
        />
      </DialogContent>
    </Dialog>
  );
}
