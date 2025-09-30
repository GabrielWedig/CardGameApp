import { Spinner } from './ui/spinner';

interface BoxLoaderProps {
  isLoading: boolean;
  className: string;
  children: React.ReactNode;
  qtdData: number;
}

const BoxLoader = ({
  children,
  isLoading,
  className,
  qtdData,
}: BoxLoaderProps) => {
  const nothing = !isLoading && qtdData === 0;

  return (
    <div
      className={
        isLoading || nothing
          ? 'flex items-center justify-center h-full'
          : className
      }
    >
      {isLoading ? (
        <Spinner />
      ) : nothing ? (
        <span className="text-sm">Nada por aqui.</span>
      ) : (
        children
      )}
    </div>
  );
};

export default BoxLoader;
