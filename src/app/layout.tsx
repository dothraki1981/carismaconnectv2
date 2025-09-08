
"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
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
import { Separator } from "@/components/ui/separator";
import { MainNav } from "@/components/main-nav";
import { Header } from "@/components/header";
import { AppLogo } from "@/app/app-logo";
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import LoginPage from './login/page';
import "./globals.css";

// Metadata can't be exported from a client component. 
// We can handle the title dynamically if needed.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Use the imported auth instance directly
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        if (pathname === '/login') {
          router.replace('/');
        }
      } else {
        setUser(null);
        if (pathname !== '/login') {
          router.replace('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    // The onAuthStateChanged listener will handle the redirect
  };

  if (loading) {
    return (
      <html lang="pt-BR">
        <body>
          <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        </body>
      </html>
    );
  }

  if (!user && pathname !== '/login') {
     // This case should be handled by the redirect, but as a fallback
    return (
      <html lang="pt-BR">
        <body>
          <LoginPage />
          <Toaster />
        </body>
      </html>
    );
  }
  
  if (!user) {
    return (
       <html lang="pt-BR" suppressHydrationWarning>
        <head>
          <title>Login - Carisma Connect</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="font-body antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    )
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
         <title>Carisma Connect</title>
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
                <Button variant="ghost" className="w-full justify-start text-left" onClick={handleSignOut}>
                  <div className="flex w-full items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'Usuário'} data-ai-hint="person avatar" />
                      <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-sidebar-foreground truncate" title={user.email ?? ''}>
                        {user.email}
                      </span>
                      <span className="text-xs text-sidebar-foreground/70">
                        Sair
                      </span>
                    </div>
                  </div>
                </Button>
                <div className="text-center text-xs text-sidebar-foreground/50 pt-2">
                  Versão 2.3
                </div>
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
