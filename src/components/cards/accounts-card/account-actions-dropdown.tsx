import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SimpleAccount } from '@/lib/types/accounts.types';

import { AddTransactionMenuItem } from './add-transaction-menu-item';
import { DeleteAccountMenuItem } from './delete-account-menu-item';
import { EditAccountMenuItem } from './edit-account-menu-item';

interface AccountActionsDropdownProps {
  account: SimpleAccount;
  className?: string;
}

export function AccountActionsDropdown({ account, className }: AccountActionsDropdownProps) {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className={className}>
              <DotsHorizontalIcon className="w-4 h-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Actions</TooltipContent>
      </Tooltip>
      <DropdownMenuContent>
        <EditAccountMenuItem account={account} />
        <AddTransactionMenuItem accountId={account.id} />
        <DropdownMenuSeparator />
        <DeleteAccountMenuItem accountId={account.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
