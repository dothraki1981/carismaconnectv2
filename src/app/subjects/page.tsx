"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, MoreHorizontal, FilePen, Trash2 } from "lucide-react";
import { SubjectForm } from "./subject-form";
import { mockSubjects } from "@/lib/mock-data";
import type { Subject } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);

  const handleFormSubmit = (subject: Subject) => {
    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === subject.id ? subject : s));
    } else {
      setSubjects([...subjects, { ...subject, id: `s${subjects.length + 1}` }]);
    }
    setEditingSubject(undefined);
  };
  
  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject);
    setOpen(true);
  }
  
  const openNewDialog = () => {
    setEditingSubject(undefined);
    setOpen(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Disciplinas</CardTitle>
            <CardDescription>
              Gerencie as disciplinas oferecidas.
            </CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1" onClick={openNewDialog}>
              <PlusCircle className="h-4 w-4" />
              Adicionar Disciplina
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell className="text-muted-foreground">{subject.description}</TableCell>
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
                        <DropdownMenuItem onClick={() => openEditDialog(subject)}>
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
          <DialogTitle>{editingSubject ? "Editar Disciplina" : "Adicionar Disciplina"}</DialogTitle>
          <DialogDescription>
            {editingSubject ? "Atualize as informações da disciplina." : "Preencha os detalhes para cadastrar uma nova disciplina."}
          </DialogDescription>
        </DialogHeader>
        <SubjectForm
          onSubmit={handleFormSubmit}
          setOpen={setOpen}
          subject={editingSubject}
        />
      </DialogContent>
    </Dialog>
  );
}
