
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Settings, CreditCard, LifeBuoy, LogOut, BrainCircuit, FolderKanban } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Feature Forge - Dashboard',
  description: 'Manage your app ideas and generated assets.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-accent">
              <BrainCircuit className="h-7 w-7" />
              <span>Feature Forge</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://placehold.co/100x100.png?text=User" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Demo User</p>
              <p className="text-xs text-sidebar-foreground/70">pro@example.com</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={true}>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  My Projects
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#"> {/* Placeholder Link */}
                  <Settings />
                  Account Settings
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#"> {/* Placeholder Link */}
                  <CreditCard />
                  Subscription
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="#"> {/* Placeholder Link */}
                  <LifeBuoy />
                  Help & Support
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
