'use server';

import { CreateTransactionDialog } from '@/app/_components/create-transaction-dialog';
import { getSimpleAccounts } from '@/lib/db/accounts';

export async function CreateTransactionDialogWrapper() {
  const accounts = await getSimpleAccounts();

  return <CreateTransactionDialog accounts={accounts} />;
}
