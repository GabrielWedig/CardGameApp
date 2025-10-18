import z from 'zod';

export const gameSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  visibility: z.enum(['public', 'private', 'friends']),
});

export const cardSchema = z.object({
  type: z.enum(['text', 'image']),
  answer: z.string().min(1, 'Resposta obrigatória'),
});

export type GameForm = z.infer<typeof gameSchema>;
export type CardForm = z.infer<typeof cardSchema>;
