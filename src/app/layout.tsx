import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { MainNav } from "@/components/main-nav";
import { Header } from "@/components/header";
import { AppLogo } from "@/app/app-logo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carisma Connect",
  description: "Sistema de gestão educacional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="no-print">
            <Sidebar>
              <SidebarHeader>
                <div className="flex items-center gap-3">
                  <AppLogo className="size-8 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold tracking-tighter text-sidebar-foreground">
                      Carisma Connect
                    </span>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <MainNav />
              </SidebarContent>
              <SidebarFooter>
                <Separator className="my-2 bg-sidebar-border" />
                <Button variant="ghost" className="w-full justify-start text-left">
                  <div className="flex w-full items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarImage src="https://picsum.photos/100" alt="Usuário" data-ai-hint="person avatar" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-sidebar-foreground">
                        Usuário
                      </span>
                      <span className="text-xs text-sidebar-foreground/70">
                        Sair
                      </span>
                    </div>
                  </div>
                </Button>
              </SidebarFooter>
            </Sidebar>
          </div>
          <SidebarInset>
            <Header />
            <main className="flex-1 p-4 sm:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
