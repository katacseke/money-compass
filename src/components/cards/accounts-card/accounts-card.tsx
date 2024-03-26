import { AccountAvatar } from '@/components/ui/account-avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleAccount } from '@/lib/types/accounts.types';
import { formatCurrency } from '@/lib/utils/formatters';

import { AccountActionsDropdown } from './account-actions-dropdown';
import { CreateAccountButton } from './create-account-button';
import { NoAccountsPlaceholder } from './no-accounts-placeholder';

interface AccountsCardProps {
  accounts: SimpleAccount[];
}

export async function AccountsCard({ accounts }: AccountsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between space-y-0">
        <div>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>All accounts you have.</CardDescription>
        </div>
        <CreateAccountButton />
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.map((account) => (
          <div key={account.id} className="flex items-center gap-4">
            <AccountAvatar category={account.category} />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{account.name}</p>
              <p className="text-sm text-muted-foreground">
                <span className="uppercase">{account.currency}</span>
                {' • '}
                <span className="capitalize">{account.category}</span>
              </p>
            </div>
            <div className="ml-auto font-bold">
              {formatCurrency(account.balance, account.currency)}
            </div>
            <AccountActionsDropdown account={account} />
          </div>
        ))}
        {!accounts.length && <NoAccountsPlaceholder />}
      </CardContent>
    </Card>
  );
}
