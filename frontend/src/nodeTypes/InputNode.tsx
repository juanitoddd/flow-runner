import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const InputNode = ({ data, isConnectable, targetPosition = Position.Top, sourcePosition = Position.Bottom }: NodeProps) => {
  return (
    <>
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
      />
      <div className='flex flex-col border border-solid border-gray-200 h-full rounded-2xl bg-white/70 shadow-[0_7px_9px_0_rgba(0,0,0,0.02)]'>
        <div className='text-xs px-3 py-2 border-b border-solid border-gray-200 font-mono font-semibold rounded-t-2xl'>
          Input
        </div>
        <div className='relative bg-white p-3 flex rounded-b-2xl'>          
          <input type="text" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" />
        </div>
      </div>
      <Handle
        type="source"
        position={sourcePosition}
        isConnectable={isConnectable}
      />
    </>
  );
};

InputNode.displayName = "InputNode";

export default memo(InputNode);
