'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Game {
  id: number;
  name: string;
  cards: Card[];
}

interface Card {
  id: number;
  answer: string;
  image_path: string;
}

const normalize = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .toLowerCase();
};

const Game = () => {
  const params = useParams();
  const id = params?.id as string;

  const [game, setGame] = useState<Game>();
  const [answer, setAnswer] = useState<string>('');
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/games/${id}`)
      .then((res) => {
        setGame(res.data);
        setCards(res.data.cards);
      })
      .catch((err) => console.error('Erro ao retornar jogo:', err));
  }, [id]);

  const currentCard = cards[0];

  const handleAnswer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (normalize(answer) === normalize(currentCard?.answer ?? '')) {
      setAnswer('');
      setCards(cards.slice(1));
      return;
    }

    const sameCards = cards.filter((c) => c.id === currentCard.id);

    if (sameCards.length < 2) {
      setCards((cards) => [...cards, currentCard]);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center gap-20 py-10">
      <Image
        src={currentCard?.image_path ?? ''}
        alt="Bandeira"
        className="shadow-xl/20"
        width={225}
        height={150}
        priority
      />
      <form className="flex gap-3" onSubmit={handleAnswer}>
        <Input
          className="w-[200px]"
          onChange={(e) => setAnswer(e.target.value)}
          value={answer}
        />
        <Button type="submit">Responder</Button>
      </form>
    </section>
  );
};

export default Game;
