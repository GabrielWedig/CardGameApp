'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input as InputShad } from '@/components/ui/input';
import RadioGroup from '@/components/form/radio';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/form/form';
import { ChangeEvent, useEffect, useState } from 'react';
import { ImageType, Paginated } from '@/types/common';
import { Textarea } from '@/components/ui/textarea';
import Input from '@/components/form/input';
import Card from '@/components/card';
import { CardForm, cardSchema } from './schema';
import apiClient from '@/services/apiClient';
import { Card as CardType } from '@/types/card';
import { toastError } from '@/lib/toast';
import BoxLoader from '@/components/boxLoader';
import Pagination from '@/components/pagination';

interface CardTabProps {
  gameId: string;
}

interface Question {
  text: string | null;
  image: ImageType | null;
}

const CardTab = ({ gameId }: CardTabProps) => {
  const [cards, setCards] = useState<Paginated<CardType>>();
  const [page, setPage] = useState<number>(1);
  const [searchCard, setSearchCard] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const limit = 50;

  useEffect(() => {
    setLoading(true);

    apiClient
      .get(
        `cards?gameId=${gameId}&search=${searchCard}&page=${page}&limit=${limit}`
      )
      .then((res) => setCards(res.data))
      .catch((err) => toastError(err.response?.data?.message))
      .finally(() => setLoading(false));
  }, [gameId, page, searchCard]);

  const [question, setQuestion] = useState<Question>({
    text: null,
    image: null,
  });

  const form = useForm<CardForm>({
    defaultValues: { type: 'text' },
    resolver: zodResolver(cardSchema),
  });

  const onSubmit = async (data: CardForm) => {
    console.log(data);
  };

  const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setQuestion((question) => ({
        ...question,
        image: { path: URL.createObjectURL(file), file },
      }));
    }
  };

  const typeOptions = [
    { value: 'text', label: 'Texto' },
    { value: 'image', label: 'Imagem' },
  ];

  const type = form.watch('type');
  const answer = form.watch('answer');

  return (
    <div className="flex gap-10">
      <Form form={form} onSubmit={onSubmit} className="w-[20%]">
        <RadioGroup name="type" options={typeOptions} type="row" />
        {type === 'text' && (
          <Textarea
            placeholder="Insira a pergunta"
            onChange={(e) =>
              setQuestion((question) => ({ ...question, text: e.target.value }))
            }
            className="mb-5"
          />
        )}
        {type === 'image' && (
          <>
            <InputShad
              id="image"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChangeImage}
            />
            <Button
              type="button"
              onClick={() => document.getElementById('image')?.click()}
              className="mb-5"
            >
              Fazer upload
            </Button>
          </>
        )}
        <Input name="answer" label="Resposta" placeholder="Insira a resposta" />
        <Button>Criar</Button>
      </Form>
      <div className="w-[50%] flex justify-center items-center">
        <Card
          readonly
          tip={answer}
          imageUrl={question.image?.path}
          text={question?.text ?? ''}
        />
      </div>
      <div className="w-[30%]">
        <span>Cards</span>
        <BoxLoader isLoading={loading} hasData={!!cards?.items.length}>
          <InputShad
            onChange={(e) => setSearchCard(e.target.value)}
            value={searchCard}
            placeholder="Pesquisa por ID, pergunta ou resposta"
          />
          <div className="flex flex-col gap-2">
            {cards?.items.map((card) => (
              <div key={card.id}>
                <span>Id: {card.id}</span>
                {card.text ? (
                  <span>{card.text}</span>
                ) : (
                  <span>{card.answer}</span>
                )}
              </div>
            ))}
          </div>
          <Pagination
            limit={limit}
            onChange={(page) => setPage(page)}
            page={page}
            total={cards?.total ?? 0}
          />
        </BoxLoader>
      </div>
    </div>
  );
};

export default CardTab;
