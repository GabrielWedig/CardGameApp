'use client';

import { useState } from 'react';
import TabItem from '@/components/tabItem';
import GameTab from './gameTab';
import CardTab from './cardTab';

type Tab = 'card' | 'game';

const NewGame = () => {
  const [gameCreated, setGameCreated] = useState<boolean>(false);

  const [tab, setTab] = useState<Tab>(gameCreated ? 'card' : 'game');

  const tabs = [
    { name: 'game', label: 'Jogo' },
    { name: 'card', label: 'Card' },
  ];

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-5">
        {tabs.map((tb, idx) => (
          <TabItem
            key={idx}
            name={tb.label}
            onClick={() => setTab(tb.name as Tab)}
            isActive={tab === tb.name}
          />
        ))}
      </div>
      <div>
        {tab === 'game' && <GameTab />}
        {tab === 'card' && <CardTab />}
      </div>
    </section>
  );
};

export default NewGame;
