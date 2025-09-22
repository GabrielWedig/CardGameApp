'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/services/apiClient';
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
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
};

const Game = () => {
  const params = useParams();
  const id = params?.id as string;

  const [game, setGame] = useState<Game>();
  const [answer, setAnswer] = useState<string>('');
  const [cards, setCards] = useState<Card[]>([]);
  const [tip, setTip] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    apiClient
      .get(`games/${id}`)
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
      setTip('');
      setCards(cards.slice(1));
      setCount(!tip ? count + 1 : count);
      return;
    }

    const sameCards = cards.filter((c) => c.id === currentCard.id);
    setTip((tip) => getNewTip(tip));

    if (sameCards.length < 2) {
      setCards((cards) => [...cards, currentCard]);
    }
  };

  const getNewTip = (tip: string) => {
    const answer = currentCard.answer;
    const len = answer.length;

    if (!tip) {
      return answer[0] + '*'.repeat(len - 2) + answer[len - 1];
    }

    if (!tip.includes('*')) return answer;

    const newTip = tip.split('');
    const firstStar = newTip.indexOf('*');
    const lastStar = newTip.lastIndexOf('*');

    if (firstStar < lastStar) {
      newTip[firstStar] = answer[firstStar];
      newTip[lastStar] = answer[lastStar];
    } else {
      newTip[firstStar] = answer[firstStar];
    }

    return newTip.join('');
  };

  return (
    <section className="flex flex-col justify-center items-center gap-20 py-10 h-screen">
      <span className="absolute top-20 left-20">
        {count} / {game?.cards.length}
      </span>
      {/* {cards.map((c) => (
        <>
          <Image
            key={c.id}
            src={c.image_path ?? ''}
            alt="Bandeira"
            className="shadow-xl/20"
            width={225}
            height={150}
            priority
          />
          <p>{c.answer}</p>
        </>
      ))} */}
      {currentCard?.image_path && (
        <Image
          src={currentCard.image_path}
          alt="Bandeira"
          className="shadow-xl/20 w-auto h-auto"
          width={225}
          height={150}
          priority
        />
      )}
      <form className="flex gap-3" onSubmit={handleAnswer}>
        <Input
          className="w-[200px]"
          onChange={(e) => setAnswer(e.target.value)}
          value={answer}
        />
        <Button type="submit">Responder</Button>
      </form>
      {tip && <span>Pista: {tip}</span>}
    </section>
  );
};

export default Game;
