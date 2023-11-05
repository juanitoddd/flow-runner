import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { SpinnerCircularSplit, SpinnerInfinity } from 'spinners-react';
import { Node } from "reactflow";

export function Output() {
  const running = useSelector((state: RootState) => state.nodes.runningNode);
  const nodes = useSelector((state: RootState) => state.nodes.nodes);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <aside
      className="fixed top-0 right-0 z-40 w-2/6 h-screen pt-14 transition-transform -translate-x-full bg-white border-l border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"      
      aria-label="Sidenav"
      id="output"
    >
      <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
      {
        nodes.map((_node:Node) =>
        _node.data.output.length ?
        <div key={_node.id} className="">
          <div className="flex items-center">
              <h3 className='text-base p-2 font-medium text-gray-900'>{_node.data.label}</h3>
              {_node.data.state === 'running' ?
              <SpinnerInfinity size={24} thickness={100} speed={100} color="#fff" secondaryColor="rgba(0, 0, 0, 0.44)" />              
              : null
              }
          </div>
          <div className="p-3 bg-slate-800 text-white rounded font-display">
            <ul>
              {_node.data.output.map((_line: string, _i: number) => <li key={_i}>{_line}</li>)}  
            </ul>              
          </div>
        </div>
        : null
        )
      }
      </div>     
    </aside>
  )
}