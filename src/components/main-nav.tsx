
"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  UserSquare,
  School,
  BookOpen,
  ClipboardEdit,
  Sparkles,
  FileText,
  Users2
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: <LayoutDashboard /> },
  { href: "/students", label: "Alunos", icon: <Users /> },
  { href: "/teachers", label: "Professores", icon: <UserSquare /> },
  { href: "/classes", label: "Turmas", icon: <School /> },
  { href: "/subjects", label: "Disciplinas", icon: <BookOpen /> },
  { href: "/grades", label: "Notas e Faltas", icon: <ClipboardEdit /> },
  { href: "/reports", label: "Relatórios", icon: <FileText /> },
  { href: "/schedule-assistant", label: "Auxiliar IA", icon: <Sparkles /> },
  { href: "/users", label: "Usuários", icon: <Users2 /> },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/')}
            tooltip={item.label}
          >
            <Link href={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
