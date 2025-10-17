interface ContainerProps {
  children: React.ReactNode;
  className: string;
  ignoreHeader?: boolean;
}

const Container = ({
  children,
  className,
  ignoreHeader = false,
}: ContainerProps) => {
  return (
    <div className={`${className} py-20 ${!ignoreHeader && 'pt-[150px]'}`}>
      {children}
    </div>
  );
};

export default Container;
