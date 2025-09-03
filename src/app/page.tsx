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
  CalendarDays,
} from "lucide-react";
import { DashboardCharts } from "@/components/dashboard-charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total de Alunos",
    value: "1,254",
    icon: <Users className="h-6 w-6 text-primary" />,
    change: "+12% vs. mês passado",
  },
  {
    title: "Total de Professores",
    value: "82",
    icon: <UserSquare className="h-6 w-6 text-primary" />,
    change: "+5% vs. mês passado",
  },
  {
    title: "Total de Turmas",
    value: "45",
    icon: <School className="h-6 w-6 text-primary" />,
    change: "+2 turmas novas",
  },
  {
    title: "Total de Disciplinas",
    value: "68",
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    change: "+3 disciplinas novas",
  },
];

const schedule = [
  { time: "08:00 - 09:30", subject: "Cálculo I", class: "Engenharia A", room: "B-101" },
  { time: "08:00 - 09:30", subject: "Algoritmos", class: "Ciência da Comp. B", room: "Lab 3" },
  { time: "10:00 - 11:30", subject: "Física Quântica", class: "Física A", room: "C-205" },
  { time: "10:00 - 11:30", subject: "Literatura Brasileira", class: "Letras C", room: "A-112" },
  { time: "14:00 - 15:30", subject: "Inteligência Artificial", class: "Ciência da Comp. D", room: "Lab 5" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Alunos por Turma</CardTitle>
            <CardDescription>
              Distribuição de alunos nas turmas mais populares.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardCharts />
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-6 w-6" />
              <CardTitle>Aulas de Hoje</CardTitle>
            </div>
            <CardDescription>
              Horários das aulas agendadas para hoje.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horário</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Turma</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.time}</TableCell>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell>
                       <Badge variant="outline">{item.class}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
