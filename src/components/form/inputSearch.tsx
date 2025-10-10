'use client';

import { Input as InputBase } from '../ui/input';
import { useFormContext, Path, FieldValues } from 'react-hook-form';
import { ChangeEvent, useState } from 'react';
import { Spinner } from '../ui/spinner';

export interface SearchParams {
  value: string;
  onError: (message: string) => void;
  onClear: () => void;
  onLoaded: () => void;
}

interface InputSearchProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  onSearch: (params: SearchParams) => void;
  label?: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
}

const InputSearch = <TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  type = 'text',
  onSearch,
  onChange,
}: InputSearchProps<TFormValues>) => {
  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext<TFormValues>();

  const fieldError = errors?.[name];
  const { onChange: internalOnChange, ...rest } = register(name);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    internalOnChange(event);
    onChange?.(event.target.value);
    onSearch({ value: event.target.value, onError, onClear, onLoaded });
  };

  const onError = (message: string) =>
    setError(name, { message: message ?? 'Valor inválido' });
  const onClear = () => clearErrors(name);
  const onLoaded = () => setIsLoading(false);

  return (
    <div className="flex flex-col">
      {label && <label className="mb-1">{label}</label>}
      <div className="w-[300px] relative">
        <InputBase
          type={type}
          placeholder={placeholder}
          className={fieldError ? 'border-red-500' : 'mb-5'}
          {...rest}
          onChange={handleChange}
        />
        {isLoading && <Spinner size={20} className="absolute right-2 top-2" />}
      </div>
      {fieldError && (
        <span className="text-red-500 text-sm">
          {String(fieldError?.message)}
        </span>
      )}
    </div>
  );
};

export default InputSearch;
