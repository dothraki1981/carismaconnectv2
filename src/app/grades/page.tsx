import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GradesForm } from "./grades-form";

export default function GradesPage() {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Cadastro de Notas e Faltas</CardTitle>
          <CardDescription>
            Selecione um aluno para registrar suas notas e faltas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GradesForm />
        </CardContent>
      </Card>
    </div>
  );
}
