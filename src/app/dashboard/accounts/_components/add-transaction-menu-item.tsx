'use client';

import { useCreateTransactionDialog } from '@/app/_components/create-transaction-dialog-provider';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface AddTransactionMenuItemProps {
  accountId: string;
}

export function AddTransactionMenuItem({ accountId }: AddTransactionMenuItemProps) {
  const { openCreateTransactionDialog } = useCreateTransactionDialog();

  return (
    <DropdownMenuItem onSelect={() => openCreateTransactionDialog({ account: accountId })}>
      Add Transaction
    </DropdownMenuItem>
  );
}
