import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toastError } from '@/lib/toast';
import apiClient from '@/services/apiClient';
import { SearchUser } from '@/types/user';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FriendsTab } from './friendsTab';
import { useRouter } from 'next/navigation';

interface LoadingBtn {
  reject: boolean;
  accept: boolean;
}
interface UserItemProps {
  user: SearchUser;
  updateUsers: () => void;
  tab: FriendsTab;
}

const UserItem = ({ user, updateUsers, tab }: UserItemProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<LoadingBtn>({
    reject: false,
    accept: false,
  });

  const handleReject = (requestId: number) => {
    setIsLoading((btns) => ({ ...btns, reject: true }));

    apiClient
      .delete(`/requests/${requestId}/reject`)
      .then(() => updateUsers())
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setIsLoading((btns) => ({ ...btns, reject: false })));
  };

  const handleAccept = (requestId: number) => {
    setIsLoading((btns) => ({ ...btns, accept: true }));

    apiClient
      .put(`/requests/${requestId}/accept`)
      .then(() => updateUsers())
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setIsLoading((btns) => ({ ...btns, accept: false })));
  };

  return (
    <Card>
      <CardContent className="flex gap-10 items-center">
        <Image
          src={user.photo}
          alt="Foto de Perfil"
          width={100}
          height={100}
          priority
          className="w-[100px] h-[100px] rounded-full"
        />
        <div className="flex flex-col gap-5 flex-1">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{user.displayName}</span>
              <div className="flex gap-2 items-center">
                <Image
                  src={user.nacionalityPhoto}
                  alt="Foto da nacionalidade"
                  width={20}
                  height={15}
                  priority
                  className="w-[20px] h-[15px]"
                />
                <span className="text-sm text-gray-500">@{user.name}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Nível</span>
              <span className="text-lg font-semibold">{user.level}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`profile/${user.name}`)}
            >
              Ver perfil
            </Button>
            {tab === 'friends' && (
              <Button
                variant="destructive"
                onClick={() => handleReject(user.requestId ?? 0)}
                isLoading={isLoading.reject}
              >
                Desfazer amizade
              </Button>
            )}
            {tab === 'requests' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleAccept(user.requestId ?? 0)}
                  isLoading={isLoading.accept}
                >
                  Aceitar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(user.requestId ?? 0)}
                  isLoading={isLoading.reject}
                >
                  Recusar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserItem;
