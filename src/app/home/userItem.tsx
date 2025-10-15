import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toastError } from '@/lib/toast';
import apiClient from '@/services/apiClient';
import { SearchUser } from '@/types/user';
import Image from 'next/image';
import { useState } from 'react';
import { FriendsTab } from './friendsTab';
import { useRouter } from 'next/navigation';
import AlertDialog from '@/components/alertDialog';

interface LoadingBtn {
  reject: boolean;
  accept: boolean;
  remove: boolean;
}
interface UserItemProps {
  user: SearchUser;
  updateUsers: () => void;
  tab: FriendsTab;
}

const UserItem = ({ user, updateUsers, tab }: UserItemProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState<LoadingBtn>({
    reject: false,
    accept: false,
    remove: false,
  });
  const [dialog, setDialog] = useState<boolean>(false);

  const handleReject = (requestId: number) => {
    setLoading((btns) => ({ ...btns, reject: true }));

    apiClient
      .delete(`/requests/${requestId}/reject`)
      .then(() => updateUsers())
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setLoading((btns) => ({ ...btns, reject: false })));
  };

  const handleAccept = (requestId: number) => {
    setLoading((btns) => ({ ...btns, accept: true }));

    apiClient
      .put(`/requests/${requestId}/accept`)
      .then(() => updateUsers())
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setLoading((btns) => ({ ...btns, accept: false })));
  };

  const handleRemoveFriend = () => {
    setLoading((load) => ({ ...load, removeFriend: true }));

    apiClient
      .delete(`/requests/${user?.requestId}/reject`)
      .then(() => updateUsers())
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => {
        setDialog(false);
        setLoading((load) => ({ ...load, remove: false }));
      });
  };

  return (
    <Card>
      <CardContent className="flex gap-10 items-center">
        <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden">
          <Image
            src={user.photoUrl}
            alt="Foto de Perfil"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-5 flex-1">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{user.displayName}</span>
            <div className="flex gap-2 items-center">
              <Image
                src={user.nationalityPhotoUrl}
                alt="Foto da nacionalidade"
                width={20}
                height={15}
                priority
                className="w-[20px] h-[15px]"
              />
              <span className="text-sm text-gray-500">@{user.name}</span>
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
              <>
                <Button variant="destructive" onClick={() => setDialog(true)}>
                  Desfazer Amizade
                </Button>
                <AlertDialog
                  open={dialog}
                  onOpenChange={() => setDialog(!dialog)}
                  title="Você tem certeza?"
                  description={`Tem certeza que deseja desfazer amizade com ${user.displayName}?`}
                  onContinue={handleRemoveFriend}
                  isLoading={loading.remove}
                />
              </>
            )}
            {tab === 'requests' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleAccept(user.requestId ?? 0)}
                  isLoading={loading.accept}
                >
                  Aceitar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(user.requestId ?? 0)}
                  isLoading={loading.reject}
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
