import { useCallback, useEffect } from "react";
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState
} from "reactflow";

import CustomNode from "./nodeTypes/CustomNode";
import PythonNode from './nodeTypes/PythonNode';
import FetchNode from './nodeTypes/FetchNode';

import "reactflow/dist/style.css";

import {useDispatch, useSelector} from 'react-redux'
import { AppDispatch, RootState } from './store/store';

const nodeTypes = {
  python: PythonNode,
  fetch: FetchNode,
  custom: CustomNode
};

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [
  //{ id: "e1-2", source: "1", target: "2", animated: true },
  //{ id: "e1-3", source: "1", target: "3" }
];

const BasicFlow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pyNodes = useSelector((state: RootState) => state.nodes.nodes);  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);  
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );  
    
  useEffect(() => {
    console.log("🚀 ~ useEffect triggered")
    setNodes(pyNodes)
  }, [pyNodes.length]);

  const onNodesChanges = (any: any) => {    
    onNodesChange(any)
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChanges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
    </ReactFlow>
  );
};

export default BasicFlow;
