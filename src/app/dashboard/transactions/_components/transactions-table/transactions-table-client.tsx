'use client';

import { ReloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { AccountIcon } from '@/components/ui/account-avatar';
import { Button } from '@/components/ui/button';
import {
  DataTable,
  DataTableFilter,
  DataTableGlobalFilter,
  DataTablePagination,
  DataTableResetFilters,
  DataTableRowSelectionIndicator,
  useDataTable,
} from '@/components/ui/data-table';
import { deleteTransactions } from '@/lib/db/transactions.actions';
import { SimpleAccount } from '@/lib/types/accounts.types';
import { Transaction, TransactionWithAccount } from '@/lib/types/transactions.types';
import { ActionErrorCode, Paginated } from '@/lib/types/transport.types';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import { createToastPromise } from '@/lib/utils/toasts';

const columnHelper = createColumnHelper<TransactionWithAccount>();

const columns = [
  columnHelper.accessor((row) => row.startedDate, {
    id: 'date',
    header: 'Date',
    cell: ({ getValue }) => formatDateTime(getValue()),
  }),
  columnHelper.accessor((row) => row.account.name, {
    id: 'account',
    header: 'Account',
    cell: ({ getValue, row }) => (
      <div className="flex items-center">
        <AccountIcon category={row.original.account.category} className="w-4 h-4 mr-1" />
        <Link href={`/dashboard/accounts/${row.original.account.id}`}>{getValue()}</Link>
      </div>
    ),
    filterFn: 'arrIncludesSome',
  }),
  columnHelper.accessor('amount', {
    meta: { align: 'right' },
    header: 'Amount',
    cell: ({ row, getValue }) => formatCurrency(getValue(), row.original.account.currency),
  }),
];

interface TransactionsTableClientProps {
  accounts: SimpleAccount[];
  transactions: Paginated<Transaction>;
}

export function TransactionsTableClient({ accounts, transactions }: TransactionsTableClientProps) {
  const transactionsWithAccount = useMemo<TransactionWithAccount[]>(
    () =>
      transactions.data
        .map((transaction) => ({
          ...transaction,
          account: accounts.find((account) => account.subaccountId === transaction.subaccountId)!,
        }))
        .filter((transaction) => !!transaction.account),
    [transactions, accounts],
  );

  const accountOptions = useMemo(
    () =>
      accounts.map((account) => ({
        label: account.name,
        value: account.name,
      })),
    [accounts],
  );

  const table = useDataTable({
    columns,
    data: transactionsWithAccount,
    enablePagination: true,
    enableRowSelection: true,
    enableSorting: true,
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const selectedRowCount = table.getSelectedRowModel().rows.length;

  const deleteSelected = useCallback(async () => {
    setIsDeleting(true);
    const transactionIds = table.getSelectedRowModel().rows.map((row) => row.original.id);
    const promise = deleteTransactions(transactionIds);

    toast.promise(createToastPromise(promise), {
      loading: 'Deleting transactions...',
      success: 'Transactions deleted!',
      error: (error) =>
        error?.code === ActionErrorCode.NotLatestTransactions
          ? 'Failed to delete transactions. Only the most recent transactions can be deleted'
          : 'Failed to delete transactions. Please try again later.',
    });

    await promise;
    table.resetRowSelection();
    setIsDeleting(false);
  }, [table]);

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <DataTableGlobalFilter table={table} className="sm:w-[200px]" />
        <DataTableFilter
          column={table.getColumn('account')!}
          title="Account"
          options={accountOptions}
        />
        <DataTableResetFilters table={table} />
        <Button
          variant="destructive"
          className="h-8 px-2.5 ml-auto"
          onClick={deleteSelected}
          disabled={selectedRowCount === 0 || isDeleting}
        >
          {isDeleting ? (
            <ReloadIcon className="mr-2 animate-spin" />
          ) : (
            <TrashIcon className="mr-2" />
          )}
          Delete ({selectedRowCount})
        </Button>
      </div>

      <DataTable table={table} emptyMessage="No transactions." enableRowSelection />

      <div className="flex gap-x-4 gap-y-2 flex-col sm:flex-row sm:justify-between">
        <DataTableRowSelectionIndicator table={table} />
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
