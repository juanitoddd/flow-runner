import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { HiPlay } from 'react-icons/hi';
import { runNode } from '../services/nodes';

const PythonNode = ({ data, isConnectable, targetPosition = Position.Top, sourcePosition = Position.Bottom }: NodeProps) => {

  return (
    <>
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
      />
      <div className='flex flex-col border border-solid border-gray-200 h-full rounded-2xl bg-white/70 shadow-[0_7px_9px_0_rgba(0,0,0,0.02)]'>
        <div className='text-xs px-3 py-2 border-b border-solid border-gray-200 font-mono font-semibold rounded-t-2xl'>          
          <div>{data?.label}</div>
        </div>
        <div className='relative bg-white p-3 flex rounded-b-2xl'>
          <div>
            <Button onClick={() => runNode(data?.label)} color="blue" size="sm">
              <HiPlay className="mr-2 h-5 w-5" /> Run
            </Button>  
          </div>          
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

PythonNode.displayName = "PythonNode";

export default memo(PythonNode);
