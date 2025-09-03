import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { AssistantForm } from "./assistant-form";

export default function ScheduleAssistantPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Auxiliar de Agendamento IA</h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Deixe nossa IA encontrar o horário perfeito para suas aulas.
        </p>
      </div>

      <AssistantForm />
    </div>
  );
}
