import { CubeIcon, IdCardIcon } from '@radix-ui/react-icons';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { CreateTransactionDialogProvider } from '@/app/_components/create-transaction-dialog-provider';
import { CreateTransactionDialogWrapper } from '@/app/_components/create-transaction-dialog-wrapper';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { createServerSupabaseClient } from '@/lib/utils/supabase/server';

import { AccountDropdown } from './_components/account-dropdown';
import { NavItem } from './_components/nav-item';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <CreateTransactionDialogProvider>
      <Suspense fallback={null}>
        <CreateTransactionDialogWrapper />
      </Suspense>
      <ResizablePanelGroup direction="horizontal" className="h-full min-h-screen items-stretch">
        <ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
          <div className="flex h-14 items-center justify-center px-2">
            <AccountDropdown user={user} />
          </div>
          <Separator />
          <nav className="flex flex-col gap-1 p-2">
            <NavItem href="/dashboard">
              <CubeIcon className="mr-2" /> Dashboard
            </NavItem>
            <NavItem href="/dashboard/accounts">
              <IdCardIcon className="mr-2" /> Accounts
            </NavItem>
          </nav>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80}>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </CreateTransactionDialogProvider>
  );
}
