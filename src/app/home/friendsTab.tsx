import Pagination from '@/components/pagination';
import TabItem from '@/components/tabItem';
import { Input } from '@/components/ui/input';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import UserItem from './userItem';
import apiClient from '@/services/apiClient';
import { useUserContext } from '@/context/userContext';
import { toastError } from '@/lib/toast';

type FriendsTab = 'friends' | 'requests' | 'find';

const FriendsTab = () => {
  const { user } = useUserContext();

  const [tab, setTab] = useState<FriendsTab>('friends');
  const [search, setSearch] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(0);

  const tabs = [
    { name: 'friends', label: 'Amigos' },
    { name: 'requests', label: 'Solicitações de amizade' },
    { name: 'find', label: 'Encontrar pessoas' },
  ];

  const limit = 50;

  useEffect(() => {
    apiClient
      .get(
        `users/${user?.id}?tab=${tab}&search=${search}&page=${page}&limit=${limit}`
      )
      .then((res) => setUsers(res.data))
      .catch((err) => toastError(err.response?.data?.message));
  }, [tab, search, page, user]);

  return (
    <>
      <div className="flex gap-5">
        {tabs.map((tb, idx) => (
          <TabItem
            key={idx}
            name={tb.label}
            onClick={() => setTab(tb.name as FriendsTab)}
            isActive={tab === tb.name}
          />
        ))}
        <Input
          placeholder="Busca por ID ou nome"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="w-[300px] ml-auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        {users.map((user) => (
          <UserItem key={user.id} {...user} />
        ))}
      </div>
      <Pagination
        page={page}
        qtdPages={20}
        onChange={(number) => setPage(number)}
      />
    </>
  );
};

export default FriendsTab;
