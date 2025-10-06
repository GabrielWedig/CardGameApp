import { Spinner } from './ui/spinner';

interface BoxLoaderProps {
  isLoading: boolean;

  children: React.ReactNode;
  hasData: boolean;
  className?: string;
}

const BoxLoader = ({
  children,
  isLoading,
  hasData,
  className,
}: BoxLoaderProps) => {
  const nothing = !isLoading && !hasData;

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
