import { redirect } from 'next/navigation';

import { DataTableTest } from '@/app/dashboard/test/_components/data-table-test';
import { AccountHistoryCard } from '@/components/cards/account-history-card';
import { AccountsCard } from '@/components/cards/accounts-card';
import { AssetDistributionCard } from '@/components/cards/asset-distribution-card';
import { NetWorthDifferenceCard } from '@/components/cards/net-worth-difference-card';
import { NetWorthHistoryCard } from '@/components/cards/net-worth-history-card';
import { QuickActionsCard } from '@/components/cards/quick-actions-card/quick-actions-card';
import { RecentTransactionsCard } from '@/components/cards/recent-transactions-card';
import { PageContent, PageHeader, PageHeaderTitle, PageLayout } from '@/components/ui/page-layout';
import { getSimpleAccounts } from '@/lib/db/accounts.queries';
import { getMainCurrencyWithMapper } from '@/lib/db/currencies.queries';
import { getTransactionHistory, getTransactions } from '@/lib/db/transactions.queries';

export default async function TestPage() {
  if (process.env.NODE_ENV !== 'development') {
    redirect('/dashboard');
  }

  const [accounts, transactionHistory, transactions, { mainCurrency }] = await Promise.all([
    getSimpleAccounts(),
    getTransactionHistory('12 month', '1 month'),
    getTransactions(),
    getMainCurrencyWithMapper(),
  ]);

  return (
    <PageLayout>
      <PageHeader>
        <PageHeaderTitle>Test page</PageHeaderTitle>
      </PageHeader>

      <PageContent>
        <NetWorthHistoryCard data={transactionHistory} accounts={accounts} />

        {!!accounts[0] && <AccountHistoryCard data={transactionHistory} account={accounts[0]} />}

        <AssetDistributionCard accounts={accounts} mainCurrency={mainCurrency} />

        <NetWorthDifferenceCard data={transactionHistory} />

        <QuickActionsCard />

        <AccountsCard />

        <RecentTransactionsCard
          accounts={accounts}
          transactions={transactions.data}
          mainCurrency={mainCurrency}
        />

        <DataTableTest accounts={accounts} transactions={transactions} />
      </PageContent>
    </PageLayout>
  );
}
