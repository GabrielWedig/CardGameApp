'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import apiClient from '@/services/apiClient';
import { toastError } from '@/lib/toast';
import Form from '@/components/form/form';
import Input from '@/components/form/input';
import { LoginForm, loginSchema } from './schema';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const setToken = (token: string) => {
    localStorage.setItem('accessToken', token);
    router.push('/');
  };

  const onSubmit = async (data: LoginForm) =>
    await apiClient
      .post('auth/login', data)
      .then((res) => setToken(res.data.accessToken))
      .catch((err) => toastError(err.response?.data?.message));

  return (
    <section className="flex flex-col justify-center items-center h-full gap-15 -mt-[100px]">
      <h1 className="text-5xl font-semibold">CardGame!</h1>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col">
        <Input name="name" label="Nome" placeholder="Digite seu nome" />
        <Input
          name="password"
          label="Senha"
          placeholder="Digite sua senha"
          type="password"
        />
        <Button type="submit" className="mt-2">
          Entrar
        </Button>
      </Form>
      <div className="flex gap-2">
        <span>Não tem uma conta?</span>
        <Link href={'register'} className="underline">
          Faça cadastro
        </Link>
      </div>
    </section>
  );
}
