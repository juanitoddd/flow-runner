import { memo } from "react";
import { Handle, NodeProps, Position, Node } from "reactflow";
import { FaPython, FaPlay } from 'react-icons/fa';
import { HiCode } from 'react-icons/hi';
import { SpinnerCircularSplit, SpinnerRoundFilled } from 'spinners-react';

import styles from "./python.module.css"

import {useDispatch, useSelector} from 'react-redux'
import { AppDispatch, RootState } from '../store/store';
import { runningNode, selectNode } from '../features/nodes/nodesSlice';
import { classNames } from '../utils/css';

const ArgType = (props: any) => {
  return (
    <span
      style={{fontSize: 9, paddingRight: 4, paddingLeft: 4}}
      className={
        classNames({
          'flex item-center text-slate-400 rounded mr-2 p-0 font-robotic': true,
          'bg-slate-100': props.type === 'str',
          'bg-stone-100': props.type === 'float',
          'bg-neutral-100': props.type === 'int',
          'bg-zinc-100': props.type === 'list',
          'bg-emerald-900': props.type === 'dict',
          'bg-gray-100': props.type === 'bool',
        })
      }
    >
      {props.type}
    </span>
  )
}

const PythonNode = ({ id, data, isConnectable }: NodeProps) => {
  const node = useSelector((state: RootState) => state.nodes.nodes.find((_node: Node) => _node.data?.label === data.label));  
  const selected = useSelector((state: RootState) => state.nodes.selectedNode)
  const dispatch = useDispatch<AppDispatch>();

  const selectThisNode = (e: MouseEvent, node: Node) => {
    e.stopPropagation()    
    dispatch(selectNode(node.data.id))    
  }

  const runNode = (e: MouseEvent, node: Node) => {
    e.stopPropagation()    
    dispatch(runningNode(node))
  }

  if(node) {    
    const ninputs = node.data.main.inputs ? node.data.main.inputs.length : 0
    return (    
      <>
        {node.data.main.inputs && node.data.main.inputs.map((_arg: string[], _i:number) => 
          <Handle
            key={_i}
            type="target"
            className={styles.inputHandle}
            position={Position.Left}
            isConnectable={isConnectable}
            style={{top: 34 + 12 + (_i * 24) }}
          />
        )}        
          <div onClick={(e) => selectThisNode(e, node)} className={
            classNames({
              'flex flex-col border border-solid h-full rounded-xl bg-white/70 shadow-[0_7px_9px_0_rgba(0,0,0,0.02)]': true,
              'border-gray-200': node.data.state === 'idle',
              'border-teal-500': node.data.state === 'running',
              'border-lime-600': node.data.state === 'success',
              'border-red-500': node.data.state === 'error',
            })
          }>
          <div className={
            classNames({
              'text-xs px-3 py-2 border-b border-solid border-gray-200 font-mono font-semibold rounded-t-xl': true,
              'bg-slate-100': node.data.id === selected,
              'border-gray-200': node.data.state === 'idle',
              'border-teal-500': node.data.state === 'running',
              'border-lime-600': node.data.state === 'success',
              'border-red-500': node.data.state === 'error',
            })}
          >          
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <HiCode color='#999'/>
                <span className={styles.nodeName}>{node.data?.label.replace('.py', '')}</span>
              </div>
              {node.data.state === 'running' ? <SpinnerRoundFilled  size={12} thickness={100} speed={100} color="rgb(20 184 166)" /> : 
                <div className={
                  classNames({
                    [styles.nodeStatus]: true,
                    'rounded-full': true,
                    'bg-gray-500': node.data.state === 'idle',
                    'bg-teal-500': node.data.state === 'running',
                    'bg-lime-600': node.data.state === 'success',
                    'bg-red-500': node.data.state === 'error',
                  })}                
                ></div>
              }
            </div>
          </div>
          <div className='relative bg-white rounded-b-xl'>
            <div className='text-xs'>
              {node.data.main.inputs && node.data.main.inputs.map((_arg: string[], _i: number) =>
                <div key={_i} className="flex items-center border-b border-solid border-gray-100 pl-2 py-1">
                  <ArgType type={_arg[1]}/>
                  <span>{_arg[0]}</span>
                </div>
              )}
              {node.data.main.output && 
                <div className="flex items-center border-b border-solid border-gray-200 pr-2 py-1 flex justify-end">
                  <ArgType type={node.data.main.output[1]}/>
                  <span>{node.data.main.output[0]}</span>
                </div>
              }
            </div>
            <div className="p-3">
              { node?.data.state === 'running' ?
                <button disabled type="button" className="px-2 py-1 text-white text-xs bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                  <SpinnerCircularSplit className="mr-2 h-4 w-5" size={16} thickness={100} speed={100} color="#fff" secondaryColor="rgba(255, 255, 255, 0.44)" /> Running
                </button>
                :
                <button onClick={(e) => runNode(e, node)} type="button" className="px-2 py-1 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <FaPlay className="mr-2 h-3 w-3" /> Run                
                </button>
              }
            </div>
          </div>
        </div>
        {node.data.main.output && 
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className={styles.outputHandle}
          style={{top: 34 + 13 + (ninputs * 25) }}
        />
        }
      </>
    );
  } else return <></>
};

PythonNode.displayName = "PythonNode";

export default memo(PythonNode);
