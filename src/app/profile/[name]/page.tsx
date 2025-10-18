'use client';

import BoxLoader from '@/components/boxLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toastError, toastSuccess } from '@/lib/toast';
import apiClient from '@/services/apiClient';
import { UserProfile } from '@/types/user';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { Clock, Pen } from 'lucide-react';
import { Input as InputShad } from '@/components/ui/input';
import Form from '@/components/form/form';
import { useForm } from 'react-hook-form';
import { getEditSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/form/input';
import Textarea from '@/components/form/textarea';
import InputSearch from '@/components/form/inputSearch';
import z from 'zod';
import AlertDialog from '@/components/alertDialog';
import { useUserContext } from '@/context/userContext';
import { ImageType } from '@/types/common';

interface Loading {
  page: boolean;
  edit: boolean;
  excludeProfile: boolean;
  removeRequest: boolean;
  acceptRequest: boolean;
  request: boolean;
}

interface Dialog {
  removeRequest: boolean;
  excludeProfile: boolean;
}

const Profile = () => {
  const params = useParams();
  const name = params?.name as string;

  const { logout, setUserData } = useUserContext();
  const router = useRouter();

  const [loading, setLoading] = useState<Loading>({
    page: false,
    edit: false,
    excludeProfile: false,
    removeRequest: false,
    acceptRequest: false,
    request: false,
  });
  const [dialog, setDialog] = useState<Dialog>({
    removeRequest: false,
    excludeProfile: false,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>();
  const [updatedPhoto, setUpdatedPhoto] = useState<ImageType>();

  const editSchema = getEditSchema(user?.name ?? '');
  type EditForm = z.infer<typeof editSchema>;

  const form = useForm<EditForm>({
    resolver: zodResolver(editSchema),
  });
  const { reset } = form;

  useEffect(() => {
    setLoading((load) => ({ ...load, page: true }));

    apiClient
      .get(`/users/${name}/profile`)
      .then(({ data }) => {
        setUser(data);
        reset({
          about: data?.about,
          displayName: data?.displayName,
          name: data?.name,
        });
      })
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setLoading((load) => ({ ...load, page: false })));
  }, [name, update, reset]);

  const stats = [
    { Icon: Clock, label: `Desde ${user?.stats.since}` },
    // { Icon: Gamepad2, label: '322 jogos jogados' },
    // { Icon: SquareAsterisk, label: '1102 cards acertados' },
    // { Icon: Percent, label: 'Taxa de acerto 65%' },
    // { Icon: MapPin, label: 'Top #1 Brasil' },
    // { Icon: Earth, label: 'Top #23 Global' },
  ];

  const photo = isEditing
    ? updatedPhoto?.path ?? user?.photoUrl
    : user?.photoUrl;

  const onSubmit = async (data: EditForm) => {
    setLoading((load) => ({ ...load, edit: true }));

    const formData = new FormData();
    formData.append('about', data.about ?? '');
    formData.append('name', data.name ?? '');
    formData.append('displayName', data.displayName ?? '');
    formData.append('password', data.password ?? '');

    if (updatedPhoto?.file) {
      formData.append('photo', updatedPhoto.file);
    }

    apiClient
      .put(`/users/${user?.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        setUpdate(!update);
        setUserData();
        toastSuccess('Usuário atualizado');
      })
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setLoading((load) => ({ ...load, edit: false })));
  };

  const handleChangePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUpdatedPhoto({ path: URL.createObjectURL(file), file });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedPhoto(undefined);
    reset();
  };

  const handleExcludeProfile = () =>
    setDialog((dialog) => ({ ...dialog, excludeProfile: true }));

  const handleExcludeProfileChange = () =>
    setDialog((dialog) => ({
      ...dialog,
      excludeProfile: !dialog.excludeProfile,
    }));

  const handleRemoveFriend = () =>
    setDialog((dialog) => ({ ...dialog, removeRequest: true }));

  const handleRemoveFriendChange = () =>
    setDialog((dialog) => ({
      ...dialog,
      removeRequest: !dialog.removeRequest,
    }));

  const excludeProfile = () => {
    setLoading((load) => ({ ...load, excludeProfile: true }));

    apiClient
      .delete(`/users/${user?.id}`)
      .then(() => {
        logout();
        router.push('/');
      })
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => {
        setDialog((dialog) => ({ ...dialog, excludeProfile: false }));
        setLoading((load) => ({ ...load, excludeProfile: false }));
      });
  };

  const handleRemoveRequest = () => {
    setLoading((load) => ({ ...load, removeRequest: true }));

    apiClient
      .delete(`/requests/${user?.requestId}/reject`)
      .then(() => setUpdate(!update))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => {
        setDialog((dialog) => ({ ...dialog, excludeProfile: false }));
        setLoading((load) => ({ ...load, removeRequest: false }));
      });
  };

  const handleAcceptRequest = () => {
    setLoading((load) => ({ ...load, acceptRequest: true }));

    apiClient
      .put(`/requests/${user?.requestId}/accept`)
      .then(() => setUpdate(!update))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setLoading((load) => ({ ...load, acceptRequest: false })));
  };

  const handleRequest = () => {
    setLoading((load) => ({ ...load, request: true }));

    apiClient
      .post('/requests', { receiverId: user?.id })
      .then(() => setUpdate(!update))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setLoading((load) => ({ ...load, request: false })));
  };

  return (
    <BoxLoader
      isLoading={loading.page}
      hasData={!!user}
      className="min-h-full flex gap-20"
    >
      <div className="relative w-[350px] h-[350px] shrink-0">
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
              id="photoUpload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChangePhoto}
            />
            <label
              htmlFor="photoUpload"
              className="absolute bottom-5 right-5 bg-black/60 p-4 rounded-full transition-transform duration-300 hover:scale-110 hover:cursor-pointer shadow-md"
            >
              <Pen size={25} className="text-white" />
            </label>
          </>
        )}
      </div>
      {isEditing ? (
        <Form form={form} onSubmit={onSubmit}>
          <InputSearch
            name="name"
            label="Nome"
            placeholder="Digite seu nome único"
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
          />
          <div className="flex gap-2 mb-5">
            <Button variant="outline" type="button" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={loading.edit}>
              Confirmar Edição
            </Button>
          </div>
          {user?.me && (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={handleExcludeProfile}
              >
                Excluir Perfil
              </Button>
              <AlertDialog
                open={dialog.excludeProfile}
                onOpenChange={handleExcludeProfileChange}
                title="Você tem certeza?"
                description="Tem certeza que deseja excluir seu perfil?"
                onContinue={excludeProfile}
                isLoading={loading.excludeProfile}
              />
            </>
          )}
        </Form>
      ) : (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl">{user?.displayName}</h1>
            <div className="flex gap-2 items-center">
              <Image
                src={user?.nationalityImageUrl ?? ''}
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
              <Button
                variant="outline"
                onClick={handleRequest}
                isLoading={loading.request}
              >
                Solicitar Amizade
              </Button>
            )}
            {user?.requestedByMe && (
              <Button
                variant="outline"
                onClick={handleRemoveRequest}
                isLoading={loading.removeRequest}
              >
                Cancelar Solicitação
              </Button>
            )}
            {user?.friend && (
              <>
                <Button variant="destructive" onClick={handleRemoveFriend}>
                  Desfazer Amizade
                </Button>
                <AlertDialog
                  open={dialog.removeRequest}
                  onOpenChange={handleRemoveFriendChange}
                  title="Você tem certeza?"
                  description={`Tem certeza que deseja desfazer amizade com ${user.displayName}?`}
                  onContinue={handleRemoveRequest}
                  isLoading={loading.removeRequest}
                />
              </>
            )}
            {user?.me && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Editar Perfil
              </Button>
            )}
            {user?.requested && (
              <>
                <Button
                  variant="outline"
                  onClick={handleAcceptRequest}
                  isLoading={loading.acceptRequest}
                >
                  Aceitar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRemoveRequest}
                  isLoading={loading.removeRequest}
                >
                  Recusar
                </Button>
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
