'use client';

import { ChangeEvent } from 'react';
import { Input as InputBase } from '../ui/input';
import { useFormContext, Path, FieldValues, get } from 'react-hook-form';

export interface ChangeInputParams {
  value: string;
  onError: (message: string) => void;
  onClear: () => void;
}

interface InputProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label?: string;
  placeholder?: string;
  type?: string;
  onChange?: (params: ChangeInputParams) => void;
}

const Input = <TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  type = 'text',
  onChange,
}: InputProps<TFormValues>) => {
  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext<TFormValues>();

  const fieldError = get(errors, name);
  const { onChange: internalOnChange, ...rest } = register(name);

  const onError = (message: string) =>
    setError(name, { message: message ?? 'Valor inválido' });
  const onClear = () => clearErrors(name);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    internalOnChange(event);
    onChange?.({ value: event.target.value, onError, onClear });
  };

  return (
    <div className="flex flex-col">
      {label && <label className="mb-1">{label}</label>}
      <InputBase
        type={type}
        placeholder={placeholder}
        className={`w-[300px] ${fieldError ? 'border-red-500' : 'mb-5'}`}
        {...rest}
        onChange={handleChange}
      />
      {fieldError && (
        <span className="text-red-500 text-sm">
          {String(fieldError?.message)}
        </span>
      )}
    </div>
  );
};

export default Input;
