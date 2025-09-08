"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, MoreHorizontal, FilePen, Trash2 } from "lucide-react";
import { SubjectForm } from "./subject-form";
import type { Subject } from "@/lib/types";
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
} from "@/components/ui/alert-dialog";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "subjects"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const subjectsData: Subject[] = [];
      querySnapshot.forEach((doc) => {
        subjectsData.push({ ...doc.data(), id: doc.id } as Subject);
      });
      setSubjects(subjectsData);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveSubject = async (subjectData: Omit<Subject, 'id'> & { id?: string }) => {
    try {
      if (subjectData.id) { // Editing
        const subjectDocRef = doc(db, "subjects", subjectData.id);
        const { id, ...dataToUpdate } = subjectData;
        await updateDoc(subjectDocRef, dataToUpdate);
        toast({
          title: "Sucesso!",
          description: "Disciplina atualizada com sucesso.",
        });
      } else { // Adding
        await addDoc(collection(db, "subjects"), subjectData);
        toast({
          title: "Sucesso!",
          description: "Disciplina cadastrada com sucesso.",
        });
      }
      setEditingSubject(undefined);
      setOpen(false);
    } catch (error) {
       toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a disciplina.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubject = async () => {
    if (!deletingSubject) return;
    try {
      await deleteDoc(doc(db, "subjects", deletingSubject.id));
      toast({
        title: "Sucesso!",
        description: `Disciplina ${deletingSubject.name} deletada com sucesso.`,
        variant: "destructive"
      });
      setDeletingSubject(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao deletar a disciplina.",
        variant: "destructive",
      });
    }
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
    <>
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
                          <DropdownMenuItem onClick={() => setDeletingSubject(subject)} className="text-destructive focus:text-destructive">
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
            onSubmit={handleSaveSubject}
            setOpen={setOpen}
            subject={editingSubject}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingSubject} onOpenChange={(open) => !open && setDeletingSubject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá deletar permanentemente a disciplina <strong>{deletingSubject?.name}</strong> do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingSubject(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSubject} className={buttonVariants({ variant: "destructive" })}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
