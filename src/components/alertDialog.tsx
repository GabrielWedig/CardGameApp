import {
  AlertDialog as ShadAlert,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: () => void;
  title: string;
  onContinue: () => void;
  isLoading: boolean;
  description?: string;
}

const AlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onContinue,
  isLoading,
}: AlertDialogProps) => {
  return (
    <ShadAlert open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onOpenChange}>
            Cancelar
          </Button>
          <Button onClick={onContinue} isLoading={isLoading}>
            Continuar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ShadAlert>
  );
};

export default AlertDialog;
