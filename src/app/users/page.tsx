
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
} from "@/components/ui/dialog";
import { MoreHorizontal, FilePen } from "lucide-react";
import { UserForm } from "./user-form";
import type { AppUser } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { db } from "@/lib/firebase";
import { ref, set } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeDatabaseCollection as useDbCollection } from "@/hooks/use-firestore-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const { data: users, loading, refresh: refreshUsers } = useDbCollection<AppUser>("users");
  
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | undefined>(undefined);
  const { toast } = useToast();

  const handleSaveUser = async (userData: AppUser) => {
    try {
      // For RTDB, the 'id' is the key of the object, which is the user's UID
      const userRef = ref(db, `users/${userData.id}`);
      await set(userRef, {
          displayName: userData.displayName,
          email: userData.email,
          role: userData.role
      });
      toast({
        title: "Sucesso!",
        description: "Usuário atualizado com sucesso.",
      });
      setEditingUser(undefined);
      setOpen(false);
      refreshUsers();
    } catch (error) {
       toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o usuário.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (user: AppUser) => {
    setEditingUser(user);
    setOpen(true);
  }

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return <Badge>admin</Badge>;
      case 'editor':
        return <Badge variant="secondary">editor</Badge>;
      default:
        return <Badge variant="outline">{role || 'N/A'}</Badge>;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Card>
          <CardHeader>
            <CardTitle>Usuários do Sistema</CardTitle>
            <CardDescription>
              Gerencie os usuários e suas permissões de acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Permissão</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            <Skeleton className="h-6 w-3/4 mx-auto" />
                        </TableCell>
                    </TableRow>
                ) : users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.displayName || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
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
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <FilePen className="mr-2 h-4 w-4" />
                            Editar Permissão
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && users.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            Nenhum usuário encontrado.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere a permissão de acesso do usuário.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UserForm
              onSubmit={handleSaveUser}
              setOpen={setOpen}
              user={editingUser}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
