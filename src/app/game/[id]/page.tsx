'use client';

import { Button } from '@/components/ui/button';
import apiClient from '@/services/apiClient';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Game } from '@/types/game';
import { normalize } from '@/lib/utils';
import {
  Card as ShadCard,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Card } from '@/types/card';
import { toastError } from '@/lib/toast';
import BoxLoader from '@/components/boxLoader';
import { useForm } from 'react-hook-form';
import Form from '@/components/form/form';
import Input from '@/components/form/input';

interface CardForm {
  answer: string;
}

const Game = () => {
  const params = useParams();
  const id = params?.id as string;

  const [cards, setCards] = useState<Card[]>([]);
  const [tip, setTip] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    apiClient
      .get(`cards?gameId=${id}`)
      .then((res) => setCards(res.data))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  const currentCard = cards[0];

  const form = useForm<CardForm>();

  const onSubmit = (data: CardForm) => {
    if (normalize(data.answer) === normalize(currentCard.answer)) {
      form.resetField('answer');
      setTip('');
      setCards(cards.slice(1));
      setCount(!tip ? count + 1 : count);
      return;
    }

    setTip(getNewTip(tip));

    const sameCards = cards.filter((c) => c.id === currentCard.id);
    if (sameCards.length < 2) {
      setCards((cards) => [...cards, currentCard]);
    }
  };

  const getNewTip = (previousTip = '') => {
    const answer = currentCard.answer;
    const len = answer.length;
    const tip = previousTip || '*'.repeat(len);

    const revealCount = Math.ceil(len * 0.2);

    const hiddenIndices = tip
      .split('')
      .map((c, i) => (c === '*' ? i : -1))
      .filter((i) => i !== -1);

    if (!hiddenIndices.length) return tip;

    const revealIndices = hiddenIndices
      .sort(() => Math.random() - 0.5)
      .slice(0, revealCount);

    return tip
      .split('')
      .map((c, i) => (revealIndices.includes(i) ? answer[i] : c))
      .join('');
  };

  return (
    <BoxLoader
      className="flex flex-col justify-center items-center gap-20 py-10"
      isLoading={isLoading}
      qtdData={cards.length}
    >
      <span className="text-lg font-semibold">Restam: {cards.length}</span>
      {currentCard?.text && (
        <ShadCard>
          <CardHeader>
            <CardTitle>Pergunta:</CardTitle>
          </CardHeader>
          <CardContent>{currentCard.text}</CardContent>
        </ShadCard>
      )}
      {currentCard?.imagePath && (
        <Image
          src={currentCard.imagePath}
          alt="Bandeira"
          className="shadow-xl/20 w-auto h-auto"
          width={225}
          height={150}
          priority
        />
      )}
      <Form
        form={form}
        onSubmit={onSubmit}
        className="flex flex-col gap-5 w-[300px]"
      >
        <Input name="answer" placeholder="Digite a resposta" />
        <Button type="submit">Responder</Button>
      </Form>
      <div className="h-[21px]">{tip && <span>Pista: {tip}</span>}</div>
    </BoxLoader>
  );
};

export default Game;
