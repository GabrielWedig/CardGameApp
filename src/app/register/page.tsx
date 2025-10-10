'use client';

import { Button } from '@/components/ui/button';
import { toastError } from '@/lib/toast';
import apiClient from '@/services/apiClient';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RegisterForm, registerSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Nationality } from '@/types/nationality';
import Input, { ChangeInputParams } from '@/components/form/input';
import Select from '@/components/form/select';
import Form from '@/components/form/form';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext';
import InputSearch from '@/components/form/inputSearch';
import { validateName, matchPassword } from './validation';

const Register = () => {
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setUserData } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    apiClient
      .get('nationalities')
      .then((res) => setNationalities(res.data))
      .catch((err) => toastError(err.response?.data?.message));
  }, []);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    criteriaMode: 'all',
  });

  const { watch } = form;
  const confirmValue = watch('confirmPassword');

  const setToken = (token: string) => {
    localStorage.setItem('accessToken', token);
    router.push('/');
    setUserData();
  };

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    const { confirmPassword, ...payload } = data;

    await apiClient
      .post('users', payload)
      .then((res) => setToken(res.data.accessToken))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <section className="flex flex-col justify-center items-center h-full gap-15 -mt-[100px]">
      <h1 className="text-5xl font-semibold">CardGame!</h1>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col w-[300px]">
        <InputSearch
          name="name"
          label="Nome"
          placeholder="Digite seu nome único"
          onSearch={validateName}
        />
        <Input
          name="displayName"
          label="Nome de exibição"
          placeholder="Digite seu nome"
        />
        <Input
          name="password"
          label="Senha"
          placeholder="Digite sua senha"
          type="password"
        />
        <Input
          name="confirmPassword"
          label="Confirme sua senha"
          placeholder="Digite sua senha novamente"
          type="password"
          onChange={(params: ChangeInputParams) =>
            matchPassword(params, confirmValue)
          }
        />
        <Select
          name="nationalityId"
          label="Nacionalidade"
          options={nationalities.map((n) => ({ value: n.id, label: n.name }))}
          placeholder="Selecione uma nacionalidade"
        />
        <Button type="submit" className="mt-2" isLoading={isLoading}>
          Cadastre-se
        </Button>
      </Form>
      <div className="flex gap-2">
        <span>Já tem uma conta?</span>
        <Link href={'login'} className="underline">
          Faça login
        </Link>
      </div>
    </section>
  );
};

export default Register;
