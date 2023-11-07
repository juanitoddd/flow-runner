import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { SpinnerCircularSplit, SpinnerInfinity } from 'spinners-react';
import { Node } from "reactflow";
import { classNames } from '../../utils/css';

export function Output() {  
  const nodes = useSelector((state: RootState) => state.nodes.nodes);
    return (
        <>        
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
                <div className={
                    classNames({
                    'p-3 bg-slate-800 text-white rounded font-display border-2 border-solid': true,
                    'border-gray-200': _node.data.state === 'idle',
                    'border-teal-500': _node.data.state === 'running',
                    'border-lime-600': _node.data.state === 'success',
                    'border-red-500': _node.data.state === 'error',
                    })}>
                    <ul>
                    {_node.data.output.map((_line: string, _i: number) => <li key={_i}>{_line}</li>)}  
                    </ul>              
                </div>
            </div>
            : null
            )
        }
        </>
  )
}