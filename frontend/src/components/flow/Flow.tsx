import { useCallback, useEffect } from "react";
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Panel,
  Connection,
  useNodesState,
  useEdgesState,
  applyEdgeChanges, 
  applyNodeChanges
} from "reactflow";

import { nanoid } from 'nanoid';

import CustomNode from "../../nodeTypes/CustomNode";
import PythonNode from '../../nodeTypes/PythonNode';
import FetchNode from '../../nodeTypes/FetchNode';

import "reactflow/dist/style.css";

import {useDispatch, useSelector} from 'react-redux'
import { AppDispatch, RootState } from '../../store/store';
import { Menu } from '../ui/Menu';
import { Actions } from '../ui/Actions';
import { updateNodePosition, addFlowEdge } from '../../features/flow/flowSlice';

const nodeTypes = {
  python: PythonNode,
  fetch: FetchNode,
  custom: CustomNode
};

const findNode = (nodes:Node[], id:string): Node | undefined => nodes.find((_node: Node) => _node.id === id) 

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [
  //{ id: "e1-2", source: "1", target: "2", animated: true },
  //{ id: "e1-3", source: "1", target: "3" }
];

const BasicFlow = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const pyNodes = useSelector((state: RootState) => state.nodes.nodes);
  const flowNodes = useSelector((state: RootState) => state.flow.nodes);  
  const flowEdges = useSelector((state: RootState) => state.flow.edges);

  const [nodes, setNodes] = useNodesState([]);  
  const [edges, setEdges] = useEdgesState([]);

  const onNodesChange = useCallback(
    (changes: any) => {  
      setNodes((nds) => applyNodeChanges(changes, nds))
      // Save position in Store
      if(changes[0].type === 'position' && !changes[0].dragging) {
        const id = changes[0].id        
        const node = findNode(nodes, id)        
        if(node) dispatch(updateNodePosition({id, position: node.position}))
      }
    },
    [nodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      console.log("[onEdgesChange] changes", changes)
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Edge | Connection) => { 
      console.log("connection", connection)
      // Save connection in Store      
      if(connection.source && connection.target) {
        const edge: Edge = {
          id: nanoid(),
          source: connection.source,
          target: connection.target,
          targetHandle: connection.targetHandle,
          sourceHandle: connection.sourceHandle
        }
        dispatch(addFlowEdge(edge))
      }
      setEdges((els) => addEdge(connection, els))
    },
    [setEdges]
  );  
    
  useEffect(() => {    
    setNodes(flowNodes)
  }, [flowNodes.length]);

  useEffect(() => {    
    setEdges(flowEdges)
  }, [flowEdges.length]);

  return (    
    <ReactFlow    
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Panel position='top-left'><Actions /></Panel>
      <Panel position='top-right'><Menu /></Panel>
    </ReactFlow>    
  );
};

export default BasicFlow;
