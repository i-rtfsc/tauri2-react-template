import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { UsersList } from '@/components/users/UsersList';
import { CreateUserForm } from '@/components/users/CreateUserForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function UsersPage() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <PageContainer
      title={t('users.title')}
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('users.actions.add')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('users.dialog.title')}</DialogTitle>
              <DialogDescription>
                {t('users.dialog.description')}
              </DialogDescription>
            </DialogHeader>
            <CreateUserForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      }
    >
      <UsersList />
    </PageContainer>
  );
}
