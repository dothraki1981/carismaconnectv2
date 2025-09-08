
"use client";

import React, { useState, useEffect } from "react";
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
import { Button, buttonVariants } from "@/components/ui/button";
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
import type { Student, Class } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [open, setOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const qStudents = query(collection(db, "students"));
    const unsubscribeStudents = onSnapshot(qStudents, (querySnapshot) => {
      const studentsData: Student[] = [];
      querySnapshot.forEach((doc) => {
        studentsData.push({ ...doc.data(), id: doc.id } as Student);
      });
      setStudents(studentsData);
    });
    
    const qClasses = query(collection(db, "classes"));
    const unsubscribeClasses = onSnapshot(qClasses, (querySnapshot) => {
        const classesData: Class[] = [];
        querySnapshot.forEach((doc) => {
            classesData.push({ ...doc.data(), id: doc.id } as Class);
        });
        setClasses(classesData);
    });

    return () => {
      unsubscribeStudents();
      unsubscribeClasses();
    };
  }, []);

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || "Sem turma";
  }

  const formatCpf = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleSaveStudent = async (studentData: Omit<Student, 'id'> & { id?: string }) => {
    try {
      if (studentData.id) { // Editing
        const studentDocRef = doc(db, "students", studentData.id);
        const { id, ...dataToUpdate } = studentData;
        await updateDoc(studentDocRef, dataToUpdate);
        toast({
          title: "Sucesso!",
          description: "Aluno atualizado com sucesso.",
        });
      } else { // Adding
        await addDoc(collection(db, "students"), studentData);
        toast({
          title: "Sucesso!",
          description: "Aluno cadastrado com sucesso.",
        });
      }
      setEditingStudent(undefined);
      setOpen(false);
    } catch (error) {
       toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o aluno.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;
    try {
      await deleteDoc(doc(db, "students", deletingStudent.id));
      toast({
        title: "Sucesso!",
        description: `Aluno ${deletingStudent.name} deletado com sucesso.`,
        variant: "destructive"
      });
      setDeletingStudent(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao deletar o aluno.",
        variant: "destructive",
      });
    }
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
    <>
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
                  <TableHead>Turma</TableHead>
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
                      <Badge variant="outline">{formatCpf(student.cpf)}</Badge>
                    </TableCell>
                    <TableCell>{getClassName(student.classId)}</TableCell>
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
                          <DropdownMenuItem onClick={() => setDeletingStudent(student)} className="text-destructive focus:text-destructive">
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
            onSubmit={handleSaveStudent}
            setOpen={setOpen}
            student={editingStudent}
            existingStudents={students}
            classes={classes}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deletingStudent} onOpenChange={(open) => !open && setDeletingStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá deletar permanentemente o aluno <strong>{deletingStudent?.name}</strong> do banco de dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingStudent(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} className={buttonVariants({ variant: "destructive" })}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
