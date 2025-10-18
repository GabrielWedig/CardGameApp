import { toast } from 'sonner';

export const toastError = (message: string) =>
  toast.error(message || 'Erro inesperado, tente novamente.');

export const toastSuccess = (message: string) =>
  toast.success(message || 'Sucesso!');
