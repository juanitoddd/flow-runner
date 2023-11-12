import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { SpinnerCircularSplit, SpinnerInfinity } from 'spinners-react';
import { addNode } from '../../features/flow/flowSlice';
import { MdDashboardCustomize } from "react-icons/md"
import { PiCodeBlockLight, PiWaveTriangleDuotone } from "react-icons/pi"
import { nanoid } from 'nanoid'
import { Node } from "reactflow";

export function PanelLeft() {  
  const dispatch = useDispatch<AppDispatch>();
  const pyNodes = useSelector((state: RootState) => state.nodes.nodes);  
  const addNodeToFlow = (e:MouseEvent, node: Node) => {
    // TEMP: In case you want to add more instances of the same node
    // const _node = JSON.parse(JSON.stringify(node))
    // _node.id = `${_node.id}_${nanoid()}`
    dispatch(addNode(node))
  }
  const addInputNode = (e:MouseEvent) => {
    
  }
  return (
    <aside
        className="h-screen pt-1 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
          <ul className="space-y-2">            
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <MdDashboardCustomize />
                <span className="ml-3">Components</span>
              </a>
            </li>          
          <li>
            <button
              type="button"
              className="flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              aria-controls="dropdown-custom"
              data-collapse-toggle="dropdown-custom"
            >
              <PiCodeBlockLight />
              <span className="flex-1 ml-3 text-left whitespace-nowrap">Custom</span>
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <ul id="dropdown-custom" className="hidden py-2 space-y-2">
              {pyNodes.map((_node) => <li key={_node.id}>
                <button onClick={(e) => addNodeToFlow(e, _node)} className="bg-white rounded border border-gray-200 flex items-center capitalize p-2 pl-4 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  {_node.data.label.replace('.py', '')} 
                </button>             
              </li>)}                            
            </ul>
          </li>
          <li>
            <button
              type="button"
              className="flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              aria-controls="dropdown-common"
              data-collapse-toggle="dropdown-common"
            >
              <PiWaveTriangleDuotone/>
              <span className="flex-1 ml-3 text-left whitespace-nowrap">Common</span>
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <ul id="dropdown-common" className="hidden py-2 space-y-2">
              <li>
                <button onClick={(e) => addInputNode(e)} className="bg-white rounded border border-gray-200 flex items-center capitalize p-2 pl-4 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  Input 
                </button>
              </li>             
            </ul>
          </li>
          </ul>
        </div>
      </aside>
  )
}