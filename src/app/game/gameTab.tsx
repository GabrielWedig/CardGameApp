'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/form/input';
import RadioGroup from '@/components/form/radio';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/form/form';
import { EditGame } from '@/types/game';
import { GameForm, gameSchema } from './schema';
import { useEffect, useState } from 'react';
import BoxLoader from '@/components/boxLoader';
import apiClient from '@/services/apiClient';
import { toastError, toastSuccess } from '@/lib/toast';
import { useRouter } from 'next/navigation';

interface GameTabProps {
  isNew: boolean;
  id?: string;
}

interface Loading {
  page: boolean;
  edit: boolean;
  new: boolean;
}

const GameTab = ({ isNew, id }: GameTabProps) => {
  const router = useRouter();

  const [game, setGame] = useState<EditGame>();
  const [loading, setLoading] = useState<Loading>({
    page: false,
    edit: false,
    new: false,
  });

  const form = useForm<GameForm>({
    resolver: zodResolver(gameSchema),
  });

  useEffect(() => {
    if (!isNew) {
      setLoading((load) => ({ ...load, page: true }));

      apiClient
        .get(`games/${id}`)
        .then(({ data }) => {
          setGame(data);
          form.reset({ name: data.name, visibility: data.visibility });
        })
        .catch((err) => toastError(err.response?.data?.message))
        .finally(() => setLoading((load) => ({ ...load, page: false })));
    }
  }, [form, id, isNew]);

  const onNewSubmit = async (data: GameForm) => {
    setLoading((load) => ({ ...load, new: true }));

    apiClient
      .post('/games', data)
      .then(({ data }) => {
        router.push(`game/${data.id}`);
        toastSuccess('Jogo criado');
      })
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setLoading((load) => ({ ...load, new: false })));
  };

  const onEditSubmit = async (data: GameForm) => {
    setLoading((load) => ({ ...load, edit: true }));

    apiClient
      .put(`games/${id}`, data)
      .then(({ data }) => {
        router.push(`game/${data.id}`);
        toastSuccess('Jogo atualizado');
      })
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setLoading((load) => ({ ...load, edit: false })));
  };

  const visibilityOptions = [
    { value: 'public', label: 'Público' },
    { value: 'private', label: 'Privado' },
    { value: 'friends', label: 'Apenas amigos' },
  ];

  return (
    <BoxLoader hasData={isNew || !!game} isLoading={loading.page}>
      <Form
        form={form}
        onSubmit={isNew ? onNewSubmit : onEditSubmit}
        className="w-[20%]"
      >
        <Input
          name="name"
          label="Nome"
          placeholder="Insira um nome para o jogo"
        />
        <RadioGroup name="visibility" options={visibilityOptions} />
        <Button>{isNew ? 'Criar' : 'Editar'}</Button>
      </Form>
    </BoxLoader>
  );
};

export default GameTab;
