'use client';

import {
  Select as SelectBase,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '../ui/select';
import { useFormContext, Path, FieldValues, Controller } from 'react-hook-form';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label?: string;
  options: Option[];
  placeholder?: string;
}

const Select = <TFormValues extends FieldValues>({
  name,
  label,
  options,
  placeholder = 'Selecione uma opção',
}: SelectProps<TFormValues>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const fieldError = errors?.[name];

  return (
    <div className="flex flex-col">
      {label && <label className="mb-1">{label}</label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <SelectBase
            value={field.value !== undefined ? String(field.value) : ''}
            onValueChange={(val) => {
              const parsed = Number(val);
              field.onChange(isNaN(parsed) ? val : parsed);
            }}
          >
            <SelectTrigger
              className={`w-[300px] ${fieldError ? 'border-red-500' : 'mb-5'}`}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectBase>
        )}
      />
      {fieldError && (
        <span className="text-red-500 text-sm">
          {String(fieldError?.message)}
        </span>
      )}
    </div>
  );
};

export default Select;
