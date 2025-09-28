'use client';

import { useUserContext } from '@/context/userContext';
import { useState } from 'react';
import TabItem from '@/components/tabItem';
import GamesTab from './gamesTab';
import FriendsTab from './friendsTab';
import RankingTab from './rankingTab';

export type Tab =
  | 'popular'
  | 'bestRated'
  | 'new'
  | 'mine'
  | 'friends'
  | 'ranking';

const Home = () => {
  const { user } = useUserContext();

  const [tab, setTab] = useState<Tab>('popular');

  const tabs = [
    { name: 'popular', label: 'Mais poulares', public: true },
    { name: 'bestRated', label: 'Melhores avaliados', public: true },
    { name: 'new', label: 'Novos', public: true },
    { name: 'mine', label: 'Meus' }, // favoritos / criados por mim / ultimos jogados
    { name: 'friends', label: 'Amigos' }, // amigos / encontrar / criado por amigos
    { name: 'ranking', label: 'Ranking' }, // mundial / nacionalidade / semanal
  ];

  const gamesTab = ['popular', 'bestRated', 'new', 'mine'].includes(tab);
  const friendsTab = tab === 'friends';
  const rankingTab = tab === 'ranking';

  return (
    <section className="py-10 flex gap-15">
      <div className="basis-[20%] flex flex-col gap-4">
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
      </div>
      <div className="basis-[80%] flex flex-col gap-10">
        {gamesTab && <GamesTab tab={tab} />}
        {friendsTab && <FriendsTab />}
        {rankingTab && <RankingTab />}
      </div>
    </section>
  );
};

export default Home;
