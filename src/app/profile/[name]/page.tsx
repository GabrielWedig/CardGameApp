'use client';

import BoxLoader from '@/components/boxLoader';
import { toastError } from '@/lib/toast';
import apiClient from '@/services/apiClient';
import { UserProfile } from '@/types/user';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Profile = () => {
  const params = useParams();
  const name = params?.name as string;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>();

  useEffect(() => {
    setIsLoading(true);

    apiClient
      .get(`/users/profile?name=${name}`)
      .then((res) => setUser(res.data))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setIsLoading(false));
  }, [name]);

  return (
    <BoxLoader
      className="py-10 min-h-full"
      isLoading={isLoading}
      hasData={!!user}
    >
      <Image
        src={user?.photo ?? ''}
        alt="Foto de Perfil"
        width={300}
        height={300}
        priority
        className="w-[300px] h-[300px] rounded-full"
      />
    </BoxLoader>
  );
};

export default Profile;
