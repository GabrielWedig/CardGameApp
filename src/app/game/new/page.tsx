'use client';

import Form from '@/components/form/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { NewGameForm, newGameSchema } from './schema';
import Input from '@/components/form/input';
import RadioGroup from '@/components/form/radio';
import { Button } from '@/components/ui/button';

const NewGame = () => {
  const form = useForm<NewGameForm>({
    defaultValues: { visibility: 'public' },
    resolver: zodResolver(newGameSchema),
  });

  const onSubmit = async (data: NewGameForm) => {
    console.log(data);
  };

  const visibilityOptions = [
    { value: 'public', label: 'Público' },
    { value: 'private', label: 'Privado' },
    { value: 'friends', label: 'Apenas amigos' },
  ];

  return (
    <section className="py-10">
      <div className="flex gap-20">
        <div>
          <h2 className="text-3xl mb-5 font-medium">Novo jogo</h2>
          <Form form={form} onSubmit={onSubmit}>
            <Input
              name="name"
              label="Nome"
              placeholder="Insira um nome para o jogo"
            />
            <RadioGroup
              name="visibility"
              options={visibilityOptions}
              label="Visibilidade"
            />
            <span>Cards</span>
            <div className="flex flex-col gap-1">
              <span>Card1</span>
              <span>Card2</span>
            </div>
            <Button>Criar</Button>
          </Form>
        </div>
        <div>
          <h2 className="text-3xl mb-5 font-medium">Novo card</h2>
        </div>
      </div>
    </section>
  );
};

export default NewGame;
