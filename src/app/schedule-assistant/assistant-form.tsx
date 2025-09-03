"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  intelligentSchedulingAssistant,
  type IntelligentSchedulingAssistantOutput,
} from "@/ai/flows/intelligent-scheduling-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarCheck, BrainCircuit } from "lucide-react";

const initialState: IntelligentSchedulingAssistantOutput | { error: string } | null = null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Otimizando...
        </>
      ) : (
        "Sugerir Horário"
      )}
    </Button>
  );
}

export function AssistantForm() {
  const [state, formAction] = useFormState(
    async (
      prevState: typeof initialState,
      formData: FormData
    ): Promise<typeof initialState> => {
      try {
        const result = await intelligentSchedulingAssistant({
          professorAvailability: formData.get("professorAvailability") as string,
          resourceAllocation: formData.get("resourceAllocation") as string,
          classRequirements: formData.get("classRequirements") as string,
        });
        return result;
      } catch (e: any) {
        return { error: e.message || "An unknown error occurred." };
      }
    },
    initialState
  );

  return (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Informações para Agendamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="professorAvailability">
                Disponibilidade do Professor
              </Label>
              <Textarea
                id="professorAvailability"
                name="professorAvailability"
                placeholder="Ex: Seg-Sex 08:00-12:00, Ter/Qui 14:00-18:00"
                defaultValue="Professor Aníbal está livre nas segundas e quartas pela manhã (8h-12h) e nas sextas à tarde (14h-18h)."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resourceAllocation">Alocação de Recursos</Label>
              <Textarea
                id="resourceAllocation"
                name="resourceAllocation"
                placeholder="Ex: Sala B-102 (50 lugares), Laboratório de Química (equipado)"
                defaultValue="A turma necessita de um laboratório de informática com pelo menos 20 computadores. O laboratório 3 está disponível nas segundas de manhã e sextas à tarde."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classRequirements">Requisitos da Aula</Label>
              <Textarea
                id="classRequirements"
                name="classRequirements"
                placeholder="Ex: 2 encontros por semana, 1h30 de duração cada"
                defaultValue="A disciplina de 'Inteligência Artificial' precisa de duas aulas semanais de 1h30 cada."
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      <div className="space-y-6">
        {state && "error" in state && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Erro</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{state.error}</p>
            </CardContent>
          </Card>
        )}
        {state && "suggestedSchedule" in state && (
          <>
            <Card className="bg-primary/5 border-primary">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <CalendarCheck className="h-6 w-6 text-primary" />
                <CardTitle>Horário Sugerido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-lg">{state.suggestedSchedule}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <BrainCircuit className="h-6 w-6 text-muted-foreground" />
                <CardTitle>Raciocínio da IA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{state.reasoning}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
