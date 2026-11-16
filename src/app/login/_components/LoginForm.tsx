'use client';

import { Button, Typography } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import PasswordInput from '@/components/ui/form/PasswordInput';
import TextInput from '@/components/ui/form/TextInput';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useTranslation } from '@/lib/hooks/useTranslation';
import useLogin from '@/services/auth/useLogin';

import { defaultLoginForm, loginFormSchema, LoginFormType } from '../_utils/login-schema';

const LoginForm = () => {
  const { t } = useTranslation();
  const { control, handleSubmit, setError } = useForm({
    defaultValues: defaultLoginForm,
    resolver: zodResolver(loginFormSchema),
  });

  const { mutate, isPending } = useLogin();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher variant="outlined" />
      </div>

      <form
        className="flex w-full items-center justify-center"
        onSubmit={handleSubmit((d) =>
          mutate(d, {
            onError(error) {
              const { message } = (error as any).response?.data || {};

              if (message && typeof message === 'object') {
                Object.keys(message).forEach((key) => {
                  setError(key as keyof LoginFormType, {
                    type: 'pattern',
                    message: message[key],
                  });
                });
              }
            },
          }),
        )}
      >
        <div className="flex w-full max-w-sm flex-col gap-4 px-12 md:px-0">
          <div>
            <Typography className="mb-2 font-semibold!" variant="h5">
              {t.auth.title}
            </Typography>
            <Typography variant="body1">
              {t.auth.subtitle}
            </Typography>
          </div>

          <TextInput control={control} name="email" label={t.auth.emailLabel} size="small" />
          <PasswordInput control={control} name="password" label={t.auth.passwordLabel} size="small" />

          <Button
            variant="contained"
            color="primary"
            className="py-2 text-lg"
            type="submit"
            loading={isPending}
          >
            {t.auth.loginBtn}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
