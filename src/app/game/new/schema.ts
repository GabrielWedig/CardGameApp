import z from 'zod';

export const newGameSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  visibility: z.enum(['public', 'private', 'friends']),
});

export type NewGameForm = z.infer<typeof newGameSchema>;
