'use client';

import { Card, CardContent } from '@/components/ui/card';
import apiClient from '@/services/apiClient';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Game {
  id: number;
  name: string;
  countCards: number;
}

const Home = () => {
  const [games, setGames] = useState<Game[]>();

  useEffect(() => {
    apiClient
      .get('games')
      .then((res) => setGames(res.data))
      .catch((err) => console.error('Erro ao retornar jogos:', err));
  }, []);

  return (
    <section className="py-10">
      <h1 className="mb-5 text-3xl font-semibold">Jogos</h1>
      <div className="flex flex-col gap-2">
        {games?.map((game) => (
          <Link key={game.id} href={`/game/${game.id}`}>
            <Card>
              <CardContent className="flex justify-between">
                <p>{game.name}</p>
                <p>{game.countCards}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Home;
