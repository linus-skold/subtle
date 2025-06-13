import { z } from "zod";

export const ChipComponentSchema = z.object({
  label: z.string(),
  onClick: z.function().args(z.unknown()).optional(),
  className: z.string().optional(),
  index: z.number().default(0),
});
export type ChipComponentProps = z.infer<typeof ChipComponentSchema>;

const ChipComponent = (props: ChipComponentProps) => {
  const colors = [
    "emerald",
    "sky",
    "rose",
    "violet",
    "amber",
    "indigo",
    "lime",
  ];

  const { label, onClick, index, className = "" } = props;

  const color = colors[index];

  return (
    <div
      className={`${className} z-20 flex items-center px-2 py-1 border border-${color}-300 rounded-full cursor-pointer 
      bg-${color}-900 hover:bg-${color}-600`}
      onClick={onClick}
    >
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
};
export default ChipComponent;
