'use client';

import { useEffect, useState } from 'react';
import { Tab } from './page';
import apiClient from '@/services/apiClient';
import { Game } from '@/types/game';
import { toastError } from '@/lib/toast';
import GameItem from './gameItem';
import { Input } from '@/components/ui/input';
import TabItem from '@/components/tabItem';
import Pagination from '@/components/pagination';
import BoxLoader from '@/components/boxLoader';

interface GamesTabProps {
  tab: Tab;
}

type MineTab = 'favorites' | 'byMe' | 'lastPlayed' | 'byFriends';

const GamesTab = ({ tab }: GamesTabProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [games, setGames] = useState<Game[]>([]);
  const [mineTab, setMineTab] = useState<MineTab>('favorites');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const mineTabs = [
    { name: 'favorites', label: 'Favoritos' },
    { name: 'lastPlayed', label: 'Últimos jogados' },
    { name: 'byMe', label: 'Criados por mim' },
    { name: 'byFriends', label: 'Criados por amigos' },
  ];

  const isMineTab = tab === 'mine';
  const tabFilter = isMineTab ? mineTab : tab;
  const limit = 50;

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get(
        `games?tab=${tabFilter}&search=${search}&page=${page}&limit=${limit}`
      )
      .then((res) => setGames(res.data))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setIsLoading(false));
  }, [tabFilter, search, page]);

  return (
    <>
      <div className="flex justify-between items-center">
        {isMineTab && (
          <div className="flex gap-5">
            {mineTabs.map((tb, idx) => (
              <TabItem
                key={idx}
                name={tb.label}
                onClick={() => setMineTab(tb.name as MineTab)}
                isActive={mineTab === tb.name}
              />
            ))}
          </div>
        )}
        <Input
          placeholder="Busca por ID ou nome"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="w-[300px] ml-auto"
        />
      </div>
      <BoxLoader
        isLoading={isLoading}
        hasData={!!games.length}
        className="flex flex-col gap-10"
      >
        <div className="flex flex-col gap-2">
          {games.map((game) => (
            <GameItem key={game.id} {...game} />
          ))}
        </div>
        <Pagination
          page={page}
          total={20}
          limit={limit}
          onChange={(number) => setPage(number)}
        />
      </BoxLoader>
    </>
  );
};

export default GamesTab;
