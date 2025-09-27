interface TabItemProps {
  name: string;
  onClick: () => void;
  isActive: boolean;
}

const TabItem = ({ name, onClick, isActive }: TabItemProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <button className="cursor-pointer" onClick={onClick}>
        {name}
      </button>
      {isActive && (
        <div className="w-[3px] h-[3px] bg-black rounded-full"></div>
      )}
    </div>
  );
};

export default TabItem;
