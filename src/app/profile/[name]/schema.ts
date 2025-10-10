import * as z from 'zod';

export const editSchema = z.object({
  about: z.string(),
  name: z.string(),
  displayName: z.string(),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
    .regex(/\d/, 'Senha deve conter ao menos um número')
    .regex(
      /[!@#$%^&*()_+\[\]{};':"\\|,.<>/?]/,
      'Senha deve conter ao menos um caractere especial'
    ),
  confirmPassword: z.string().min(1, 'Confirmação de senha obrigatória'),
});

export type EditForm = z.infer<typeof editSchema>;
