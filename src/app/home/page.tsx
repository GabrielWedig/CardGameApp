'use client';

import { useUserContext } from '@/context/userContext';
import { useState } from 'react';
import TabItem from '@/components/tabItem';
import GamesTab from './gamesTab';
import FriendsTab from './friendsTab';
import RankingTab from './rankingTab';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export type Tab =
  | 'popular'
  | 'bestRated'
  | 'new'
  | 'mine'
  | 'friends'
  | 'ranking';

const Home = () => {
  const { user } = useUserContext();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('popular');

  const tabs = [
    { name: 'popular', label: 'Mais polulares', public: true },
    { name: 'bestRated', label: 'Melhores avaliados', public: true },
    { name: 'new', label: 'Novos', public: true },
    { name: 'mine', label: 'Meus' },
    { name: 'friends', label: 'Amigos' },
    { name: 'ranking', label: 'Ranking' }, // mundial / nacionalidade / semanal
  ];

  const gamesTab = ['popular', 'bestRated', 'new', 'mine'].includes(tab);
  const friendsTab = tab === 'friends';
  const rankingTab = tab === 'ranking';

  const resetTab = () => setTab('popular');

  return (
    <section className="flex gap-15 min-h-full">
      <div className="basis-[15%] flex flex-col gap-4 justify-center">
        {tabs
          .filter((tab) => user ?? tab.public)
          .map((tb, idx) => (
            <TabItem
              key={idx}
              name={tb.label}
              onClick={() => setTab(tb.name as Tab)}
              isActive={tab === tb.name}
            />
          ))}
        {user && (
          <Button onClick={() => router.push('/game/new')}>Novo Jogo</Button>
        )}
      </div>
      <div className="basis-[85%] flex flex-col gap-10">
        {gamesTab && <GamesTab tab={tab} />}
        {friendsTab && <FriendsTab resetTab={resetTab} />}
        {rankingTab && <RankingTab />}
      </div>
    </section>
  );
};

export default Home;
