"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, MoreHorizontal, FilePen, Trash2 } from "lucide-react";
import { ClassForm } from "./class-form";
import { mockClasses, mockTeachers, mockSubjects } from "@/lib/mock-data";
import type { Class } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [open, setOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | undefined>(undefined);

  const handleFormSubmit = (classData: Class) => {
    if (editingClass) {
      setClasses(classes.map(c => c.id === classData.id ? classData : c));
    } else {
      setClasses([...classes, { ...classData, id: `c${classes.length + 1}` }]);
    }
    setEditingClass(undefined);
  };
  
  const openEditDialog = (classData: Class) => {
    setEditingClass(classData);
    setOpen(true);
  }
  
  const openNewDialog = () => {
    setEditingClass(undefined);
    setOpen(true);
  }

  const getTeacherName = (teacherId: string) => mockTeachers.find(t => t.id === teacherId)?.name || 'N/A';
  const getSubjectNames = (subjectIds: string[]) => {
    return subjectIds.map(id => mockSubjects.find(s => s.id === id)?.name).filter(Boolean);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Turmas</CardTitle>
            <CardDescription>
              Gerencie as turmas e suas associações.
            </CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1" onClick={openNewDialog}>
              <PlusCircle className="h-4 w-4" />
              Adicionar Turma
            </Button>
          </DialogTrigger>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Turma</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Disciplinas</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{getTeacherName(c.teacherId)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getSubjectNames(c.subjectIds).map(name => <Badge key={name} variant="secondary">{name}</Badge>)}
                    </div>
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
                        <DropdownMenuItem onClick={() => openEditDialog(c)}>
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
          <DialogTitle>{editingClass ? "Editar Turma" : "Adicionar Turma"}</DialogTitle>
          <DialogDescription>
             {editingClass ? "Atualize as informações da turma." : "Preencha os detalhes para cadastrar uma nova turma."}
          </DialogDescription>
        </DialogHeader>
        <ClassForm
          onSubmit={handleFormSubmit}
          setOpen={setOpen}
          classData={editingClass}
        />
      </DialogContent>
    </Dialog>
  );
}
