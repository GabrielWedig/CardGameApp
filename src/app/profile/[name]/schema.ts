import apiClient from '@/services/apiClient';
import * as z from 'zod';

export const getEditSchema = (userName: string) =>
  z
    .object({
      name: z
        .string()
        .min(1, 'Nome obrigatório')
        .max(15, 'Nome deve ter no máximo 15 caracteres')
        .regex(/^[A-Za-z0-9]{1,15}$/, {
          message:
            'O nome deve conter apenas letras e números, sem espaços ou caracteres especiais',
        })
        .refine(
          async (value) => {
            if (!value || value === userName) return true;
            const res = await apiClient.get(
              `users/validate-name?name=${value}`
            );
            return res.data.isValid;
          },
          {
            message: 'Este nome já está em uso',
          }
        ),
      displayName: z.string().min(1, 'Nome de exibição obrigatório'),
      about: z.string().optional().nullable(),
      password: z
        .string()
        .refine(
          (val) => (val ? val.length >= 8 : true),
          'Senha deve ter no mínimo 8 caracteres'
        )
        .refine(
          (val) => (val ? /[A-Z]/.test(val) : true),
          'Senha deve conter ao menos uma letra maiúscula'
        )
        .refine(
          (val) => (val ? /\d/.test(val) : true),
          'Senha deve conter ao menos um número'
        )
        .refine(
          (val) => (val ? /[!@#$%^&*()_+\[\]{};':"\\|,.<>/?]/.test(val) : true),
          'Senha deve conter ao menos um caractere especial'
        ),
      confirmPassword: z.string(),
    })
    .refine(
      (data) =>
        data.password
          ? data.confirmPassword && data.password === data.confirmPassword
          : true,
      {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
      }
    );
