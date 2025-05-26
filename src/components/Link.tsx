import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { openUrl } from '@tauri-apps/plugin-opener';


const Link = ({ href, children, className }: { href: string; children?: React.ReactNode; className?: string }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openUrl(href).catch((error) => {
      console.error('Failed to open URL:', error);
    });
  };
  return (
    <a
      href={href}
      onClick={handleClick}
        className={`relative inline-flex items-start text-blue-500 hover:underline ${className}`}
     target="_blank"
      rel="noopener noreferrer"
    >
      <span className="inline-block pr-4 relative">
        {children}
        <ArrowTopRightOnSquareIcon className="absolute top-[1px] right-0 h-3 w-3" />
      </span>
   </a>
  );
}
export default Link;