'use client';

import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Game {
  id: number;
  name: string;
}

const Home = () => {
  const [games, setGames] = useState<Game[]>();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/games`)
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
              <CardContent>{game.name}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Home;
