import { notFound } from 'next/navigation';

import { AccountDetailsCard } from '@/components/cards/account-details-card';
import { AccountHistoryCard } from '@/components/cards/account-history-card';
import { RecentTransactionsCard } from '@/components/cards/recent-transactions-card';
import { PageHeader, PageHeaderTitle } from '@/components/ui/page-header';
import { mainCurrency } from '@/lib/constants';
import { getSimpleAccount } from '@/lib/db/accounts.queries';
import { getCurrencyMapper } from '@/lib/db/currencies.queries';
import { getTransactionHistory, getTransactions } from '@/lib/db/transactions.queries';

import { AccountActionButtons } from './components/account-action-buttons';

interface AccountDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function AccountDetailsPage({ params }: AccountDetailsPageProps) {
  const [account, transactionHistory, currencyMapper] = await Promise.all([
    getSimpleAccount(params.id),
    getTransactionHistory('12 month', '1 month'),
    getCurrencyMapper(mainCurrency),
  ]);

  if (!account) {
    notFound();
  }

  const transactions = await getTransactions({ subaccountId: account?.subaccountId, pageSize: 5 });

  return (
    <main>
      <PageHeader>
        <PageHeaderTitle>{account.name}</PageHeaderTitle>
        <AccountActionButtons account={account} />
      </PageHeader>

      <div className="m-4 flex flex-col gap-4">
        <AccountDetailsCard account={account} />
        <AccountHistoryCard
          data={transactionHistory}
          account={account}
          title="Transaction history (past 12 months)"
        />
        <RecentTransactionsCard
          accounts={[account]}
          transactions={transactions.data}
          currencyMapper={currencyMapper}
        />
      </div>
    </main>
  );
}
