import {
  CardContent,
  CardHeader,
  CardTitle,
  Card as ShadCard,
} from './ui/card';
import Image from 'next/image';
import { Input as ShadInput } from './ui/input';
import { Button } from './ui/button';
import Form from './form/form';
import Input from './form/input';
import { CardForm } from '@/app/game/[id]/page';
import { UseFormReturn } from 'react-hook-form';

interface CardProps {
  readonly: boolean;
  tip: string;
  form?: UseFormReturn<CardForm, unknown, CardForm>;
  onSubmit?: (data: CardForm) => void;
  text?: string;
  imageUrl?: string;
}
const Card = ({ readonly, form, onSubmit, tip, text, imageUrl }: CardProps) => {
  return (
    <ShadCard>
      {text && (
        <CardHeader>
          <CardTitle>Pergunta:</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {text && <span>{text}</span>}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="imagem"
            className="w-auto h-auto"
            width={225}
            height={150}
            priority
          />
        )}
        {readonly && (
          <div className="flex flex-col gap-5 w-[300px]">
            <ShadInput readOnly disabled placeholder="Digite a resposta" />
            <Button disabled>Responder</Button>
          </div>
        )}
        {form && !!onSubmit && (
          <Form
            form={form}
            onSubmit={onSubmit}
            className="flex flex-col gap-5 w-[300px]"
          >
            <Input name="answer" placeholder="Digite a resposta" />
            <Button type="submit">Responder</Button>
          </Form>
        )}
        <div className="h-[21px]">{tip && <span>Pista: {tip}</span>}</div>
      </CardContent>
    </ShadCard>
  );
};

export default Card;
