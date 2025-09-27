'use client';

import GameItem from '@/app/game/[id]/gameItem';
import { Input } from '@/components/ui/input';
import { useUserContext } from '@/context/userContext';
import { toastError } from '@/lib/toast';
import apiClient from '@/services/apiClient';
import { Game } from '@/types/game';
import { BasicUser } from '@/types/user';
import { useEffect, useState } from 'react';
import UserItem from './userItem';
import TabItem from '@/components/ui/tabItem';

type SocialTab = 'friends' | 'all';
type GamesTab =
  | 'popular'
  | 'bestRated'
  | 'new'
  | 'favorites'
  | 'byMe'
  | 'byFriends';

const Home = () => {
  const { user } = useUserContext();

  const [games, setGames] = useState<Game[]>();
  const [socialTab, setSocialTab] = useState<SocialTab>('friends');
  const [gamesTab, setGamesTab] = useState<GamesTab>('popular');
  const [users, setUsers] = useState<BasicUser[]>(user?.friends ?? []);

  useEffect(() => {
    apiClient
      .get('games')
      .then((res) => setGames(res.data))
      .catch((err) => toastError(err.response?.data?.message));
  }, []);

  const searchUser = (value: string) => {
    if (socialTab === 'friends') {
      return user?.friends.filter(
        (friend) => friend.name === value || friend.id === Number(value)
      );
    }
    return apiClient
      .get(`users?value=${value}`)
      .then((res) => setUsers(res.data))
      .catch((err) => toastError(err.response?.data?.message));
  };

  const handleFriends = () => {
    setSocialTab('friends');
    setUsers(user?.friends ?? []);
  };

  const handleAll = () => {
    setSocialTab('all');
    setUsers([]);
  };

  const gamesTabs = [
    { name: 'popular', label: 'Mais poulares', show: true },
    { name: 'bestRated', label: 'Melhores avaliados', show: true },
    { name: 'new', label: 'Novidade', show: true },
    { name: 'favorites', label: 'Favoritos', show: !!user },
    { name: 'byMe', label: 'Criado por mim', show: !!user },
    { name: 'byFriends', label: 'Criado por amigos', show: !!user },
  ];

  return (
    <section className="py-10 flex gap-15">
      <div className="basis-[80%]">
        <div className="flex gap-10 pb-5">
          {gamesTabs
            .filter((tab) => tab.show)
            .map((tab, idx) => (
              <TabItem
                key={idx}
                name={tab.label}
                onClick={() => setGamesTab(tab.name as GamesTab)}
                isActive={gamesTab === tab.name}
              />
            ))}
          <Input
            placeholder="Busca por nome ou ID"
            className="w-[300px] ml-auto"
          />
        </div>
        <div className="flex flex-col gap-2">
          {games?.map((game) => (
            <GameItem key={game.id} {...game} />
          ))}
        </div>
      </div>
      <div className="basis-[20%]">
        <div className="flex gap-10 mb-5">
          <TabItem
            name="Amigos"
            onClick={handleFriends}
            isActive={socialTab === 'friends'}
          />
          <TabItem
            name="Encontrar"
            onClick={handleAll}
            isActive={socialTab === 'all'}
          />
        </div>
        <div>
          <Input
            placeholder="Busca por nome ou ID"
            onChange={(e) => searchUser(e.target.value)}
          />
          {users.map((user) => (
            <UserItem key={user.id} {...user} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
