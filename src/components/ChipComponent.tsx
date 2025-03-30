import { z } from "zod";


export const ChipComponentSchema = z.object({
  label: z.string(),
  onClick: z.function().args(z.unknown()).optional(),
  className: z.string().optional(),
});
export type ChipComponentProps = z.infer<typeof ChipComponentSchema>;


const ChipComponent = (props: ChipComponentProps) => {
  
  const { label, onClick, className = "" } = props;
  
  return (
    <div
      className={`${className} flex items-center px-2 py-1 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-200`}
      onClick={onClick}
    >
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
export default ChipComponent;