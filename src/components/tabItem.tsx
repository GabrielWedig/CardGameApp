interface TabItemProps {
  name: string;
  onClick: () => void;
  isActive: boolean;
}

const TabItem = ({ name, onClick, isActive }: TabItemProps) => {
  return (
    <div className="flex flex-col items-center">
      <button
        className={`cursor-pointer text-sm font-medium ${
          isActive ? 'mb-1' : 'mb-2'
        }`}
        onClick={onClick}
      >
        {name}
      </button>
      {isActive && (
        <div className="w-[4px] h-[4px] bg-black rounded-full"></div>
      )}
    </div>
  );
};

export default TabItem;
