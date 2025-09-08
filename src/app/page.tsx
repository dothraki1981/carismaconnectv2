
"use client";

import { useFirestoreQuery } from "@/hooks/use-firestore-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  UserSquare,
  School,
  BookOpen,
} from "lucide-react";
import type { Student, Teacher, Class, Subject } from "@/lib/types";

export default function DashboardPage() {
  const students = useFirestoreQuery<Student>("students");
  const teachers = useFirestoreQuery<Teacher>("teachers");
  const classes = useFirestoreQuery<Class>("classes");
  const subjects = useFirestoreQuery<Subject>("subjects");

  const stats = [
    {
      title: "Total de Alunos",
      value: students.length,
      icon: <Users className="h-6 w-6 text-primary" />,
      description: "Alunos cadastrados no sistema.",
    },
    {
      title: "Total de Professores",
      value: teachers.length,
      icon: <UserSquare className="h-6 w-6 text-primary" />,
      description: "Professores cadastrados no sistema.",
    },
    {
      title: "Total de Turmas",
      value: classes.length,
      icon: <School className="h-6 w-6 text-primary" />,
      description: "Turmas abertas no sistema.",
    },
    {
      title: "Total de Disciplinas",
      value: subjects.length,
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Disciplinas disponíveis.",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
       <div className="text-left">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral e em tempo real das suas informações.</p>
        </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
