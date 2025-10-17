import { useForm } from 'react-hook-form';
import { NewGameForm, newGameSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/form/input';
import RadioGroup from '@/components/form/radio';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/form/form';

const GameTab = () => {
  const form = useForm<NewGameForm>({
    defaultValues: { visibility: 'public' },
    resolver: zodResolver(newGameSchema),
  });

  const onSubmit = async (data: NewGameForm) => {
    console.log(data);
    //setGameCreated(true);
  };

  const visibilityOptions = [
    { value: 'public', label: 'Público' },
    { value: 'private', label: 'Privado' },
    { value: 'friends', label: 'Apenas amigos' },
  ];

  return (
    <Form form={form} onSubmit={onSubmit} className="w-[20%]">
      <Input
        name="name"
        label="Nome"
        placeholder="Insira um nome para o jogo"
      />
      <RadioGroup name="visibility" options={visibilityOptions} />
      <Button>Criar</Button>
    </Form>
  );
};

export default GameTab;
