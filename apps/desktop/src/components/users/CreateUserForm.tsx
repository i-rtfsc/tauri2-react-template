import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const buildFormSchema = (t: (key: string, options?: any) => string) => z.object({
  username: z.string().min(2, t('users.form.validation.usernameMin')),
  email: z.union([
    z.string().email(t('users.form.validation.emailInvalid')),
    z.literal('')
  ]),
  role: z.string(),
});

type CreateUserFormValues = z.infer<ReturnType<typeof buildFormSchema>>;

interface CreateUserFormProps {
  onSuccess: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const { createUser } = useUsers();
  const { t } = useTranslation();
  const schema = useMemo(() => buildFormSchema(t), [t]);
  
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      role: 'user',
    },
  });

  const onSubmit = async (values: CreateUserFormValues) => {
    try {
      await createUser.mutateAsync(values);
      toast.success(t('users.form.success'));
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error(t('users.form.error'));
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.form.username')}</FormLabel>
              <FormControl>
                <Input placeholder={t('users.form.usernamePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.form.email')}</FormLabel>
              <FormControl>
                <Input placeholder={t('users.form.emailPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={createUser.isPending}>
            {createUser.isPending ? t('users.form.submitting') : t('users.form.submit')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
