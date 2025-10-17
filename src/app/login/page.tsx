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
import { useUserContext } from '@/context/userContext';
import { useState } from 'react';
import Container from '@/components/container';

export default function Login() {
  const router = useRouter();
  const { setUserData } = useUserContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const setToken = (token: string) => {
    localStorage.setItem('accessToken', token);
    router.push('/');
    setUserData();
  };

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    await apiClient
      .post('auth/login', data)
      .then((res) => setToken(res.data.accessToken))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <Container
      className="flex flex-col justify-center items-center h-full gap-15"
      ignoreHeader
    >
      <h1 className="text-5xl font-semibold">CardGame!</h1>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col w-[300px]">
        <Input name="name" label="Nome" placeholder="Digite seu nome" />
        <Input
          name="password"
          label="Senha"
          placeholder="Digite sua senha"
          type="password"
        />
        <Button type="submit" className="mt-2" isLoading={isLoading}>
          Entrar
        </Button>
      </Form>
      <div className="flex gap-2">
        <span>Não tem uma conta?</span>
        <Link href={'register'} className="underline">
          Faça cadastro
        </Link>
      </div>
    </Container>
  );
}
