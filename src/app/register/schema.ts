import * as z from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome obrigatório')
    .max(15, 'Nome deve ter no máximo 15 caracteres')
    .regex(/^[A-Za-z0-9]{1,15}$/, {
      message:
        'O nome deve conter apenas letras e números, sem espaços ou caracteres especiais',
    }),
  displayName: z.string().min(1, 'Nome de exibição obrigatório'),
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
  nationalityId: z
    .number('Nacionalidade obrigatória')
    .min(1, 'Nacionalidade obrigatória'),
});

export type RegisterForm = z.infer<typeof registerSchema>;
