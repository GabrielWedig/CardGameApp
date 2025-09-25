'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import apiClient from '@/services/apiClient';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FormValues {
  name: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  nationalityId: number;
}

// TODO: organizar melhor
interface Nationality {
  id: number;
  name: string;
}

const Register = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    nationalityId: 0,
  });
  const [nationalities, setNationalities] = useState<Nationality[]>([]);

  useEffect(() => {
    apiClient.get('nationalities').then((res) => setNationalities(res.data));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { confirmPassword, ...payload } = formValues;
    await apiClient.post('users', payload);
    //.then((res) => console.log(res.data.access_token));
  };

  // TODO: ver como passa query - catchs com toasts - input vermelho
  const validateName = async (value: string) =>
    await apiClient.get('user/validate-name').then((res) => res.data.isValid);

  const paswordMatch =
    formValues.password &&
    formValues.confirmPassword &&
    formValues.password === formValues.confirmPassword;

  return (
    <section className="flex flex-col justify-center items-center h-full gap-15 -mt-[100px]">
      <h1 className="text-5xl font-semibold">CardGame!</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-[300px]">
        <div className="flex flex-col">
          <label>Nome</label>
          <Input
            onChange={(e) => {
              //validateName(e.target.value);
              setFormValues((values) => ({ ...values, name: e.target.value }));
            }}
            value={formValues.name}
          />
        </div>
        <div className="flex flex-col">
          <label>Senha</label>
          <Input
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
        <div className="flex flex-col">
          <label>Confime sua senha</label>
          <Input
            onChange={(e) =>
              setFormValues((values) => ({
                ...values,
                confirmPassword: e.target.value,
              }))
            }
            value={formValues.confirmPassword}
            type="password"
          />
          {!paswordMatch && <span>As senhas não batem</span>}
        </div>
        <div className="flex flex-col">
          <label>Nome de exibição</label>
          <Input
            onChange={(e) =>
              setFormValues((values) => ({
                ...values,
                displayName: e.target.value,
              }))
            }
            value={formValues.displayName}
          />
        </div>
        <div className="flex flex-col">
          <label>Nacionalidade</label>
          <Select
            onValueChange={(value: string) =>
              setFormValues((values) => ({
                ...values,
                nationalityId: Number(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma nacionalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {nationalities.map((nationality) => (
                  <SelectItem
                    key={nationality.id}
                    value={String(nationality.id)}
                  >
                    {nationality.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Cadastre-se</Button>
      </form>
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
