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

interface GamesTabProps {
  tab: Tab;
}

type MineTab = 'favorites' | 'byMe' | 'lastPlayed';

const GamesTab = ({ tab }: GamesTabProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [mineTab, setMineTab] = useState<MineTab>('favorites');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const mineTabs = [
    { name: 'favorites', label: 'Favoritos' },
    { name: 'byMe', label: 'Criados por mim' },
    { name: 'lastPlayed', label: 'Últimos jogados' },
  ];

  const isMineTab = tab === 'mine';
  const tabFilter = isMineTab ? mineTab : tab;
  const limit = 50;

  useEffect(() => {
    apiClient
      .get(
        `games?tab=${tabFilter}&search=${search}&page=${page}&limit=${limit}`
      )
      .then((res) => setGames(res.data))
      .catch((err) => toastError(err.response?.data?.message));
  }, [tabFilter, search, page]);

  return (
    <>
      <div className="flex justify-between">
        {tab === 'mine' && (
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
          className="w-[300px]"
        />
      </div>
      <div className="flex flex-col gap-2">
        {games.map((game) => (
          <GameItem key={game.id} {...game} />
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

export default GamesTab;
