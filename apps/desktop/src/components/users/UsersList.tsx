import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { User, useUsers } from '@/hooks/useUsers';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Need Badge component
// If not exists, I'll create a simple one inline or use a span for now, but better create it.

export function UsersList() {
  const { users, isLoading, deleteUser } = useUsers();
  const { t } = useTranslation();

  const columns: ColumnDef<User>[] = useMemo(() => [
    {
      accessorKey: 'username',
      header: t('users.table.columns.user'),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.username}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: t('users.table.columns.role'),
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: t('users.table.columns.joined'),
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t('users.table.actions.openMenu')}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  deleteUser.mutateAsync(user.id)
                    .then(() => toast.success(t('users.table.actions.deleteSuccess')))
                    .catch((e) => toast.error(t('users.table.actions.deleteError', { message: String(e) })));
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                {t('users.table.actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [deleteUser, t]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">{t('users.table.loading')}</div>;
  }

  return (
    <DataTable columns={columns} data={users || []} searchKey="username" />
  );
}
