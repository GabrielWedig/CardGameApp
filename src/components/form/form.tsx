'use client';

import {
  FormProvider,
  UseFormReturn,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';

interface FormProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
  children: React.ReactNode;
  className?: string;
}

export const Form = <TFormValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProps<TFormValues>) => {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
