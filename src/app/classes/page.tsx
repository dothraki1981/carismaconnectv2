
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, MoreHorizontal, FilePen, Trash2 } from "lucide-react";
import { ClassForm } from "./class-form";
import type { Class } from "@/lib/types";
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
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useFirestoreQuery } from "@/hooks/use-firestore-query";

export default function ClassesPage() {
  const classes = useFirestoreQuery<Class>("classes");
  const [open, setOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | undefined>(undefined);
  const [deletingClass, setDeletingClass] = useState<Class | null>(null);
  const { toast } = useToast();

  const handleSaveClass = async (classData: Omit<Class, 'id'> & { id?: string }) => {
    try {
      if (classData.id) { // Editing
        const classDocRef = doc(db, "classes", classData.id);
        const { id, ...dataToUpdate } = classData;
        await updateDoc(classDocRef, dataToUpdate);
        toast({
          title: "Sucesso!",
          description: "Turma atualizada com sucesso.",
        });
      } else { // Adding
        const { id, ...dataToSave } = classData;
        await addDoc(collection(db, "classes"), dataToSave);
        toast({
          title: "Sucesso!",
          description: "Turma cadastrada com sucesso.",
        });
      }
      setEditingClass(undefined);
      setOpen(false);
    } catch (error) {
      console.error("Error saving class: ", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a turma.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClass = async () => {
    if (!deletingClass) return;
    try {
      await deleteDoc(doc(db, "classes", deletingClass.id));
      toast({
        title: "Sucesso!",
        description: `Turma ${deletingClass.name} deletada com sucesso.`,
        variant: "destructive"
      });
      setDeletingClass(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao deletar a turma.",
        variant: "destructive",
      });
    }
  };
  
  const openEditDialog = (classData: Class) => {
    setEditingClass(classData);
    setOpen(true);
  }
  
  const openNewDialog = () => {
    setEditingClass(undefined);
    setOpen(true);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Turmas</CardTitle>
              <CardDescription>
                Gerencie as turmas do sistema.
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
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
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
                          <DropdownMenuItem onClick={() => setDeletingClass(c)} className="text-destructive focus:text-destructive">
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
            onSubmit={handleSaveClass}
            setOpen={setOpen}
            classData={editingClass}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deletingClass} onOpenChange={(open) => !open && setDeletingClass(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá deletar permanentemente a turma <strong>{deletingClass?.name}</strong> do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingClass(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClass} className={buttonVariants({ variant: "destructive" })}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
