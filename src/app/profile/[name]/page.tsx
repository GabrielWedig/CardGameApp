'use client';

import BoxLoader from '@/components/boxLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toastError } from '@/lib/toast';
import apiClient from '@/services/apiClient';
import { UserProfile } from '@/types/user';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Gamepad2,
  SquareAsterisk,
  Percent,
  Earth,
  MapPin,
  Clock,
} from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const name = params?.name as string;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [user, setUser] = useState<UserProfile>();

  // useEffect(() => {
  //   setIsLoading(true);

  //   apiClient
  //     .get(`/users/profile?name=${name}`)
  //     .then((res) => setUser(res.data))
  //     .catch((err) => toastError(err.response?.data?.message))
  //     .finally(() => setIsLoading(false));
  // }, [name]);

  const user = {
    photo:
      'https://res.cloudinary.com/dqwif7teu/image/upload/v1758653165/users/vgvgxqncbaro2upu6lmw.png',
    displayName: 'Gabriel Garcia Wedig',
    name: 'gabriel',
    nacionalityPhoto:
      'https://res.cloudinary.com/dqwif7teu/image/upload/v1758654214/nationalities/lbbuszkxhkojzjpltj6v.png',
    level: 17,
  };

  const stats = [
    { Icon: Clock, label: 'Desde 2021' },
    { Icon: Gamepad2, label: '322 jogos jogados' },
    { Icon: SquareAsterisk, label: '1102 cards acertados' },
    { Icon: Percent, label: 'Taxa de acerto 65%' },
    { Icon: MapPin, label: 'Top #1 Brasil' },
    { Icon: Earth, label: 'Top #23 Global' },
  ];

  return (
    <BoxLoader
      className="py-10 min-h-full flex gap-20"
      isLoading={isLoading}
      hasData={true} //!!user}
    >
      <Image
        src={user?.photo ?? ''}
        alt="Foto de Perfil"
        width={350}
        height={350}
        priority
        className="w-[350px] h-[350px] rounded-full shadow-xl/5"
      />
      <div className="flex flex-col gap-5 w-full">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl">{user?.displayName}</h1>
            <div className="flex gap-2 items-center">
              <Image
                src={user?.nacionalityPhoto ?? ''}
                alt="Foto da nacionalidade"
                width={30}
                height={25}
                priority
                className="w-[20px] h-[15px]"
              />
              <span className="text text-gray-500">@{user?.name}</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text text-gray-500">Nível</span>
            <span className="text-4xl font-semibold">{user?.level}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Solicitar Amizade</Button>
          <Button variant="outline">Editar Perfil</Button>
          <Button variant="destructive">Excluir perfil</Button>
          <Button variant="outline">Aceitar</Button>
          <Button variant="destructive">Recusar</Button>
          <Button variant="destructive">Desfazer amizade</Button>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text text-gray-500">Sobre mim:</span>
          <span className="w-[70%]">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia
            distinctio, cumque corrupti numquam ex enim eligendi dignissimos quo
            eveniet magni, sapiente iure, quaerat reprehenderit quos ab tempore
            repellat cum temporibus!
          </span>
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
    </BoxLoader>
  );
};

export default Profile;
