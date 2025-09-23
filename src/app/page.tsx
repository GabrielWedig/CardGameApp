'use client';

import GameItem from '@/components/ui/game-item';
import { Input } from '@/components/ui/input';
import apiClient from '@/services/apiClient';
import { Game } from '@/types/game';
import { useEffect, useState } from 'react';

const Home = () => {
  const [games, setGames] = useState<Game[]>();
  const isLogged = true;

  useEffect(() => {
    apiClient
      .get('games')
      .then((res) => setGames(res.data))
      .catch((err) => console.error('Erro ao retornar jogos:', err));
  }, []);

  return (
    <section className="py-10">
      <div className="flex gap-10 pb-5">
        <button>Mais poulares</button>
        <button>Bem avaliados</button>
        <button>Novidade</button>
        {isLogged && <button>Favoritos</button>}
        {isLogged && <button>Criado por mim</button>}
        {isLogged && <button>Criado por amigos</button>}
        <Input
          placeholder="Busca por nome ou ID"
          className="w-[300px] ml-auto"
        />
      </div>

      <div className="flex flex-col gap-2 py-5">
        {games?.map((game) => (
          <GameItem key={game.id} {...game} />
        ))}
      </div>
    </section>
  );
};

export default Home;
