'use client';

import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { RadioGroup as RadioShad, RadioGroupItem } from '../ui/radio-group';

interface Option {
  value: string | number;
  label: string;
}

type Type = 'column' | 'row';

interface RadioGroupProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label?: string;
  options: Option[];
  type?: Type;
}

const RadioGroup = <TFormValues extends FieldValues>({
  name,
  label,
  options,
  type = 'column',
}: RadioGroupProps<TFormValues>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const fieldError = errors?.[name];

  return (
    <div className="flex flex-col">
      {label && <label className="mb-2">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioShad
            value={field.value !== undefined ? String(field.value) : ''}
            onValueChange={(val) => {
              const parsed = Number(val);
              field.onChange(isNaN(parsed) ? val : parsed);
            }}
            className={`gap-1 ${!fieldError && 'mb-5'} flex ${
              type === 'column' ? 'flex-col' : 'gap-3'
            }`}
          >
            {options.map((opt) => (
              <div className="flex gap-2 items-center" key={opt.value}>
                <RadioGroupItem value={String(opt.value)} />
                <label>{opt.label}</label>
              </div>
            ))}
          </RadioShad>
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

export default RadioGroup;
