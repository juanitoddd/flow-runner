import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { HiLink } from 'react-icons/hi';

const FetchNode = ({ data, isConnectable, targetPosition = Position.Top, sourcePosition = Position.Bottom }: NodeProps) => {
  return (
    <>
      <Handle
        type="target"
        position={targetPosition}
        isConnectable={isConnectable}
      />
      <div className='flex flex-col border border-solid border-gray-200 h-full rounded-2xl bg-white/70 shadow-[0_7px_9px_0_rgba(0,0,0,0.02)]'>
        <div className='text-xs px-3 py-2 border-b border-solid border-gray-200 font-mono font-semibold rounded-t-2xl'>
          Fetch
        </div>
        <div className='relative bg-white p-3 flex rounded-b-2xl'>
        <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="email4" value="URL endpoint" />
            </div>
            <TextInput id="email4" type="text" rightIcon={HiLink} placeholder="https://mock.api" required />
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

FetchNode.displayName = "FetchNode";

export default memo(FetchNode);
