'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/services/apiClient';
import Link from 'next/link';
import { useState } from 'react';

interface FormValues {
  name: string;
  password: string;
}

const Login = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    password: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await apiClient
      .post('auth/login', formValues)
      .then((res) => console.log(res.data.access_token));
  };

  return (
    <section className="flex flex-col justify-center items-center h-full gap-15 -mt-[100px]">
      <h1 className="text-5xl font-semibold">CardGame!</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label>Nome</label>
          <Input
            className="w-[300px]"
            onChange={(e) =>
              setFormValues((values) => ({ ...values, name: e.target.value }))
            }
            value={formValues.name}
          />
        </div>
        <div className="flex flex-col">
          <label>Senha</label>
          <Input
            className="w-[300px]"
            onChange={(e) =>
              setFormValues((values) => ({
                ...values,
                password: e.target.value,
              }))
            }
            value={formValues.password}
            type="password"
          />
        </div>
        <Button type="submit">Fazer Login</Button>
      </form>
      <div className="flex gap-2">
        <span>Ainda não tem uma conta?</span>
        <Link href={'register'} className="underline">
          Cadastre-se
        </Link>
      </div>
    </section>
  );
};

export default Login;
