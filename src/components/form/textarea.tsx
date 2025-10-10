'use client';

import { Textarea as TextareaBase } from '@/components/ui/textarea';
import { useFormContext, Path, FieldValues } from 'react-hook-form';

interface TextareaProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

const Textarea = <TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  onChange,
}: TextareaProps<TFormValues>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const fieldError = errors?.[name];
  const { onChange: internalOnChange, ...rest } = register(name);

  return (
    <div className="flex flex-col">
      {label && <label className="mb-1">{label}</label>}
      <TextareaBase
        placeholder={placeholder}
        className={`w-[300px] ${fieldError ? 'border-red-500' : 'mb-5'}`}
        {...rest}
        onChange={(e) => {
          internalOnChange(e);
          onChange?.(e.target.value);
        }}
      />
      {fieldError && (
        <span className="text-red-500 text-sm">
          {String(fieldError?.message)}
        </span>
      )}
    </div>
  );
};

export default Textarea;
