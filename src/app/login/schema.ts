import z from 'zod';

export const loginSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export type LoginForm = z.infer<typeof loginSchema>;
