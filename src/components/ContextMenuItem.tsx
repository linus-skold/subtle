
interface ContextMenuItemProps {
  className?: string; // Optional className for the menu item
  menuIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // This accepts an SVG icon component
  label: string; // The label for the menu item
  onClick?: () => void; // Optional onClick handler
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ menuIcon: MenuIcon, label, onClick, className }) => {
  return (
    <li className={`p-2 ${className ?? ''} hover:bg-gray-800`}>
      <button className="flex space-x-2" onClick={onClick}>
        <MenuIcon className="h-4 w-4" />
        <span>{label}</span>
      </button>
    </li>
  );
};


export default ContextMenuItem
