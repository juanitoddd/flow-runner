import { memo } from "react";
import { Handle, NodeProps, Position, Node } from "reactflow";
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { HiPlay } from 'react-icons/hi';
import { FaPython, FaPlay } from 'react-icons/fa';
import { SpinnerCircularSplit } from 'spinners-react';
// import { runNode } from '../services/nodes';

import {useDispatch, useSelector} from 'react-redux'
import { AppDispatch, RootState } from '../store/store';
import { runningNode } from '../features/nodes/nodesSlice';
import { classNames } from '../utils/css';

const PythonNode = ({ id, data, isConnectable, targetPosition = Position.Top, sourcePosition = Position.Bottom }: NodeProps) => {
  const running = useSelector((state: RootState) => state.nodes.runningNode);
  const node = useSelector((state: RootState) => state.nodes.nodes.find((_node:Node) => _node.data?.label === data.label));  
  const dispatch = useDispatch<AppDispatch>();
  if(node) {
    return (    
      <>
        <Handle
          type="target"
          position={targetPosition}
          isConnectable={isConnectable}
        />
          <div className={
            classNames({
              'flex flex-col border border-solid h-full rounded-2xl bg-white/70 shadow-[0_7px_9px_0_rgba(0,0,0,0.02)]': true,
              'border-gray-200': node.data.state === 'idle',
              'border-teal-500': node.data.state === 'running',
              'border-lime-600': node.data.state === 'success',
              'border-red-500': node.data.state === 'error',
            })
          }>
          <div className='text-xs px-3 py-2 border-b border-solid border-gray-200 font-mono font-semibold rounded-t-2xl'>          
            <div className="flex items-center gap-1"><FaPython/>{node.data?.label}</div>
          </div>
          <div className='relative bg-white p-3 flex rounded-b-2xl'>
            <div>
              { node?.data.state === 'running' ?
                <button disabled type="button" className="px-2 py-1 text-white text-xs bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                  <SpinnerCircularSplit className="mr-2 h-4 w-5" size={16} thickness={100} speed={100} color="#fff" secondaryColor="rgba(255, 255, 255, 0.44)" /> Running
                </button>
                :
                <button onClick={() => dispatch(runningNode(node))} type="button" className="px-2 py-1 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <FaPlay className="mr-2 h-3 w-3" /> Run                
                </button>
              }
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
  } else return <></>
};

PythonNode.displayName = "PythonNode";

export default memo(PythonNode);
