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

  const tabs = [
    { name: 'friends', label: 'Amigos' },
    { name: 'requests', label: 'Solicitações de amizade' },
    { name: 'find', label: 'Encontrar pessoas' },
  ];

  const limit = 50;
  const isAccepted = tab === 'friends';
  const findTab = tab === 'find';
  const urlFilters = `search=${search}&page=${page}&limit=${limit}`;
  const url = findTab
    ? `users?${urlFilters}`
    : `requests?isAccepted=${isAccepted}&${urlFilters}`;

  useEffect(() => {
    setIsLoading(true);
    if (!user) return resetTab();

    apiClient
      .get(url)
      .then((res) => setUsers(res.data))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setIsLoading(false));
  }, [tab, search, page, user, url, update, resetTab]);

  const updateUsers = () => setUpdate((update) => !update);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          {tabs.map((tb, idx) => (
            <TabItem
              key={idx}
              name={tb.label}
              onClick={() => setTab(tb.name as FriendsTab)}
              isActive={tab === tb.name}
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
