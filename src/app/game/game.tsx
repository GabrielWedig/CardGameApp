'use client';

import { useState } from 'react';
import TabItem from '@/components/tabItem';
import GameTab from './gameTab';
import CardTab from './cardTab';
import { useParams } from 'next/navigation';

type Tab = 'card' | 'game';

const NewGame = () => {
  const params = useParams();
  const id = params?.id as string;
  const isNew = !id;

  const [tab, setTab] = useState<Tab>('game');

  const tabs = [
    { name: 'game', label: 'Jogo', show: true },
    { name: 'card', label: 'Card', show: !isNew },
  ];

  return (
    <section className="flex flex-col gap-8 h-full">
      <div className="flex gap-5">
        {tabs
          .filter((tb) => tb.show)
          .map((tb, idx) => (
            <TabItem
              key={idx}
              name={tb.label}
              onClick={() => setTab(tb.name as Tab)}
              isActive={tab === tb.name}
            />
          ))}
      </div>
      <div className="h-full">
        {tab === 'game' && <GameTab isNew={isNew} id={id} />}
        {tab === 'card' && <CardTab gameId={id} />}
      </div>
    </section>
  );
};

export default NewGame;
