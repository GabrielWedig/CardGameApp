import z from 'zod';

export const newGameSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  visibility: z.enum(['public', 'private', 'friends']),
});

export const newCardSchema = z.object({
  type: z.enum(['text', 'image']),
  answer: z.string().min(1, 'Resposta obrigatória'),
});

export type NewGameForm = z.infer<typeof newGameSchema>;
export type NewCardForm = z.infer<typeof newCardSchema>;
