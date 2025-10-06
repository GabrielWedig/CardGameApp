import Pagination from '@/components/pagination';
import TabItem from '@/components/tabItem';
import { Input } from '@/components/ui/input';
import { SearchUser } from '@/types/user';
import { useEffect, useState } from 'react';
import UserItem from './userItem';
import apiClient from '@/services/apiClient';
import { useUserContext } from '@/context/userContext';
import { toastError } from '@/lib/toast';
import { Paginated } from '@/types/common';
import BoxLoader from '@/components/boxLoader';

interface FriendsTabProps {
  resetTab: () => void;
}

export type FriendsTab = 'friends' | 'requests' | 'find';

const FriendsTab = ({ resetTab }: FriendsTabProps) => {
  const { user } = useUserContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<FriendsTab>('friends');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [update, setUpdate] = useState<boolean>(false);
  const [users, setUsers] = useState<Paginated<SearchUser>>();

  const tabs = {
    friends: { label: 'Amigos', url: `users/${user?.id}/friends` },
    requests: {
      label: 'Solicitações de amizade',
      url: `users/${user?.id}/requests`,
    },
    find: { label: 'Encontrar pessoas', url: 'users' },
  };

  const limit = 50;
  const url = `${tabs[tab].url}?search=${search}&page=${page}&limit=${limit}`;

  useEffect(() => {
    setIsLoading(true);
    if (!user) return resetTab();

    apiClient
      .get(url)
      .then((res) => setUsers(res.data))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setIsLoading(false));
  }, [tab, search, page, user, update, resetTab, url]);

  const updateUsers = () => setUpdate((update) => !update);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          {Object.entries(tabs).map(([key, value], idx) => (
            <TabItem
              key={idx}
              name={value.label}
              onClick={() => setTab(key as FriendsTab)}
              isActive={tab === key}
            />
          ))}
        </div>
        <Input
          placeholder="Busca por ID ou nome"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="w-[300px]"
        />
      </div>
      <BoxLoader
        isLoading={isLoading}
        qtdData={users?.items.length ?? 0}
        className="flex flex-col gap-10"
      >
        <div className="grid grid-cols-2 gap-2">
          {users?.items.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              updateUsers={updateUsers}
              tab={tab}
            />
          ))}
        </div>
        <Pagination
          page={page}
          limit={limit}
          total={users?.total ?? 0}
          onChange={(number) => setPage(number)}
        />
      </BoxLoader>
    </>
  );
};

export default FriendsTab;
