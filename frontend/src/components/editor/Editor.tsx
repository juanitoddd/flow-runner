import { useCallback, useRef, useState } from "react";
// import MonacoEditor from "react-monaco-editor";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useGetNodeCodeQuery } from "../../services/nodes";

import Editor from '@monaco-editor/react';

export const EditorPanel = () => {
  const node = useSelector((state: RootState) => state.nodes.nodes.find(n => n.data.id === state.nodes.selectedNode));
  const code = useSelector((state: RootState) => state.nodes.code)
  console.log("🚀 ~ node:", node)
  if (node) {    

    const { data, error, isLoading } = useGetNodeCodeQuery(node.data.label)
    
    const editorRef = useRef(null);    
    
    const handleEditorDidMount = (editor: any, monaco: any) => {
      editorRef.current = editor;
    }

    const showValue = () => {      
      if(editorRef?.current) console.log(editorRef.current.getValue());
    }

    return (
      <div key={node.id} className="">
        <div className="flex items-center">
          <h3 className='text-base p-2 font-medium text-gray-900'>{node.data.label}</h3>
          <button onClick={() => showValue()}>Show Code</button>
        </div>
        {data ?
          <>
            <pre>{data.output}</pre>
            <Editor
              height="85vh"
              width="100%"
              theme="vs-dark"
              defaultLanguage="python"
              // defaultValue={data.output}
              value={data.output}
              onMount={handleEditorDidMount}  
            />          
          </>
        : null}        
      </div>
    );
  } else {
    return null
  }  
};
