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
  new: boolean;
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
    new: false,
    reject: false,
    accept: false,
  });

  const handleNew = () => {
    setIsLoading((btns) => ({ ...btns, new: true }));

    apiClient
      .post(`/requests`, { receiverId: user.id })
      .then(() => updateUsers())
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setIsLoading((btns) => ({ ...btns, new: false })));
  };

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

  const showRejectBtn = tab === 'friends' || user.isFriend;
  const showRequestBtn = tab === 'find' && !user.requestId;
  const showAnswerBtns =
    tab === 'requests' || (user.canAnswer && !user.isFriend);
  const showCancelBtn =
    tab === 'find' && user.requestId && !user.isFriend && !user.canAnswer;

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
              <span className="text-sm text-gray-500">@{user.name}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Nível</span>
              <span className="text-lg font-semibold">{user.level}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Link href={`profile/${user.name}`}>
              <Button
                variant="outline"
                onClick={() => router.push(`profile/${user.id}`)}
              >
                Ver perfil
              </Button>
            </Link>
            {showRejectBtn && (
              <Button
                variant="destructive"
                onClick={() => handleReject(user.requestId ?? 0)}
                isLoading={isLoading.reject}
              >
                Desfazer amizade
              </Button>
            )}
            {showAnswerBtns && (
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
            {showRequestBtn && (
              <Button
                variant="outline"
                onClick={handleNew}
                isLoading={isLoading.new}
              >
                Solicitar amizade
              </Button>
            )}
            {showCancelBtn && (
              <Button
                variant="destructive"
                onClick={() => handleReject(user.requestId ?? 0)}
                isLoading={isLoading.reject}
              >
                Cancelar solicitação
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserItem;
