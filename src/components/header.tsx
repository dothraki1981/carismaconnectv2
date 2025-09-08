
"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";

const getBreadcrumb = (pathname: string) => {
    const pathParts = pathname.split('/').filter(part => part && part !== 'login');
    if (pathParts.length === 0) return null;

    const breadcrumbs = pathParts.map((part, index) => {
        const href = '/' + pathParts.slice(0, index + 1).join('/');
        let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        
        const labelMap: { [key: string]: string } = {
            "Students": "Alunos",
            "Teachers": "Professores",
            "Classes": "Turmas",
            "Subjects": "Disciplinas",
            "Grades": "Notas e Faltas",
            "Reports": "Relatórios",
            "Schedule assistant": "Auxiliar IA",
            "Users": "Usuários",
        };

        label = labelMap[label] || label;

        const isLast = index === pathParts.length - 1;

        return (
            <React.Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                    )}
                </BreadcrumbItem>
            </React.Fragment>
        );
    });

    return breadcrumbs;
}


export function Header() {
  const pathname = usePathname();
  
  if (pathname === '/login') return null;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 no-print">
      <SidebarTrigger className="md:hidden" />
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {getBreadcrumb(pathname)}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
        {/* Future actions can go here */}
      </div>
    </header>
  );
}
