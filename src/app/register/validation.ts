import { ChangeInputParams } from '@/components/form/input';
import { SearchParams } from '@/components/form/inputSearch';
import { toastError } from '@/lib/toast';
import apiClient from '@/services/apiClient';

export const validateName = async ({
  value,
  onError,
  onClear,
  onLoaded,
}: SearchParams) =>
  await apiClient
    .get(`users/validate-name?name=${value}`)
    .then((res) =>
      res.data.isValid ? onClear() : onError('Este nome já está em uso')
    )
    .catch((err) => toastError(err.response?.data?.message))
    .finally(onLoaded);

export const matchPassword = (
  { value, onError, onClear }: ChangeInputParams,
  toCompare: string
) => (value === toCompare ? onClear() : onError('As senhas não coincidem'));
