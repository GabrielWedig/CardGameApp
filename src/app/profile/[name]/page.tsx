'use client';

import BoxLoader from '@/components/boxLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toastError } from '@/lib/toast';
import apiClient from '@/services/apiClient';
import { UserProfile } from '@/types/user';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { Clock, Pen } from 'lucide-react';
import { Input as InputShad } from '@/components/ui/input';
import { uploadImage } from '@/services/cloudinaryClient';
import Form from '@/components/form/form';
import { useForm } from 'react-hook-form';
import { EditForm, editSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/form/input';
import Textarea from '@/components/form/textarea';

interface Loading {
  page: boolean;
  edit: boolean;
}

const Profile = () => {
  const params = useParams();
  const name = params?.name as string;

  const [isLoading, setIsLoading] = useState<Loading>({
    page: false,
    edit: false,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>();
  const [updatedPhoto, setUpdatedPhoto] = useState<string>();

  useEffect(() => {
    setIsLoading((load) => ({ ...load, page: true }));

    apiClient
      .get(`/users/${name}/profile`)
      .then((res) => setUser(res.data))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setIsLoading((load) => ({ ...load, page: false })));
  }, [name, update]);

  const stats = [
    { Icon: Clock, label: `Desde ${user?.stats.since}` },
    // { Icon: Gamepad2, label: '322 jogos jogados' },
    // { Icon: SquareAsterisk, label: '1102 cards acertados' },
    // { Icon: Percent, label: 'Taxa de acerto 65%' },
    // { Icon: MapPin, label: 'Top #1 Brasil' },
    // { Icon: Earth, label: 'Top #23 Global' },
  ];

  const form = useForm<EditForm>({
    resolver: zodResolver(editSchema),
  });

  const photo = isEditing ? updatedPhoto ?? user?.photo : user?.photo;
  const { reset, clearErrors, setError, getValues, control } = form;

  const onSubmit = async (data: EditForm) => {
    setIsLoading((load) => ({ ...load, edit: true }));
    const payload = { about: data?.about, photo };

    if (data?.file) {
      const url = await uploadImage(data?.file, 'usersPreset')
        .then((res) => res.data.secure_url)
        .catch((err) => toastError(err.response?.data?.message))
        .finally(() => setIsLoading((load) => ({ ...load, edit: false })));

      console.log(url);
    }

    setUpdate(!update);
  };

  const validateName = async (name: string) =>
    await apiClient
      .get(`users/validate-name?name=${name}`)
      .then((res) =>
        res.data.isValid
          ? clearErrors('name')
          : setError('name', { message: 'Este nome já está em uso' })
      )
      .catch((err) => toastError(err.response?.data?.message));

  const matchPassword = (password: string) =>
    password === getValues('password')
      ? clearErrors('confirmPassword')
      : setError('confirmPassword', {
          message: 'As senhas não coincidem',
        });

  const handleChangePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUpdatedPhoto(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedPhoto(undefined);
    reset();
  };

  return (
    <BoxLoader
      className="py-10 min-h-full flex gap-20"
      isLoading={isLoading.page}
      hasData={!!user}
    >
      <div className="relative block w-[350px] h-[350px] shrink-0">
        <Image
          src={photo ?? ''}
          alt="Foto de Perfil"
          fill
          priority
          sizes="350px"
          className="object-cover rounded-full shadow-xl/5"
        />
        {isEditing && (
          <>
            <InputShad
              id="photo-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleChangePhoto(e)}
            />
            <label
              htmlFor="photo-upload"
              className="absolute bottom-5 right-5 bg-black/60 p-4 rounded-full transition-transform duration-300 hover:scale-110 hover:cursor-pointer shadow-md"
            >
              <Pen size={25} className="text-white" />
            </label>
          </>
        )}
      </div>
      {isEditing ? (
        <Form form={form} onSubmit={onSubmit}>
          <Input
            name="name"
            label="Nome"
            placeholder="Digite seu nome único"
            onChange={validateName}
          />
          <Input
            name="displayName"
            label="Nome de exibição"
            placeholder="Digite seu nome"
          />
          <Textarea
            name="about"
            label="Sobre"
            placeholder="Digite algo sobre você"
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
            onChange={matchPassword}
          />
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">Confirmar Edição</Button>
          </div>
        </Form>
      ) : (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl">{user?.displayName}</h1>
            <div className="flex gap-2 items-center">
              <Image
                src={user?.nationalityPhoto ?? ''}
                alt="Foto da nacionalidade"
                width={30}
                height={25}
                priority
                className="w-[20px] h-[15px]"
              />
              <span className="text text-gray-500">@{user?.name}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {user?.canRequest && (
              <Button variant="outline">Solicitar Amizade</Button>
            )}
            {user?.requestedByMe && (
              <Button variant="outline">Cancelar Solicitação</Button>
            )}
            {user?.friend && (
              <Button variant="destructive">Desfazer Amizade</Button>
            )}
            {user?.me && (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </Button>
                <Button variant="destructive">Excluir Perfil</Button>
              </>
            )}
            {user?.requested && (
              <>
                <Button variant="outline">Aceitar</Button>
                <Button variant="destructive">Recusar</Button>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <span className="text text-gray-500">Sobre mim:</span>
            <span className="w-[70%]">{user?.about ?? 'Nada por aqui.'}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text text-gray-500">Estatísticas:</span>
            <div className="flex flex-col gap-2">
              {stats.map((stat, idx) => (
                <Card key={idx} className="py-1 w-max">
                  <CardContent className="flex gap-1 justify-center items-center px-3">
                    <stat.Icon size={15} />
                    <span className="text-sm">{stat.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </BoxLoader>
  );
};

export default Profile;
