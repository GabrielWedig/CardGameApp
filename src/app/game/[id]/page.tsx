'use client';

import { COUNTRIES, GAMES, URL_PREFIX } from '@/app/backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const normalize = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .toLowerCase();
};

const random = (size: number) => Math.floor(Math.random() * size);

const Game = () => {
  const params = useParams();
  const id = params?.id as string;

  const gameCountries =
    GAMES.find((game) => game.id === parseInt(id))?.countries ?? [];

  const [countries, setCountries] = useState<number[]>(gameCountries);
  const [count, setCount] = useState(1);
  const [answer, setAnswer] = useState('');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    if (countries.length > 0) {
      setCurrentIndex(random(countries.length));
    }
  }, [countries]);

  const country =
    currentIndex !== null ? COUNTRIES[countries[currentIndex]] : null;

  const handleAnswer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!country) return;

    if (normalize(answer) === normalize(country.name)) {
      const newCountries = countries.filter((_, idx) => idx !== currentIndex);
      setCountries(newCountries);
      setCount((c) => c + 1);
      setAnswer('');
    }
  };

  return (
    <>
      {countries.length > 0 && country && (
        <section className="flex flex-col justify-center items-center gap-20 py-10">
          <h1 className="text-3xl font-semibold">Advinhe a bandeira!</h1>
          <span>
            {count} / {gameCountries.length}
          </span>
          <Image
            src={`${URL_PREFIX}${country.image}`}
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
      )}
      {countries.length === 0 && (
        <h2 className="text-xl font-semibold">
          Parabéns! Você acertou todas as bandeiras!
        </h2>
      )}
    </>
  );
};

export default Game;
