import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input as InputShad } from '@/components/ui/input';
import RadioGroup from '@/components/form/radio';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/form/form';
import { ChangeEvent, useState } from 'react';
import { ImageType } from '@/types/common';
import { Textarea } from '@/components/ui/textarea';
import Input from '@/components/form/input';
import Card from '@/components/card';
import { CardForm, cardSchema } from './schema';

interface CardTabProps {
  gameId: string;
}

interface Question {
  text: string | null;
  image: ImageType | null;
}

const CardTab = ({ gameId }: CardTabProps) => {
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
    </div>
  );
};

export default CardTab;
