
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, MoreHorizontal, FilePen, Trash2, Phone } from "lucide-react";
import { TeacherForm } from "./teacher-form";
import type { Teacher, Subject } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | undefined>(undefined);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const qTeachers = query(collection(db, "teachers"));
    const unsubscribeTeachers = onSnapshot(qTeachers, (querySnapshot) => {
      const teachersData: Teacher[] = [];
      querySnapshot.forEach((doc) => {
        teachersData.push({ ...doc.data(), id: doc.id } as Teacher);
      });
      setTeachers(teachersData);
    });

    const qSubjects = query(collection(db, "subjects"));
    const unsubscribeSubjects = onSnapshot(qSubjects, (querySnapshot) => {
      const subjectsData: Subject[] = [];
      querySnapshot.forEach((doc) => {
        subjectsData.push({ ...doc.data(), id: doc.id } as Subject);
      });
      setSubjects(subjectsData);
    });

    return () => {
      unsubscribeTeachers();
      unsubscribeSubjects();
    }
  }, []);

  const getSubjectNames = (subjectIds: string[]) => {
    if (!subjectIds || subjectIds.length === 0) return <Badge variant="outline">N/A</Badge>;
    return subjectIds.map(id => {
      const subject = subjects.find(s => s.id === id);
      return subject ? <Badge key={id} variant="secondary" className="mr-1 mb-1">{subject.name}</Badge> : null;
    });
  }

  const handleSaveTeacher = async (teacherData: Omit<Teacher, 'id'> & { id?: string }) => {
    try {
      if (teacherData.id) { // Editing
        const teacherDocRef = doc(db, "teachers", teacherData.id);
        const { id, ...dataToUpdate } = teacherData;
        await updateDoc(teacherDocRef, dataToUpdate);
        toast({
          title: "Sucesso!",
          description: "Professor atualizado com sucesso.",
        });
      } else { // Adding
        const { id, ...dataToSave } = teacherData;
        await addDoc(collection(db, "teachers"), dataToSave);
        toast({
          title: "Sucesso!",
          description: "Professor cadastrado com sucesso.",
        });
      }
      setEditingTeacher(undefined);
      setOpen(false);
    } catch (error) {
       toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o professor.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTeacher = async () => {
    if (!deletingTeacher) return;
    try {
      await deleteDoc(doc(db, "teachers", deletingTeacher.id));
      toast({
        title: "Sucesso!",
        description: `Professor ${deletingTeacher.name} deletado com sucesso.`,
        variant: "destructive"
      });
      setDeletingTeacher(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao deletar o professor.",
        variant: "destructive",
      });
    }
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
    <>
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
                <TableHead>Disciplinas</TableHead>
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
                    <div className="flex flex-wrap">
                      {getSubjectNames(teacher.subjectIds)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {teacher.phone ? (
                      <a
                        href={`tel:${teacher.phone}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Phone className="h-4 w-4" />
                        {teacher.phone}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">N/A</span>
                    )}
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
                        <DropdownMenuItem onClick={() => setDeletingTeacher(teacher)} className="text-destructive focus:text-destructive">
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
          onSubmit={handleSaveTeacher}
          setOpen={setOpen}
          teacher={editingTeacher}
          subjects={subjects}
        />
      </DialogContent>
    </Dialog>

    <AlertDialog open={!!deletingTeacher} onOpenChange={(open) => !open && setDeletingTeacher(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá deletar permanentemente o professor <strong>{deletingTeacher?.name}</strong> do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingTeacher(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeacher} className={buttonVariants({ variant: "destructive" })}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
