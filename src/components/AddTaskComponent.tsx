import { z } from "zod";

export const AddTaskComponentSchema = z.object({
  inputValue: z.string(),
  setInputValue: z.function().args(z.string()).returns(z.void()),
});

export type AddTaskComponentProps = z.infer<typeof AddTaskComponentSchema>;

const AddTaskComponent = (props: AddTaskComponentProps) => {
  
  const {inputValue, setInputValue} = props;
  
  return (
    <div className="flex flex-col text-sm">
      <div
        className={`flex items-center hover:bg-gray-800 dark:hover:bg-gray-800 pt-1 pb-1`}
      >
        <div className="cursor-edit pl-14">
          <input
            type="text"
            value={inputValue}
            placeholder="Add task..."
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            className="border-none focus:ring-0"
          />
        </div>
      </div>

      <hr className="h-px w-full bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  );
};

export default AddTaskComponent;
